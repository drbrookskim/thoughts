"""Derive the knowledge graph from the article bodies.

The graph used to be synthetic: articles were linked to whichever article sat
next to them in the category listing, which is an artefact of the sort order and
not a relationship. This builds it from the text instead — TF-IDF over the 189
bodies for article-to-article edges, plus a concept node for every distinctive
term that more than one article leans on.

Layout is solved here rather than in the browser. The runtime keeps physics off,
so the coordinates have to arrive precomputed.
"""

import json
import math
import os
import re

import numpy as np

ARTICLES_DIR = 'brunch_articles'
API_DIR = 'api'

# Terms this rare are noise, this common carry no signal about a specific article.
MIN_DF = 2
MAX_DF_RATIO = 0.30

SIM_EDGES_PER_ARTICLE = 3
SIM_THRESHOLD = 0.08

CONCEPT_TERMS_PER_ARTICLE = 6
CONCEPT_MIN_ARTICLES = 2
# A term only one or two articles use cannot become a shared hub, and TF-IDF
# ranks exactly those highest. Restricting candidacy is what turns the concept
# layer into hubs instead of 189 private labels.
CONCEPT_MIN_DF = 3
CONCEPT_MAX_NODES = 320
# A concept binds its articles more loosely than a direct similarity does, so it pulls
# less. Above ~0.8 the concept hubs swallow the article clusters.
CONCEPT_EDGE_PULL = 0.55

# Korean attaches grammatical particles to the stem, so the same concept appears
# as 기획, 기획의, 기획을. Longest first — stripping 의 before 의는 would leave 는.
JOSA = (
    '에서는', '으로는', '에게서', '으로써', '으로서', '이라는', '라는',
    '에서', '에게', '으로', '까지', '부터', '이라', '하는', '한다', '했다',
    '이다', '들의', '들이', '들을', '과의', '와의',
    '의', '은', '는', '이', '가', '을', '를', '에', '로', '와', '과', '도', '만', '들',
)

STOPWORDS = {
    '그리고', '그러나', '하지만', '그래서', '따라서', '때문', '그런', '이런', '저런',
    '것이', '것은', '것을', '수는', '수가', '있는', '없는', '같은', '많은', '어떤',
    '우리', '이것', '그것', '저것', '여기', '거기', '무엇', '대한', '위해', '통해',
    '대해', '라고', '있다', '없다', '같다', '된다', '한다', '하다', '되는', '되어',
    '모든', '다시', '가장', '아주', '매우', '역시', '결국', '물론', '만약', '혹은',
    '그런데', '그러면', '오히려', '이렇게', '그렇게', '지금', '이제', '아직',
}


def tokenize(text):
    """Hangul and Latin word stems. No morphological analyser — this is a
    suffix strip, which is enough to make the same concept collide."""
    text = re.sub(r'https?://\S+', ' ', text)
    text = re.sub(r'[`*_>#\[\]()|-]', ' ', text)

    tokens = []
    for raw in re.findall(r'[가-힣]{2,}|[A-Za-z]{3,}', text):
        if raw.isascii():
            tokens.append(raw.lower())
            continue
        for suffix in JOSA:
            if raw.endswith(suffix) and len(raw) - len(suffix) >= 2:
                raw = raw[:-len(suffix)]
                break
        if len(raw) >= 2 and raw not in STOPWORDS:
            tokens.append(raw)
    return tokens


def tfidf(docs):
    """L2-normalised TF-IDF matrix and its vocabulary, stdlib counting + numpy."""
    n = len(docs)
    df = {}
    counted = []
    for tokens in docs:
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1
        counted.append(tf)
        for t in tf:
            df[t] = df.get(t, 0) + 1

    max_df = max(MIN_DF, int(n * MAX_DF_RATIO))
    vocab = sorted(t for t, c in df.items() if MIN_DF <= c <= max_df)
    index = {t: i for i, t in enumerate(vocab)}

    matrix = np.zeros((n, len(vocab)), dtype=np.float32)
    for row, tf in enumerate(counted):
        for term, count in tf.items():
            col = index.get(term)
            if col is not None:
                matrix[row, col] = (1 + math.log(count)) * math.log(n / df[term])

    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1
    return matrix / norms, vocab


def similarity_edges(matrix):
    """Top-K neighbours per article, deduplicated to undirected pairs."""
    # Accelerate leaves stale FP exception flags after this product, so numpy
    # reports an overflow that did not happen. Assert the result instead of
    # trusting the flags.
    with np.errstate(all='ignore'):
        sim = matrix @ matrix.T
    assert np.isfinite(sim).all(), 'similarity matrix diverged'
    np.fill_diagonal(sim, 0)

    edges = {}
    for i in range(sim.shape[0]):
        for j in np.argsort(sim[i], kind='stable')[::-1][:SIM_EDGES_PER_ARTICLE]:
            weight = float(sim[i, j])
            if weight < SIM_THRESHOLD:
                break
            key = (i, int(j)) if i < j else (int(j), i)
            edges[key] = max(edges.get(key, 0), weight)
    return [(a, b, w) for (a, b), w in edges.items()]


def concept_links(matrix, vocab):
    """Terms that carry more than one article become their own node. This is
    what gives the graph its hubs — without them every article only ever
    touches its four nearest neighbours and the result is a uniform mesh.

    Sorted stably: terms sharing a document frequency and a term frequency get
    identical scores, and numpy's default quicksort broke those ties differently
    on the CI runner than here. That reshuffled which terms became concepts, and
    a handful of different nodes is enough to relax the layout somewhere else
    entirely — the graph rearranged itself on every sync."""
    shareable = np.where((matrix > 0).sum(0) >= CONCEPT_MIN_DF, matrix, 0)

    holders = {}
    for row in range(shareable.shape[0]):
        for col in np.argsort(shareable[row], kind='stable')[::-1][:CONCEPT_TERMS_PER_ARTICLE]:
            if shareable[row, col] <= 0:
                break
            holders.setdefault(vocab[col], []).append(row)

    kept = [(term, rows) for term, rows in holders.items()
            if len(rows) >= CONCEPT_MIN_ARTICLES]
    kept.sort(key=lambda pair: len(pair[1]), reverse=True)
    return kept[:CONCEPT_MAX_NODES]


def layout(node_count, edges, iterations=600, seed=7):
    """Fruchterman-Reingold. Gravity is in there because the graph is not fully
    connected and stray components otherwise drift out past the viewport."""
    rng = np.random.default_rng(seed)
    pos = rng.normal(0, 1, (node_count, 2)) * 200

    src = np.array([e[0] for e in edges], dtype=np.int32)
    dst = np.array([e[1] for e in edges], dtype=np.int32)
    weight = np.array([e[2] for e in edges], dtype=np.float64)

    # ForceAtlas2's repulsion, not Fruchterman-Reingold's: scaling by degree is what
    # opens the graph out. With uniform repulsion a mesh this dense always relaxes into
    # one even disc — hubs have to push harder than leaves for structure to show.
    degree = np.ones(node_count)
    np.add.at(degree, src, 1.0)
    np.add.at(degree, dst, 1.0)
    # Normalised to mean 1 so only the *relative* degree matters. Unnormalised this
    # multiplies every repulsion by ~deg², which blows the graph out into a hollow shell.
    mass = np.outer(degree, degree) / (degree.mean() ** 2)

    # Ideal edge length for the area the graph is meant to fill. Hardcoding it made
    # the whole thing collapse into one uniform disc — every node was closer than it
    # wanted to be, so no cluster could open up.
    k = math.sqrt((1800.0 ** 2) / node_count)
    temp = 300.0
    for _ in range(iterations):
        delta = pos[:, None, :] - pos[None, :, :]
        dist2 = (delta ** 2).sum(-1) + 0.01
        disp = (delta * ((k * k) * mass / dist2)[:, :, None]).sum(1)

        span = pos[src] - pos[dst]
        length = np.sqrt((span ** 2).sum(-1)) + 1e-9
        pull = span * ((length / k) * weight / length)[:, None]
        np.add.at(disp, src, -pull)
        np.add.at(disp, dst, pull)

        # Just enough gravity to keep the disconnected components in frame. More than
        # this and it overwhelms the edge forces and packs everything into a disc.
        disp -= pos * 0.004

        step = np.sqrt((disp ** 2).sum(-1)) + 1e-9
        pos += disp / step[:, None] * np.minimum(step, temp)[:, None]
        temp *= 0.991

    return pos


def solve_positions(node_count, edges):
    """Run the layout and fit it to the canvas extent the runtime frames from."""
    positions = layout(node_count, edges)
    positions -= positions.mean(axis=0)
    # Fitting a round layout into a widescreen pane leaves the zoom limited by height
    # and half the width empty, so the extent is stretched to the pane's aspect ratio.
    extent = np.abs(positions).max(axis=0)
    extent[extent == 0] = 1.0
    return positions * (np.array([1150.0, 700.0]) / extent)


def previous_positions(nodes, edges, out_path):
    """The coordinates already committed, when the graph they describe is the same one.

    numpy's reductions accumulate in an order that depends on the BLAS and the SIMD
    width, so the solver lands a fraction of a unit apart on the CI runner than it
    does here. graph.json is a single line, which turned that into a whole-file diff
    and an hourly commit even on hours when nothing was published.

    Not solving at all when the structure is unchanged removes the difference rather
    than trying to round it away — no rounding survives two inputs that straddle a
    boundary. It also keeps the map still for readers, which is what they want: the
    graph should move when the writing moves, not every hour."""
    try:
        with open(out_path, encoding='utf-8') as f:
            previous = json.load(f)
    except (OSError, ValueError):
        return None

    ids = [node['id'] for node in nodes]
    if [node['id'] for node in previous['nodes']] != ids:
        return None

    want = {(nodes[a]['id'], nodes[b]['id']) for a, b, _ in edges}
    have = {(edge['from'], edge['to']) for edge in previous['edges']}
    if want != have:
        return None

    if any('x' not in node or 'y' not in node for node in previous['nodes']):
        return None
    return np.array([[node['x'], node['y']] for node in previous['nodes']], dtype=float)


def build(articles_path=os.path.join(API_DIR, 'articles.json'),
          articles_dir=ARTICLES_DIR,
          out_path=os.path.join(API_DIR, 'graph.json')):
    with open(articles_path, encoding='utf-8') as f:
        articles = json.load(f)

    docs = []
    for article in articles:
        path = os.path.join(articles_dir, article['filename'])
        with open(path, encoding='utf-8') as f:
            docs.append(tokenize(f.read()))

    matrix, vocab = tfidf(docs)
    sim_edges = similarity_edges(matrix)
    concepts = concept_links(matrix, vocab)

    nodes = [{
        'id': f"a{article['id']}",
        'articleId': article['id'],
        'label': article['title'],
        'type': 'article',
        'category': article['category'],
    } for article in articles]

    # Cosine similarities land around 0.05-0.3 while a concept link is a flat 1.0, so
    # left as-is the concept layer out-pulls the article layer tenfold and drags the
    # whole graph into its centre. Normalise both onto the same scale.
    peak = max((w for _, _, w in sim_edges), default=1.0)
    edges = [(a, b, w / peak) for a, b, w in sim_edges]

    for term, rows in concepts:
        concept_index = len(nodes)
        nodes.append({
            'id': f'c:{term}',
            'label': term,
            'type': 'concept',
            'category': articles[rows[0]]['category'],
        })
        for row in rows:
            edges.append((row, concept_index, CONCEPT_EDGE_PULL))

    positions = previous_positions(nodes, edges, out_path)
    if positions is None:
        positions = solve_positions(len(nodes), edges)

    degree = [0] * len(nodes)
    for a, b, _ in edges:
        degree[a] += 1
        degree[b] += 1

    for i, node in enumerate(nodes):
        node['x'] = round(float(positions[i, 0]), 1)
        node['y'] = round(float(positions[i, 1]), 1)
        node['degree'] = degree[i]

    graph = {
        'nodes': nodes,
        'edges': [{'from': nodes[a]['id'], 'to': nodes[b]['id'],
                   'weight': round(float(w), 3)} for a, b, w in edges],
    }
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(graph, f, ensure_ascii=False)

    articles_n = sum(1 for n in nodes if n['type'] == 'article')
    print(f"Generated {out_path}: {articles_n} articles + "
          f"{len(nodes) - articles_n} concepts, {len(edges)} edges")
    return graph


def demo():
    assert tokenize('기획의 본질과 기획을 논한다') == ['기획', '본질', '기획', '논한다'], tokenize('기획의 본질과 기획을 논한다')
    # Stripping must not eat a stem: 정의 is not 정 + 의.
    assert tokenize('정의') == ['정의']

    docs = [
        tokenize('기획 기획 가치 설계'),
        tokenize('기획 가치 설계 구조'),
        tokenize('시장 가격 경쟁 시장'),
    ]
    matrix, vocab = tfidf(docs)
    assert vocab, 'vocabulary collapsed'
    sim = matrix @ matrix.T
    assert sim[0, 1] > sim[0, 2], 'shared-vocabulary docs must score closer'

    # Every term here scores identically, so the pick is decided purely by the
    # tie-break. It has to be the same one twice, and on any other machine too.
    tied = [tokenize('가치 설계 구조 시장'), tokenize('가치 설계 구조 시장')]
    tied_matrix, tied_vocab = tfidf(tied + [tokenize('가치 설계 구조 시장')])
    picked = [term for term, _ in concept_links(tied_matrix, tied_vocab)]
    assert picked == [term for term, _ in concept_links(tied_matrix, tied_vocab)]
    assert picked == sorted(picked, key=lambda t: -tied_vocab.index(t)), picked

    pos = layout(4, [(0, 1, 1.0), (2, 3, 1.0)], iterations=60)
    assert np.isfinite(pos).all(), 'layout diverged'
    linked = np.linalg.norm(pos[0] - pos[1])
    unlinked = np.linalg.norm(pos[0] - pos[2])
    assert linked < unlinked, 'linked nodes must settle closer than unlinked ones'

    # Coordinates are reused only while the graph they belong to is the same one.
    import tempfile
    nodes = [{'id': 'a1', 'x': 5.0, 'y': 6.0}, {'id': 'c:x', 'x': -5.0, 'y': -6.0}]
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump({'nodes': nodes, 'edges': [{'from': 'a1', 'to': 'c:x'}]}, f)
        path = f.name
    same = previous_positions(nodes, [(0, 1, 1.0)], path)
    assert same is not None and same.tolist() == [[5.0, 6.0], [-5.0, -6.0]], same
    # A changed edge set has to force a fresh solve, not silently keep stale coordinates.
    assert previous_positions(nodes, [], path) is None
    assert previous_positions(nodes + [{'id': 'a2'}], [(0, 1, 1.0)], path) is None
    assert previous_positions(nodes, [(0, 1, 1.0)], path + '.missing') is None
    os.unlink(path)

    print('build_graph self-check ok')


if __name__ == '__main__':
    demo()
