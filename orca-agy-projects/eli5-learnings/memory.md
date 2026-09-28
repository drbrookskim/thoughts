# 🧠 Workspace Memory & Project Context (`memory.md`)

이 문서는 본 프로젝트의 핵심 작업 내역, 하네스(Harness) 구조, 생성된 산출물 및 히스토리를 기록하고 관리하는 전역 메모리 파일입니다.

---

## 📅 작업 기록 (Change Log & Work History)

### 2026-08-08: AI 학습 가이드 하네스 구축 및 종합 가이드 제작

#### 1. 주요 작업 목적
- 머신러닝(ML) 기초부터 딥러닝(DL), 트랜스포머(Transformer), 대규모 언어 모델(LLM), 및 2026년 최첨단 프론티어 모델(**Claude Fable 5**, **GPT-5.6 Sol**)을 망라하는 체계적인 AI 학습 가이드 구축 및 에이전트 하네스 환경 조성.

#### 2. 구축된 하네스 아키텍처 (Harness Architecture)
* **에이전트 정의 (`.claude/agents/`)**:
  * `ai-curriculum-architect.md`: 커리큘럼 단계별 위계 및 로드맵 설계
  * `ml-dl-theory-instructor.md`: ML/DL/Transformer 직관적 수식 및 PyTorch 코드 구현
  * `frontier-model-analyst.md`: 2026 프론티어 모델 (Claude Fable 5, GPT-5.6 Sol) 특성 및 사양 심층 분석
  * `pedagogy-qa-editor.md`: 학습 효과성 검수, 시각 자료(Mermaid) 및 최종 통합
* **전문 스킬 (`.claude/skills/`)**:
  * `ai-curriculum-design/SKILL.md`
  * `code-and-math-explainer/SKILL.md`
  * `frontier-model-deepdive/SKILL.md`
  * `learning-guide-orchestrator/SKILL.md`
* **설정 및 하네스 포인터**:
  * `CLAUDE.md`: 하네스 포인터 및 갱신 이력 명시
  * `GEMINI.md`: 하네스 트리거 규칙 등록

#### 3. 최종 산출물 (Key Deliverable)
* **[`ai_learning_guide.md`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/ai_learning_guide.md)**:
  1. 전체 학습 로드맵 Mermaid 다이어그램
  2. Part 1: Classical Machine Learning (선형 모델, 트리 앙상블, 편향-분산 트레이드오프)
  3. Part 2: Deep Learning Foundations (MLP, ReLU/GELU/SwiGLU, AdamW, PyTorch 커스텀 신경망)
  4. Part 3: Transformer Revolution (Attention 수학, PyTorch Multi-Head Attention 구현)
  5. Part 4: LLM Era & Reasoning Paradigm (Pre-training, LoRA, DPO, CoT, Test-time compute)
  6. Part 5: 2026 Frontier Models (**Claude Fable 5** - Mythos-class 1M context vs **GPT-5.6 Sol** - Multi-agent 1.05M context 입체 비교표)
  7. Part 6: PyTorch 마스킹 실습 및 멀티에이전트 오케스트레이션 구축 과제

#### 4. HTML 변환 및 다이어그램 디자인 적용 (`ai_learning_guide.html`)
* **`diagram-design` 스킬 표준 준수**:
  - `style-guide.md` 토큰 시스템 및 typography (Geist, Geist Mono, Instrument Serif) 적용
  - 5-Phase 학습 로드맵을 인라인 SVG 프로세스 플로우 다이어그램으로 완전 구현 (4px grid, 직각 아치형 연결선 `r=8`, 가스킹 마스크 직사각형 및 6-10px 이격 마진)
  - 2026 프론티어 모델(Claude Fable 5, GPT-5.6 Sol)을 Focal Node (Accent border/fill)로 시각적 강조
* **웹 최적화 및 상호작용 기능**:
  - KaTeX CDN 연동 수식 렌더링 (LaTeX math rendering)
  - Prism.js Python 코드 하이라이팅 및 원클릭 복사 기능
  - 다크/라이트 테마 전환 (Local Storage 저장) & 스크롤 진행 바
  - 반응형 목차(Table of Contents) 사이드바

### 2026-08-30: 단일 뉴런(The Art of a Single Neuron) 인터랙티브 ELI5 학습 아티팩트 제작 및 기본 저장소 규칙 확정

#### 1. 저장소 규칙 설정 (Storage Policy)
- **기본 저장 디렉토리 고정**: `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings`
- **지침**: 앞으로 생성되는 모든 ELI5 학습 가이드, HTML 인터랙티브 시각화 아티팩트 및 관련 산출물은 본 디렉토리에 직접 저장하며, 작업 완료 시 `memory.md`에 지속 기록한다.

#### 2. 최종 산출물: [`single_neuron_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/single_neuron_in_depth.html)
- **주제**: The Art of a Single Neuron (단일 뉴런의 미학과 수학적 본질: 입력을 지능으로 변환하는 최소 단위)
- **주요 구성 요소**:
  1. **실시간 뉴런 연산 시뮬레이터 (Live Computing Simulator)**:
     - $x_1, x_2, w_1, w_2, b$, 목표값 $y$, 활성화 함수(Sigmoid, ReLU, Tanh, Step, GELU) 실시간 조작
     - 가중합($z$), 활성화($\hat{y}$), 오차 손실($\mathcal{L}$) 단계별 수식 실시간 출력 및 동적 활성화 곡선/발화점 캔버스 렌더링
     - 1스텝 경사하강법(GD) 실시간 파라미터 갱신 및 손실 감소 시뮬레이션
  2. **2D 결정 경계 플레이그라운드 & XOR 딜레마 (Geometric Interpretation)**:
     - AND, OR, NAND 게이트의 선형 분리 초평면($w_1 x_1 + w_2 x_2 + b = 0$) 캔버스 렌더링
     - 1969년 민스키&페퍼트의 XOR 게이트 선형 분리 불가 한계(XOR Crisis) 시각적 실증
  3. **역사적 연대기 (1943 ~ 2026)**:
     - 1943 McCulloch-Pitts $\to$ 1949 Hebb $\to$ 1958 Rosenblatt Perceptron $\to$ 1969 Minsky XOR Crisis $\to$ 1986 Rumelhart Backprop $\to$ 2012 Deep Learning $\to$ 2026 Mechanistic Interpretability
  4. **4대 수학적 기둥 (Mathematical Foundations)**:
     - ① 가중합과 편향 ($z = \mathbf{w}^T\mathbf{x} + b$)
     - ② 비선형 활성화 ($\sigma(z)$ 및 보편 근사 정리)
     - ③ 손실 함수와 오차 측정 ($\mathcal{L}(\mathbf{w}, b)$)
     - ④ 경사하강법과 가중치 갱신 ($w_j \leftarrow w_j - \eta \frac{\partial \mathcal{L}}{\partial w_j}$)
  5. **생물학적 뉴런 vs 인공 신경망 비교**: 수상돌기/입력, 세포체/가중합, 축삭구/임계역치, 시냅스/가중치 1:1 심층 비교
  6. **활성화 함수 갤러리**: Sigmoid, Tanh, ReLU, GELU, Swish/SiLU, SwiGLU 특성 및 용도
  7. **2026 프론티어 기계론적 해석학**:
     - 슈퍼포지션(다중의미성)과 희소 오토인코더(SAE)를 통한 단일의미성 피처 뉴런 분해
     - 뉴런 클램핑(Feature Clamping)을 통한 환각 억제 및 정렬 제어
     - 인과적 회로 추적(Circuit Tracing)

### 2026-08-31: 이중차분법(Difference-in-Differences, DiD) 인터랙티브 ELI5 학습 아티팩트 제작

#### 1. 최종 산출물: [`difference_in_differences_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/difference_in_differences_in_depth.html)
- **주제**: The Architecture of Difference-in-Differences (이중차분법: 관찰 데이터에서 '순수한 인과효과'를 발라내는 계량경제학의 렌즈)
- **주요 구성 요소**:
  1. **2x2 매트릭스 메커니즘**:
     - 기준 상수($\mu$), 처치군 고유 차이($\gamma$), 시간 트렌드($\lambda$), 정책 효과($\delta$) 수식 분해
     - 차분의 차분($\Delta Y_T - \Delta Y_C = \delta$)을 통한 교란 요인 완벽 소거 증명
  2. **실시간 라이브 DiD 반사실 시뮬레이터 (Interactive Simulator)**:
     - $Y_{T,0}, Y_{T,1}, Y_{C,0}, Y_{C,1}$ 슬라이더 조작에 따른 동적 궤적 및 반사실 점 $Y_{T,1}(0)$ 시각화
     - 1994 Card & Krueger 뉴저지-펜실베이니아 패스트푸드 실증 데이터 원클릭 프리셋
     - 처치군 총 변화($\Delta Y_T$), 대조군 시간 트렌드($\Delta Y_C$), 순수 인과효과($\hat{\delta}_{DiD}$) 실시간 연동
  3. **역사적 연대기 (1854 ~ 2026)**:
     - 1854 John Snow 콜레라 역학조사 $\to$ 1994 Card & Krueger 최저임금 혁명 $\to$ 2000년대 TWFE 패널 회귀 표준 $\to$ 2021 David Card 노벨경제학상 수상 $\to$ 2026 Synthetic DiD & Causal ML
  4. **4대 인과추론 기둥 (Theoretical Framework)**:
     - ① 평행추세 가정 ($\mathbb{E}[Y_1(0) - Y_0(0)|D=1] = \mathbb{E}[Y_1(0) - Y_0(0)|D=0]$)
     - ② 2x2 회귀분석 모형 ($Y_{it} = \beta_0 + \beta_1 Treat_i + \beta_2 Post_t + \beta_3 (Treat_i \times Post_t) + \varepsilon_{it}$)
     - ③ 이원 고정효과 모형 ($Y_{it} = \alpha_i + \lambda_t + \delta D_{it} + \mathbf{X}_{it}'\gamma + \varepsilon_{it}$)
     - ④ 이벤트 스터디와 사전 추세 검정 (Pre-trend Testing & Dynamic Effects)
  5. **단순비교의 함정과 DiD의 우월성**:
     - 단순 전후 비교(Before-After)의 시간 외생 충격 오염 vs 단순 집단 비교(Cross-Sectional)의 선택 편향 오염 vs DiD의 완벽 상쇄
  6. **최신 계량경제학 혁신 (Staggered DiD)**:
     - Goodman-Bacon (2021) 분해와 다중 고정효과(TWFE)의 음의 가중치(Negative Weights) 재앙
     - Callaway & Sant'Anna (2021) 및 Sun & Abraham (2021) 차세대 추정량
  7. **역사적 실증 연구 아카이브**:
     - Card & Krueger (1994), John Snow (1854), China Shock (Autor et al., 2013), 빅테크 플랫폼 준실험 & Synthetic DiD

### 2026-09-06: 시맨틱 지식 체계(Semantics, Taxonomy, Ontology, Knowledge Graph) 인터랙티브 ELI5 학습 아티팩트 제작

#### 1. 최종 산출물: [`semantics_taxonomy_ontology_knowledge_graph_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/semantics_taxonomy_ontology_knowledge_graph_in_depth.html)
- **주제**: The Spectrum of Knowledge: Semantics, Taxonomy, Ontology & Knowledge Graph (단순 문자열에서 기계가 이해하는 지능으로)
- **주요 구성 요소**:
  1. **지식 표현의 사다리 (The Semantic Ladder & Continuum)**:
     - 단순 기호(Syntax) $\to$ 시맨틱스(의미와 맥락) $\to$ 택소노미(is-a 단방향 트리) $\to$ 온톨로지(T-Box: 스키마, 관계, 공리) $\to$ 지식 그래프(A-Box: 실제 인스턴스 트리플 망) 위계적 발전 구조 분석
  2. **실시간 인터랙티브 지식 그래프 시뮬레이터 (Live Knowledge Graph Visualizer)**:
     - HTML Canvas 기반 Force-Directed 노드 및 관계 시각화
     - 도메인 프리셋: [테크 기업 & 창업자] / [식품과학 음료 & 커피 계통학]
     - 노드 클릭 시 상응하는 계층 경로(Taxonomy Path), W3C RDF 트리플(`<Subject, Predicate, Object>`), 온톨로지 OWL 공리(Axioms) 및 자동 추론 규칙(Inference Rules) 실시간 연동 인스펙터
  3. **2,300년의 지식 구조화 연대기 (BC 350 ~ 2026)**:
     - BC 350 아리스토텔레스 범주론/삼단논법 $\to$ 1735 린네 생물분류학(Taxonomy) $\to$ 1993 톰 그루버 온톨로지 정의 $\to$ 2001 팀 버너스 리 시맨틱 웹 $\to$ 2012 구글 지식 그래프("Things, not strings") $\to$ 2026 GraphRAG & 뉴로-심볼릭 AI
  4. **4대 개념의 본질과 수학적·논리적 기둥 (Core Pillars)**:
     - ① 시맨틱스: 의미의 삼각형과 맥락 해석 함수 $\mathcal{I}(\text{Syntax}, \text{Context})$
     - ② 택소노미: 단일 포함 관계 $C_A \sqsubseteq C_B$ 및 단방향 계층 상속
     - ③ 온톨로지: 기술 논리학(Description Logic) 기반 클래스, 관계, 공리 튜플 $\langle \mathcal{C}, \mathcal{R}, \mathcal{A} \rangle$ (T-Box)
     - ④ 지식 그래프: 실체 엔티티 집합과 방향성 라벨 엣지의 트리플 집합 $\{ (s, p, o) \}$ (A-Box)
  5. **4각 비교 분석 매트릭스**:
     - 정의, 자료구조(트리 vs 다차원 그래프), 허용 관계, 데이터/스키마 분리 여부, 기계 추론 능력, 대표 기술 1:1 대조
  6. **W3C 시맨틱 웹 표준 스택 & 글로벌 지식 베이스**:
     - RDF, RDFS, OWL, SPARQL, Wikidata, Schema.org, Gene Ontology, SNOMED-CT
#### 2. 추가 산출물 (슬라이드 발표 덱): [`semantics_knowledge_spectrum_slides.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/semantics_knowledge_spectrum_slides.html)
- **포맷**: 키보드 내비게이션(←, →, Space, F 전체화면)을 지원하는 16:9 다크 모던 프레젠테이션 슬라이드 데크 (총 12장 구성)
- **슬라이드 구성**:
  1. Title Cover: The Spectrum of Knowledge
  2. Paradigm Shift: 문자열(Strings)에서 사물(Things)로
  3. Overview: 지식 표현의 사다리 (The Semantic Ladder)
  4. Pillar 1: 시맨틱스 (Semantics)와 의미의 삼각형
  5. Pillar 2: 택소노미 (Taxonomy)와 is-a 트리의 한계
  6. Pillar 3: 온톨로지 (Ontology)와 논리 공리(T-Box)
  7. Pillar 4: 지식 그래프 (Knowledge Graph)와 트리플(A-Box)
  8. Synthesis: 4각 개념 마스터 비교 매트릭스
  9. Ecosystem: W3C 시맨틱 웹 표준 스택 (RDF, OWL, SPARQL)
  10. 2026 Frontier: GraphRAG와 뉴로-심볼릭 AI
  11. Industry: 글로벌 산업계 실전 적용 사례 (제약, 금융, SCM)
  12. Conclusion: 핵심 요약 및 테이크어웨이
- **UI 개선**: 사용자 요청에 따라 슬라이드 뷰포트(최대 1560px), 카드 타일 패딩(2.2~2.4rem), 폰트 크기(본문 1.05rem, 제목 1.4rem), 최소 높이(220~330px)를 대폭 확장하여 가독성과 프레젠테이션 임팩트 강화

### 2026-09-18: Full-Stack AI & LLM Systems 인터랙티브 ELI5 학습 아티팩트 제작

#### 1. 최종 산출물
- **산출물 경로**: [`llm_fullstack_guide_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/llm_fullstack_guide_in_depth.html)
- **주제**: The Full-Stack AI & LLM Systems Blueprint (머신러닝 기초부터 데이터 그라운딩, 에이전트 시스템, 평가, 프로덕션 운영까지)
- **부제**: From Foundational Mathematical Optimization to Enterprise-Grade Agentic Intelligence (2026 Frontier Standard)

#### 2. 핵심 구현 아키텍처 및 6대 엔지니어링 기둥 (Core Pillars)
1. **역사적 진화 연대기 (1957 ~ 2026+)**:
   - 1957 퍼셉트론/역전파 $\to$ 2012 AlexNet $\to$ 2017 Transformer (Self-Attention) $\to$ 2020 GPT-3 & Chinchilla 스케일링 $\to$ 2022 ChatGPT & RLHF $\to$ 2023 RAG & ReAct 루프 $\to$ 2025~2026 추론 시간 컴퓨팅(Test-Time Compute) & vLLM PagedAttention 고속 서빙
2. **6대 핵심 엔지니어링 기둥 (Deep Dive)**:
   - ① **머신러닝 기초 (ML Foundations)**: 경험적 위험 최소화(ERM), 손실 함수(Cross-Entropy, MSE), 역전파 연쇄법칙, AdamW 최적화, 편향-분산 트레이드오프, 활성화 함수(GELU, SwiGLU), PyTorch 커스텀 신경망 블록
   - ② **LLM 구조 & 사전·사후학습 (LLM Foundations)**: Scaled Dot-Product Attention $QK^T/\sqrt{d_k}$, Grouped-Query Attention (GQA), Causal Next-Token 예측, SFT $\to$ DPO (Direct Preference Optimization, $\mathcal{L}_{DPO}$) $\to$ 2026 Test-Time Compute와 생각 토큰(`&lt;think&gt;`)
   - ③ **데이터 그라운딩 (Data Grounding & RAG/KG)**: 매개변수 기억 한계와 환각 억제, BM25 희소 검색 + Dense 벡터 검색 + 상호 순위 융합(RRF: $\sum \frac{1}{60 + r(d)}$) + Cross-Encoder 리랭킹, GraphRAG 커뮤니티 요약
   - ④ **에이전트 시스템 (Agentic Systems)**: LLM 두뇌 + 도구 호출 + 계획 + 메모리, ReAct(Thought $\to$ Action $\to$ Observation) 루프, JSON Schema 제약 디코딩, 계층형 오케스트레이터 vs 자율 협업형 스웜(Swarm), Human-In-The-Loop (HITL) 안전 게이트
   - ⑤ **종합 평가 체계 (Comprehensive Evaluation)**: RAG Triad 3대 메트릭 (Faithfulness, Answer Relevance, Context Precision/Recall), LLM-as-a-Judge 편향 극복(Swap Pairwise, G-Eval 루브릭), 에이전트 실행 궤적(Trajectory) 평가
   - ⑥ **프로덕션 운영 (Production LLMOps)**: vLLM PagedAttention 가상 페이징 메모리 관리 (단편화 4% 미만), Continuous Batching, 투기적 디코딩(Speculative Decoding), TTFT/TPOT 지연시간 지표, OpenTelemetry 분산 트레이싱(Langfuse), 시맨틱 캐시(Semantic Cache), NeMo 가드레일
3. **실시간 인터랙티브 파이프라인 시뮬레이터 (Live Simulator)**:
   - 4개 프리셋 (고객상담 SLM+RAG, 금융 리서치 GraphRAG, 코드 리팩토링 에이전트, 초저지연 온프렘 서빙)
   - 실시간 조작 슬라이더 (Context 토큰 수, Top-K 청크, 투기적 디코딩 배율, 에이전트 루프 반복 수, 모델 티어, 시맨틱 캐시 히트율)
   - 6단계 시각화 파이프라인 맵 & 실시간 지표 계산 (TTFT, TPOT, VRAM 절감률, RAG Triad 충실도, 총 지연시간, 1K 질의 비용)
   - 단계별 실시간 데이터 페이로드 Trace Inspector 연동
4. **실전 비교 & 결정 매트릭스 (4개 탭 대조)**:
   - Vector RAG vs GraphRAG vs 1M+ Long-Context
   - ReAct 에이전트 vs 계층형 라우터 vs 자율 스웜
   - 인간 평가 vs 규칙/단정문 vs LLM-as-a-Judge
   - 상용 매니지드 API vs 프라이빗 vLLM 온프렘 GPU 클러스터
5. **산업계 4대 쟁점 및 비판적 논쟁**:
   - RAG 종말론 vs 롱컨텍스트 실전 효용성
   - 사전학습 스케일링의 벽 vs 추론 시간(Test-Time) 연산 확장
   - 초거대 단일 모델 vs 특화 SLM 멀티에이전트 스웜
   - LLM-as-a-Judge의 순환 검증 딜레마
6. **생태계 컴포넌트 아카이브**:
   - vLLM, SGLang, LangGraph, Qdrant, Neo4j, Ragas, Langfuse, NeMo Guardrails, Model Context Protocol (MCP) 카탈로그
7. **2026 프로덕션 레퍼런스 블루프린트 & 10대 배포 점검표**:
   - 엔터프라이즈 시스템 데이터 흐름 SVG 아키텍처 다이어그램
   - SLA, 가드레일, 시맨틱 캐시, 멱등성, 서킷 브레이커, PagedAttention 최적화 등 10대 출시 점검표 완비

### 2026-09-20: 기계공학 & AI 융합(학문·실용·대졸 캡스톤 프로젝트 5선) 인터랙티브 ELI5 학습 아티팩트 제작

#### 1. 최종 산출물
- **산출물 경로**: [`mechanical_engineering_ai_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/mechanical_engineering_ai_in_depth.html)
- **주제**: 기계공학과 AI의 융합 체계 (학문적 4대 역학 접목부터 산업계 스마트 제조·로보틱스, 그리고 학사 졸업 프로젝트 제안까지)
- **부제**: Physical AI, Physics-Informed Machine Learning & Capstone Graduation Thesis Blueprints

#### 2. 핵심 구현 아키텍처 및 9대 구성 요소
1. **역사적 진화 연대기 (1950s ~ 2026+)**:
   - 1950s 연속체 역학과 유한요소법(FEM/CFD) 성립 $\to$ 1990s 진동 신호처리(FFT/웨이블릿) 상태 감시 $\to$ 2016 딥러닝 폭발 및 OOD 물리 위배 한계 봉착 $\to$ 2026 Physical AI: PINN, FNO 신경 연산자, Isaac Sim Sim-to-Real 강화학습 로보틱스 표준화
2. **학문 분야 접목 (4대 역학 + AI)**:
   - ① **고체역학**: 탄성 평형 방정식($\nabla \cdot \sigma + b = 0$) 기반 PINN, 복합재료 비선형 구성 방정식 학습, U-Net 기반 실시간 위상최적화 대리 모델
   - ② **유체역학**: 비압축성 나비에-스톡스 PINN, RANS 난류 모델의 레이놀즈 응력 비등방성 보정을 위한 텐서 기반 신경망(TBNN), Fourier Neural Operator (FNO)
   - ③ **열전달 & 열역학**: 비정상 열전도 및 미지 열전도율 역문제(Inverse Problem), 배터리 열폭주 감지, 복합 화력 사이클 엑서지 효율 강화학습 최적화
   - ④ **동역학 & 제어**: 해밀토니안 신경망(HNN) 기반 에너지 보존 시스템 식별, Neural ODE, Sim-to-Real 도메인 무작위화 로봇 보행 제어
3. **산업 실용 분야 (Industrial Applications)**:
   - ① **스마트 제조 & 설비 예지보전 (PHM)**: 회전체(베어링, 감속기) 가속도/전류(MCSA)/음향 센서 기반 고장 진단 및 잔존수명(RUL) 회귀 추정
   - ② **미래 모빌리티 & 샤시 제어 (X-by-Wire)**: 타이어 노면 마찰계수($\mu$) 실시간 추정 및 ABS 제동거리 단축
   - ③ **생성형 AI 엔지니어링 CAD**: B-Rep 파라메트릭 CAD 역설계 및 구조 안전계수 검증 자동화
   - ④ **플랜트 디지털 트윈**: 차수 축소 모델(ROM/POD) 및 칼만 필터 결합 실시간 파이프라인 모니터링
4. **라이브 인터랙티브 PINN 시뮬레이터 (1D Heat Conduction BVP)**:
   - 지배방정식: $k \frac{d^2 T}{dx^2} + q = 0$
   - 슬라이더 조작: 학습 에포크(0~5,000), 내부 열생성량($q$), 경계 온도차($\Delta T$)
   - Canvas 실시간 렌더링: 해석해(참값)와 PINN 예측 곡선의 수렴 과정, 경계조건 손실, PDE 잔차 손실, L2 오차(%), 840x 추론 가속비 동적 표시
5. **전통 해석 vs AI 방법론 비교 매트릭스 (3개 탭)**:
   - 구조/유동: FEM/CFD vs PINN vs FNO
   - 제어: 고전 PID/LQR vs 심층 강화학습 (DRL)
   - 상태 감시: 전통 FFT/규칙 기반 vs 딥러닝 PHM
6. **공학적 쟁점과 실전 한계 (Debates)**:
   - 물리 법칙 모르는 AI의 안전성 이슈 $\to$ Control Barrier Function(CBF) 하드웨어 안전 펜스
   - Sim-to-Real 갭 $\to$ 도메인 무작위화 및 온라인 적응(RMA)
   - 공장 고장 데이터 희소성 $\to$ 비지도 이상 감지 및 물리 시뮬레이션 합성 데이터 전이학습
   - 기계공학도의 독점적 해자 $\to$ 물리적 통찰을 갖춘 Physical AI 엔지니어의 차별성
7. **대졸자 졸업 논문 / 캡스톤 디자인 프로젝트 5선 (상세 청사진)**:
   - Project 1: 저비용 MEMS 가속도 센서와 1D-CNN을 이용한 소형 전동기 베어링 결함 실시간 엣지 진단 시스템
   - Project 2: PINN 기반 전자장비 방열판(Heat Sink) 2D 열전도 실시간 해석 및 최적 핀 배치
   - Project 3: Sim-to-Real 강화학습 기반 2자유도 도립진자 / 소형 보행 로봇 외란 극복 자세 제어
   - Project 4: 조건부 U-Net/GAN을 활용한 2D 캔틸레버 보 위상최적화 초고속 생성 및 3D 프린팅 강도 평가 (UTM 실증)
   - Project 5: CAN 버스 주행 신호와 서스펜션 가속도 데이터를 융합한 노면 상태 분류 및 최적 제동거리 추정
8. **인터랙티브 캡스톤 추천 위저드 (Recommendation Wizard)**:
   - 세부 전공(고체, 열유체, 제어/로봇, 제조/모빌리티) × 수행 방식(SW, HW제작, 대학원논문, 대기업취업) 조합에 따른 16개 맞춤형 로드맵, 기술 스택, 6개월 간트 마일스톤, 면접/심사 공략 팁 즉시 산출
9. **엔지니어링 툴체인 카탈로그**:
   - DeepXDE, NVIDIA Modulus, Isaac Gym, MuJoCo, CWRU Dataset, PyVista/FEniCS

### 2026-09-20: `eli5` 스킬 디자인 표준 개정 (라이트 테마 단일 통일 & 좌측 목차 index 제거)

#### 1. 개정 배경 및 목적
- 사용자 피드백 반영: 향후 `/eli5`로 생성되는 모든 HTML 아티팩트의 가독성 향상, 시각적 피로도 감소, 그리고 불필요한 좌측 고정 사이드바 목차를 제거하여 본문 중심의 미려한 중앙 집중형 에디토리얼 레이아웃을 확립.

#### 2. 주요 개정 사양 (`SKILL.md`)
1. **라이트 테마 단일 통일 (Light Theme Unified)**:
   - **배경**: 깨끗하고 밝은 소프트 라이트 팔레트 (`#ffffff`, `#f8fafc`, `#f1f5f9` 및 은은한 선형 그라데이션 적용). 다크 테마 완전 배제.
   - **카드 & 서피스**: 화이트 서피스 (`#ffffff`), 정교한 소프트 보더 (`#e2e8f0`, `#e5e7eb`), 부드러운 입체감 그림자 (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`).
   - **타이포그래피 & 대비**: 가독성이 극대화된 짙은 슬레이트 텍스트 (`#0f172a`, `#1e293b`, `#334155`), 보조 텍스트 (`#64748b`), 라이트 배경에 최적화된 비비드 포인트 악센트(Royal Indigo `#4f46e5`, Sky Blue `#0284c7`, Emerald `#059669`, Crimson `#e11d48`, Amber `#d97706`).
   - **코드 및 수식 블록**: 밝은 슬레이트 배경 (`#f8fafc`, `#f1f5f9`)과 정밀 테두리 (`#e2e8f0`), 짙은 텍스트의 고대비 구문 강조.
2. **좌측 목차 인덱스 삭제 (No Left Sidebar / Index)**:
   - **좌측 사이드바 및 인덱스 레일 완전 배제**: 문서 좌측을 점유하던 고정 네비게이션 칼럼(`.sidebar`)을 삭제.
   - **중앙 집중형 에디토리얼 레이아웃 (Centered Container)**: 본문 컨테이너를 가로 폭 `max-width: 1140px` ~ `1200px`의 단일 중앙 정렬 구조로 배치하여 여백의 미와 텍스트 몰입도 극대화.
   - **선택적 상단 미니멀 네비게이션**: 섹션 이동이 필요할 경우 상단 슬림 고정 바 또는 히어로 영역 퀵점프 필(Pill)로만 가볍게 구성.

#### 3. 갱신된 파일 경로
- `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`

### 2026-09-20: 기계공학 & AI 융합 대학교 2학년 실전 가이드 & 5대 프로젝트 아티팩트 제작

#### 1. 최종 산출물
- **산출물 경로**: [`mechanical_engineering_ai_sophomore_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/mechanical_engineering_ai_sophomore_in_depth.html)
- **주제**: 대학교 2학년을 위한 기계공학과 AI 융합 실전 가이드 (2학년 기초 과목 연계부터 물리-AI 학문·실용 분야, 그리고 저예산 실습 프로젝트 5선)
- **부제**: Bridging Sophomore Fundamentals (ODE, Mechanics, Thermo-Fluids) to Modern Physical AI
- **디자인 표준**: 개정된 `eli5` 라이트 테마 단일화 (`#ffffff`, `#f8fafc`, `#f1f5f9`), 좌측 목차 인덱스 배제, 단일 중앙 집중형 에디토리얼 레이아웃(`max-width: 1140px`) 완전 적용

#### 2. 핵심 구현 아키텍처 및 주요 구성 요소
1. **2학년 교과목 연계 메트릭 & 페르소나 설계**:
   - 공업수학 1 (1/2계 상미분방정식 ODE, 고유값/고유벡터, 라플라스 변환), 정역학/재료역학 1 (응력, 변형률 $\sigma=E\varepsilon$, 축하중 및 보 처짐 $EI\frac{d^4 w}{dx^4}=q$), 동역학 1 (뉴턴 운동법칙, 질점/강체 운동학, 1자유도 조화진동), 열역학 1 (밀폐계/개방계 1법칙, 상태량)
   - 선수 지식(Python 기초 문법, Numpy)을 토대로 추가 진입장벽을 최소화한 실용적 물리-AI 커리큘럼 매핑
2. **역사적 진화 연대기 (1960s ~ 2026+)**:
   - 1960s 손계산 및 수치해석(Runge-Kutta) $\to$ 1990s 상용 FEA/CFD 및 LabVIEW 데이터 계측 $\to$ 2012 순수 데이터 기반 딥러닝 $\to$ 2026 학부 2학년도 다루는 Physical AI (1D PINN, 저비용 엣지 AI 계측, 파이썬 기반 하이브리드 모델링)
3. **2학년 기초 4대 역학 + AI 접목 (인터랙티브 탭)**:
   - ① **동역학 & 공업수학 ODE**: $m\ddot{x} + c\dot{x} + kx = F(t)$ 조화진동자 해석해와 Neural ODE / 1D-PINN 손실함수 정식화
   - ② **정역학 & 재료역학 1**: 후크의 법칙($\sigma = E\varepsilon$), 보 처짐 곡선($y(x) = \frac{P x^2}{6EI}(3L-x)$), 다항 회귀/MLP를 활용한 탄성계수 $E$ 및 재료 파괴 예측
   - ③ **열전달 & 열역학 1**: 푸리에 열전도 법칙($q = -k\frac{dT}{dx}$), 1차원 막대 온도 구배 역추정 PINN
   - ④ **유체역학 기초**: 베르누이 방정식($P + \frac{1}{2}\rho v^2 + \rho gh = \text{const}$), 벤투리 관 차압-유량 관계의 머신러닝 교정 및 파이프 마찰손실 예측
4. **라이브 1자유도 감쇠 조화진동 인터랙티브 시뮬레이터 (Live Canvas Engine)**:
   - 질량 $m$, 감쇠비 $\zeta$, 스프링 상수 $k$, 초기 변위 $x_0$ 실시간 슬라이더 조작
   - Runge-Kutta 4차(RK4) 물리 엔진 기반 실시간 캔버스 시뮬레이션
   - 비감쇠 고유진동수 $\omega_n$, 감쇠 고유진동수 $\omega_d$, 감쇠 상태(과감쇠/임계감쇠/미감쇠) 판별 및 AI 상태 감시 분류기 실시간 시연
5. **전통 손풀이/기호 연산 vs AI/PINN 접근법 비교 매트릭스**:
   - 연산 대상, 수학적 도구, 경계/초기조건 처리, 데이터 필요량, 2학년 추천도 1:1 대조
6. **대학교 2학년생을 위한 현실적 실전 프로젝트 5선 (상세 가이드)**:
   - **Project 1 [동역학/진동]**: 외팔보(아크릴 자) 고유진동수 분석 기반 스마트 AI 전자저울 (아두이노 + MPU6050, 1만 원대)
   - **Project 2 [열역학/열전달]**: 온도 센서 3개로 알루미늄 봉 미지 열전도율 역추정하는 초소형 1D-PINN 실습 키트 (PyTorch, 2만 원대)
   - **Project 3 [재료역학]**: 웹캠과 OpenCV를 이용한 인장/처짐 2D 변형률 분포 시각화 (디지털 이미지 상관법, DIC 기초, 0원)
   - **Project 4 [동역학/제어]**: 비전 기반 라인트레이서 RC카 제어기 (OpenCV 차선 인식 + 다층 퍼셉트론 자율주행, 5~8만 원)
   - **Project 5 [스마트제조]**: 머신비전 기반 볼트·너트 규격(M4, M6, M8) 자동 선별 스마트 빈 (YOLOv8-nano / MobileNet, 1만 원대)
7. **2학년을 위한 3단계 방학/학기 시너지 로드맵**:
   - Step 1 [기초 체력]: Python 수치해석 + 공업수학 ODE 시뮬레이션
   - Step 2 [첫 프로젝트]: 저비용 센서 데이터 계측 + Scikit-Learn / 1D-CNN 머신러닝
   - Step 3 [심화 및 도약]: PyTorch 1D-PINN 구현 및 3·4학년 캡스톤/학부연구생 연계

### 2026-09-20: TypeSafe AI Jev & System One 의사결정 모델 인터랙티브 ELI5 학습 아티팩트 제작

#### 1. 최종 산출물
- **산출물 경로**: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)
- **요약 마크다운 경로**: [`typesafe_jev_system_one_summary.md`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/typesafe_jev_system_one_summary.md)
- **주제**: TypeSafe AI의 최초 시스템 원(System One) 모델 Jev 심층 분석 (비자기회귀 단일 패스, RLCD 학습, 3대 결정 원형 `choice`, `noul`, `score`, 그리고 제본스의 역설)
- **부제**: Machine-Native Intelligence Infrastructure for Deterministic Software Automation
- **디자인 표준**: 개정된 `eli5` 라이트 테마 단일화 (`#ffffff`, `#f8fafc`, `#f1f5f9`), 좌측 목차 인덱스 배제, 단일 중앙 집중형 에디토리얼 레이아웃(`max-width: 1140px`) 완전 적용

#### 2. 핵심 구현 아키텍처 및 주요 구성 요소
1. **역사적 진화 연대기 (2011 ~ 2026)**:
   - 2011 대니얼 카너먼 이중 과정 이론 (System 1/2) $\to$ 2022 InstructGPT/ChatGPT (RLHF) $\to$ 2024~2025 Test-time compute CoT 에이전트의 지연시간/비용 병목 $\to$ 2026 TypeSafe AI 최초 System One 모델 Jev 공개
2. **Jev 모델 아키텍처의 4대 기둥**:
   - ① **비자기회귀 병렬 샘플러(Non-Autoregressive Parallel Sampling)**: 텍스트 토큰 축차 생성을 포기하고 단 1회의 전방향 연산으로 질의 집합의 확률 벡터를 70~200ms 내 병렬 추출
   - ② **RLCD (Reinforcement Learning for Calibrated Decisions)**: 인간 선호도가 아닌 인식론적으로 정직하고 고도로 교정된(Calibrated) 확률 출력 최적화
   - ③ **수학적 타입 안전성(0.00% 타입 오류)**: 사전 정의된 스키마 공간 외의 출력이 원천 불가능하여 런타임 크래시 및 환각 제로 보장
   - ④ **제본스의 역설(Jevons Paradox)**: 지능 결정 비용이 10억 토큰당 $42(출력 무료)로 급감하여 소프트웨어 모든 조건문에 지능형 결정 엔진이 확산되는 경제적 법칙
3. **3대 질문 결정 원형 (Decision Primitives)**:
   - **`Choice`**: 최대 255개 상호 배타적 옵션 중 단일 라벨을 선택하는 다중 분류 원형 (선택값, 확률 분포, 확신도 반환)
   - **`Noul`**: 명제의 진위 여부를 $P \in [0.0, 1.0]$ 확률로 평가하는 불리언 원형 (어원: No/Yes 및 Null hypothesis 통계 검증)
   - **`Score`**: 2~10단계 정수 척도 또는 루브릭 등급에 따라 연속형 기대값 $\mathbb{E}[S]$ 및 확률 분포를 산출하는 서열 척도 원형
4. **라이브 인터랙티브 의사결정 엔진 시뮬레이터**:
   - 고객 지원 티켓, 에이전트 도구 라우팅, 보안 가드레일 프리셋 및 상태 입력 편집
   - 70~100ms 지연시간 계산, 토큰/비용(출력 무료) 실시간 계산, 3대 원형별 확률 바 애니메이션 렌더링
5. **기존 생성형 LLM(System 2) vs System One(Jev) 종합 비교 매트릭스**:
   - 최적화 목표, 학습 알고리즘, 출력 메커니즘, 지연시간, 타입 안전성, 비용, 최적 사용처 1:1 대조
6. **파이썬 `typesafe-sdk` 및 REST API 아키텍처 레퍼런스 코드 완비**

### 2026-09-21: `eli5` 스킬 Apple Design 표준 전면 적용 (유체 역학 모션, 반투명 머티리얼, 옵티컬 타이포그래피)

#### 1. 개정 배경 및 목적
- `/Users/nelcome/Archives/Design-md/apple-design-SKILL.md`에 명시된 Apple의 인터페이스 철학(*Designing Fluid Interfaces*, WWDC) 및 물리적 모션/머티리얼 규격을 `eli5` 스킬에 전면 이식.
- 단순한 라이트 테마 웹페이지를 넘어, 반투명 프로스티드 글래스(`backdrop-filter`), 스프링 기반의 유체 인터랙션(Spring Physics), 옵티컬 사이징/트래킹 타이포그래피, 1:1 직접 조작 피드백을 갖춘 최고 수준의 Apple 인터랙티브 아티팩트 생성 표준 확립.

#### 2. 주요 Apple Design 통합 사양
1. **머티리얼 & 뎁스 (Materials & Depth)**:
   - **라이트 테마 단일화**: Apple 시스템 소프트 오프화이트 캔버스 (`#f5f5f7` / `#fbfbfd`) 기반, 다크 모드 완전 배제.
   - **반투명 프로스티드 글래스 (Glassmorphism)**: 상단 고정 바 및 플로팅 컨트롤에 `background: rgba(255, 255, 255, 0.72); backdrop-filter: blur(20px) saturate(180%);` 적용.
   - **빛을 머금은 스페큘러 엣지**: 카드 상단 섬세한 하이라이트 보더 (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.06)`).
2. **Apple 옵티컬 타이포그래피 (Optical Typography)**:
   - **폰트 스택**: Apple 시스템 산세리프 (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Pretendard"`), 세리프 (`"New York", "Noto Serif KR"`), 모노 (`"SF Mono", "JetBrains Mono"`).
   - **크기별 광학 트래킹 (Optical Tracking)**: 대형 디스플레이 표제어는 음수 자간(`letter-spacing: -0.025em ~ -0.035em`) 및 타이트한 행간(`1.08 ~ 1.15`), 본문은 편안한 행간(`1.55 ~ 1.65`), 메타데이터/배지는 대문자 양수 자간(`0.04em ~ 0.06em`).
   - **색채 스케일**: Apple System Gray (`#1d1d1f`, `#6e6e73`, `#86868b`) 및 시스템 악센트(SF Blue `#0071e3`, SF Indigo `#5856d6`, SF Green `#34c759`, SF Orange `#ff9500`).
3. **유체 모션 & 물리적 반응성 (Fluid Motion & Physics)**:
   - **지연시간 제거 (Zero Latency)**: 버튼 및 인터랙티브 카드 누름 즉시 `transform: scale(0.97)` 촉각적 햅틱 피드백.
   - **임계 감쇠 스프링 (Critically Damped Springs)**: `cubic-bezier(0.25, 1, 0.5, 1)` 기반의 자연스럽고 거슬림 없는 수렴, 모멘텀 제스처에 한해 미세 바운스(`damping ~0.8`).
   - **인터럽트 가능성(Interruptibility)**: 사용자의 조작을 가로막는 블로킹 애니메이션 제거, 라이브 프리젠테이션 값 기반 트랜지션.
   - **iOS 세그먼트 컨트롤**: 필터/탭 전환 시 Apple 고유의 캡슐형 세그먼트 스위처 적용.
   - **접근성 지원**: `prefers-reduced-motion`(크로스페이드 대체) 및 `prefers-reduced-transparency`(솔리드 화이트 대체).
4. **레이아웃 구조**:
   - 좌측 고정 사이드바 목차 배제 원칙 유지, 중앙 집중형 단일 에디토리얼 컨테이너 (`max-width: 1100px ~ 1160px; margin: 0 auto;`).
   - 상단 슬림 플로팅 글래스 네비게이션 적용.

#### 3. 갱신된 파일 경로
- `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`

#### 4. 신규 표준 적용 산출물
- **[`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)**: Apple Design 시스템(반투명 프로스티드 글래스, SF 폰트 옵티컬 타이포그래피, iOS 세그먼트 컨트롤, 스프링 반응성, 1:1 라이브 70ms 결정 시뮬레이터)을 전면 적용하여 리마스터 완료.

### 2026-09-21: `eli5` 스킬 본문 작성에 `/im-not-ai` (humanize-korean) 표준 전면 통합

#### 1. 개정 배경 및 목적
- 사용자 요청: `/eli5` 아티팩트 제작 시, `/im-not-ai` 스킬(`humanize-korean`)의 원칙을 본문 작성 가이드라인에 반영하여 번역투, AI 상투어, 기계적 병렬 구조, 공허한 Hype 어휘를 원천 배제하고 사람이 쓴 것처럼 유려하고 자연스러운 엔지니어링 기술 문체를 확립.

#### 2. 주요 통합 작성 표준 (`SKILL.md` 반영 내용)
1. **번역투 및 직역 어투 완전 제거 (A 카테고리)**:
   - `~에 대해(서)` 남발 금지 $\to$ 목적격(`~를`), 처격(`~에서`), 주제격(`~는`)으로 정제.
   - `~를 통해` 습관적 반복 지양 $\to$ 구체적 수단/도구 격조사(`~로`), 원인(`~ 덕분에`, `~에 힘입어`)으로 교체.
   - 불필요한 사동/피동 직역(`~로 하여금 ~하게 하다`, 이중피동 `~되어지다`) 배제 $\to$ 능동형 서술.
   - `~할 수 있다` 무차별 남발 지양 $\to$ 검증된 사실은 능동적 단언("처리한다", "단축한다")으로 기술.
   - 대명사("그/그것/그들") 직역 배제 $\to$ 생략 또는 정확한 고유 명사 표기.
2. **AI 특유의 상투어 및 의의 과장(Hype) 배제 (D 카테고리)**:
   - 기계적 결말 어구("결론적으로", "요약하자면", "정리하자면", "이를 통해") 남발 금지.
   - 공허한 수사구("시사하는 바가 크다", "주목할 만하다", "매우 중요하다") 배제 $\to$ 구체적 메커니즘과 정량 수치로 논증.
   - 상투적 도입문("크게 세 가지로 나눌 수 있다", "다음과 같은 특징이 있다") 삭제 $\to$ 곧바로 본론 서술 진입.
   - 알맹이 없는 과장 형용사("혁신적", "획기적", "압도적", "전례 없는") 지양 $\to$ 명확한 팩트("70ms 지연시간", "400배 비용 절감") 중심 서술.
   - 의인화 추상 주어("기술이 묻는다", "시대가 요구한다") 배제.
3. **접속사 및 메타 수식구 절제 (H 카테고리)**:
   - 문두 접속사("또한", "따라서", "즉", "나아가", "아울러") 남발을 억제하고 문맥의 자연스러운 인과로 연결.
   - 설명형 메타 어구("이는 ~라는 점에서", "이 관점에서 볼 때") 축소.
4. **리듬감과 문장 호흡의 변주 (E 카테고리)**:
   - 문장 길이 균일성 탈피: 짤막한 단문과 100자 내외의 밀도 높은 복문을 교차 배치하여 자연스러운 호흡 조성.
   - 동일 종결어미("~다.", "~다.", "~다." 또는 진행형 "~고 있다")의 4회 이상 연속 반복 방지.
5. **형식명사 및 과도한 완곡어조(Hedging) 절제 (G·I 카테고리)**:
   - 형식명사("~한 것이다", "~라는 점에 있다") 지양 $\to$ 직설적이고 명확한 문장 마감.
   - 불필요한 불확실 표현("~로 보인다", "~로 추정된다") 절제 $\to$ 참인 공학적 사실은 명확히 단언.
6. **전문 용어의 온전한 보존 및 서식 절제 (B·J 카테고리)**:
   - 업계 표준 기술 용어(API, Prompt, Token, Pipeline, Latency, Non-autoregressive, Forward pass 등)의 억지 번역 금지 및 원어/외래어 보존.
   - 무분별한 볼드체(**) 및 따옴표 도배 지양 $\to$ 타이포그래피 위계와 문맥 자체로 강조.

#### 3. 갱신된 파일 경로
- `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/GEMINI.md`
- `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/memory.md`

### 2026-09-21: `eli5` 스킬 타일 상단·좌측 컬러 스트라이프 호버 재드로잉 UX 애니메이션 표준 기본 적용

#### 1. 개정 배경 및 목적
- 사용자 요청: 생성되는 타일(Stat tile, Apple card, Pillar card, Callout box 등)의 상단 및 좌측에 표시되는 컬러 스트라이프에 마우스 오버 시, 자연스럽고 연하게 다시 그려지는 유체 UX 애니메이션을 기본 탑재하도록 디자인 시스템을 확장.

#### 2. 핵심 인터랙션 규격 (`SKILL.md` 반영 내용)
1. **상단 스트라이프 (Top Stripe: Left to Right)**:
   - **기본 상태(Idle)**: 연하고 은은한 베이스 트랙(`height: 3.5px`, `opacity: 0.22`) 상단 배치.
   - **호버 인터랙션(Hover)**: 마우스 오버 시 좌에서 우로 자연스럽게(`transform: scaleX(0) → scaleX(1)`, `transform-origin: left center`) 선이 부드럽게 채워지며, 미세한 발광 글로우(`box-shadow: 0 1px 10px rgba(var(--stripe-rgb), 0.35)`)와 함께 연하게 다시 그려짐.
   - **스프링 물리 곡선**: Apple 유체 모션 커브 `cubic-bezier(0.16, 1, 0.3, 1)`, 0.5s 트랜지션 적용.
2. **좌측 스트라이프 (Left Stripe: Bottom to Top)**:
   - **기본 상태(Idle)**: 연하고 은은한 좌측 트랙(`width: 4px`, `opacity: 0.22`) 좌측 배치.
   - **호버 인터랙션(Hover)**: 마우스 오버 시 하단에서 상단으로 자연스럽게(`transform: scaleY(0) → scaleY(1)`, `transform-origin: bottom center`) 선이 부드럽게 솟아오르며, 미세한 발광 글로우(`box-shadow: 1px 0 10px rgba(var(--stripe-rgb), 0.35)`)와 함께 연하게 다시 그려짐.
   - **스프링 물리 곡선**: Apple 유체 모션 커브 `cubic-bezier(0.16, 1, 0.3, 1)`, 0.52s 트랜지션 적용.
3. **접근성(Reduced Motion)**:
   - 모션 감축 모드(`prefers-reduced-motion: reduce`) 시 급격한 트랜스폼 대신 은은한 페이드(`opacity 0.2s`)로 자연스럽게 대체.

#### 3. 갱신된 파일 경로
- `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/GEMINI.md`
- `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/memory.md`
- **산출물 실증 반영**: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)

### 2026-09-21: `eli5` 스킬 Steep UX 디자인 시스템 기본 테마 전면 채택 및 TypeSafe Jev 아티팩트 리마스터

#### 1. 개정 배경 및 목적
- 사용자 요청: `/Users/nelcome/Archives/Design-md/DESIGN-steep.md`를 향후 모든 `eli5` 아티팩트의 기본 UX 테마로 영구 채택하고, 기존 제작된 `typesafe_jev_system_one_in_depth.html`을 Steep 테마로 전면 리마스터.
- 기존의 좌→우, 하→상 호버 재드로잉 컬러 스트라이프 인터랙션과 `/im-not-ai` 한국어 윤문 기준을 완벽히 계승하면서, Steep 고유의 텍스처와 타이포그래피 정체성 융합.

#### 2. 핵심 디자인 토큰 및 인터페이스 규격
- **캔버스 & 머티리얼 ("Soft dawn on a marble dashboard")**:
  - 배경: 퓨어 화이트(`#ffffff`) 기본 캔버스와 섹션 간 안개빛 포그(`#f7f7f8`) 교차.
  - 히어로 글로우: 에이프리콧 워시(`rgba(251, 225, 209, 0.28)`) 방사형 그라디언트 투광.
  - 카드 표면: 24px 세라믹 모서리 반경(`border-radius: 24px`)과 3단 시그니처 섀도우 체계:
    `box-shadow: rgba(4, 23, 43, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 20px 25px -5px, rgba(0, 0, 0, 0.06) 0px 8px 10px -6px;`
- **에디토리얼 타이포그래피**:
  - Display Serif: Signifier (`Newsreader` / `Source Serif 4`, 44px / 64px / 90px, line-height 1.10, 음수 자간).
  - Body & Utility: Söhne (`Plus Jakarta Sans` / `Inter` / `Pretendard`, 14px~18px, micro-weights 430, 450, 480, 500, 자간 -0.009em).
- **Steep 컬러 & 버튼 체계**:
  - 구두점으로서의 색상: 기본 크롬은 Monochrome(Ink `#17191c`, Ash `#4a5568`, Dove `#718096`), 악센트는 Rust 브라운(`#5d2a1a`)과 Cobalt Blue(`#2563eb`).
  - 단일 다크 필드 알약형 CTA: 화면당 1개의 다크 솔리드 버튼(`steep-btn-primary`, Ink `#17191c`, White 텍스트) + 인접 텍스트 링크(`steep-btn-secondary`).

#### 3. 최종 산출물 및 반영 경로
- **스킬 정의 동기화**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- **리마스터 아티팩트**:
  - 저장소 경로: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)
### 2026-09-21: `eli5` 스킬 Starbucks UX 디자인 시스템 기본 테마 전면 채택 및 TypeSafe Jev 아티팩트 리마스터

#### 1. 개정 배경 및 목적
- 사용자 요청: `/Users/nelcome/Archives/Design-md/DESIGN-starbucks.md`를 향후 모든 `eli5` 아티팩트의 기본 UX 테마로 전면 적용하고, 기존 `typesafe_jev_system_one_in_depth.html`을 스타벅스 디자인 시스템으로 리마스터.
- 기존의 좌→우, 하→상 호버 재드로잉 컬러 스트라이프 인터랙션과 `/im-not-ai` 한국어 윤문 기준을 온전히 계승하면서 스타벅스 플래그십 매장의 따뜻함과 절제된 그린 계층 체계 반영.

#### 2. 핵심 디자인 토큰 및 컴포넌트 아키텍처
- **캔버스 & 컬러 블록 리듬 ("Warm retail flagship wearing storefront green")**:
  - 웜 크림 캔버스: 뉴트럴 웜(`Neutral Warm #f2f0eb`) 기본 캔버스로 카페의 냅킨, 벽면 질감 및 조명 구현. (순수 화이트 캔버스 사용 금지)
  - 카드 표면: 퓨어 화이트(`White #ffffff`) 콘텐츠 카드와 세라믹(`Ceramic #edebe9`) 구분대.
  - 에스프레소 북엔드: 딥 하우스 그린(`House Green #1E3932`) 피처 밴드 및 푸터로 깊이감 있는 시각적 리듬 형성.
- **4계층 그린 시스템 & 세레모니 골드**:
  - `Starbucks Green (#006241)`: h1 및 주요 섹션 타이틀, 핵심 브랜드 신호.
  - `Green Accent (#00754A)`: 주요 CTA 채우기 버튼 및 플로팅 Frap 버튼.
  - `House Green (#1E3932)`: 피처 밴드, 다크 카드, 푸터.
  - `Green Uplift (#2b5148)`: 절제된 보조 다크 포인트.
  - `Green Light / Mint (#d4e9e2)`: 유효성 배지 및 연한 유틸리티 틴트.
  - `Gold (#cba258)`: 리워즈 등급, 스타 포인트, 인증 세레모니 배지 전용.
- **타이포그래피 및 버튼/카드 기하 구조**:
  - 폰트 스택: SoDoSans 대체 `Manrope` (전역 `-0.01em` 타이트 자간), Lander Tall 대체 `Lora` (에디토리얼 세리프), `Kalam` (컵 스크립트), `JetBrains Mono`.
  - 유니버설 50px 풀필 버튼: 모든 버튼 `border-radius: 50px` 강제 및 액티브 누름 시 `transform: scale(0.95)` 시그니처 물리 피드백.
  - 12px 카드 반경 & 위스퍼 섀도우: `border-radius: 12px`, `box-shadow: 0px 0px 0.5px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.24)`.
  - 시그니처 플로팅 Frap 원형 버튼: 우측 하단 고정 56px 원형 버튼(`Green Accent #00754A`, 커피 컵 SVG, 3중 그림자 스택, 클릭 시 시뮬레이터 직행).

#### 3. 갱신된 파일 경로 및 산출물
- **스킬 정의 동기화**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- **리마스터 산출물**:
  - 저장소 경로: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)
  - 브레인 아티팩트: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/typesafe_jev_system_one_in_depth.html)

### 2026-09-21: `eli5` 스킬 Apple Design 시스템 (apple-design-SKILL.md) 기본 UX 테마 복원 및 TypeSafe Jev 아티팩트 리마스터

#### 1. 개정 배경 및 목적
- 사용자 요청: `/Users/nelcome/Archives/Design-md/apple-design-SKILL.md`를 향후 모든 `eli5` 아티팩트의 기본 디자인 시스템으로 다시 복원 및 영구 적용.
- 기존의 좌→우, 하→상 호버 재드로잉 컬러 스트라이프 인터랙션과 `/im-not-ai` 한국어 윤문 기준을 100% 계승하면서, Apple의 유체 인터페이스(Fluid Interfaces), 반투명 프로스티드 글래스 머티리얼, SF Pro 옵티컬 타이포그래피, 임계 감쇠 스프링 물리 애니메이션 체계를 복원.
- 기존 제작된 `typesafe_jev_system_one_in_depth.html` 산출물을 Apple Design 언어로 완벽히 재구축.

#### 2. 핵심 디자인 토큰 및 컴포넌트 아키텍처
- **캔버스 & 머티리얼 ("Fluid Interfaces & Specular Highlights")**:
  - 캔버스: 라이트 뉴트럴 그레이(`#f5f5f7`) 단일 테마 유지 (다크 모드 토글 배제).
  - 프로스티드 글래스 카드: `background: rgba(255, 255, 255, 0.84)`, `backdrop-filter: blur(20px) saturate(180%)`.
  - 정밀 반사 하이라이트(Specular Highlights): `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 4px 20px rgba(0, 0, 0, 0.04)`.
  - 에디토리얼 레이아웃: 최대 너비 1200px 중앙 집중형 본문 (좌측 목차/인덱스 레일 제거).
- **Apple SF 컬러 팔레트 & 호버 재드로잉 스트라이프**:
  - SF 컬러: Blue (`#0071e3`), Indigo (`#5856d6`), Green (`#34c759`), Orange (`#ff9500`), Red (`#ff3b30`), Purple (`#af52de`).
  - 인터랙티브 호버 재드로잉: 마우스 오버 시 상단 스트라이프는 좌→우, 좌측 스트라이프는 하→상으로 부드럽고 연하게 채워지는 UX 애니메이션 표준화.
- **옵티컬 타이포그래피 & 스프링 물리 모션**:
  - 폰트: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Pretendard", sans-serif`.
  - 트래킹: 디스플레이 타이틀 `-0.025em`, 본문 `-0.005em` 정밀 광학 자간.
  - 임계 감쇠 스프링(Critically Damped Springs): `transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1)`.
  - iOS 세그먼트 컨트롤: `background: rgba(0, 0, 0, 0.05)`, 화이트 알약 액티브 인디케이터.
  - 버튼 피드백: 누름 시 `transform: scale(0.97)` 즉각적 물리 반응.

#### 3. 갱신된 파일 경로 및 산출물
- **스킬 정의 동기화**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- **리마스터 산출물**:
  - 저장소 경로: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/typesafe_jev_system_one_in_depth.html)
  - 브레인 아티팩트: [`typesafe_jev_system_one_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/typesafe_jev_system_one_in_depth.html)

### 2026-09-23: 클래식 음악의 황금기(1680~1830) 심층 분석 ELI5 아티팩트 제작

#### 1. 개정 배경 및 목적
- 사용자 요청: ‘클래식 음악의 황금기’가 17세기 후반 바로크부터 19세기 초의 고전주의·낭만주의 여명기에 집중된 이유를 설명하는 심층 인터랙티브 가이드 제작.
- Apple 디자인 시스템(`apple-design-SKILL.md`) 표준과 `/im-not-ai` 한국어 윤문 규격을 엄격히 적용하여, 단순한 인물 나열이 아닌 음향 물리학, 기능화성학, 조율 체계(평균율), 사회경제적 후원 구조 및 지성사적 변천을 통합 분석.

#### 2. 핵심 분석 축 및 인터페이스 구현
- **4대 필연적 기둥 (Theoretical Pillars)**:
  1. **음향 공학과 악기 역학의 물리학적 혁명**: 크레모나 현악기(스트라디바리우스)의 고주파 배음 포먼트, 크리스토포리의 해머 타현 피아노포르테 발명, 바흐의 『평균율 클라비어(1722)』를 통한 24개 조 순환 전조의 해방.
  2. **기능화성학과 소나타 형식의 수학적 건축술**: 라모의 『화성론(1722)』(으뜸-버금딸림-딸림 삼원 긴장-해소 축) 및 소나타 알레그로 형식의 변증법(제시부-전개부-재현부).
  3. **후원 경제에서 시민 공공 영역으로의 대전환**: 에스테르하지 궁정(하이든의 실험실) $\to$ 유료 공공 연주회 및 예약 콘서트(모차르트) $\to$ 시민 사회의 독립적 영웅(베토벤), 금속판 악보 인쇄 및 피아노 보급에 따른 제본스의 역설(소비 폭발).
  4. **계몽주의 이성에서 자율적 천재 철학으로**: 장인 하인에서 칸트·괴테적 자율적 예술 주체로의 격상과 절대음악(Absolute Music) 미학의 정초.
- **실시간 Web Audio API 인터랙티브 오디토리움**:
  - 외부 라이브러리 없이 순수 브라우저 오디오 발진기(Oscillator)를 통한 시대별 4성부 기능화성 합성 재생 (바로크 대위법 $\to$ 고전주의 정격종지 $\to$ 베토벤 감7화음 $\to$ 슈베르트 3도 반음계 대리조).
  - 캔버스 기반 소나타 형식 긴장도 궤적 및 조율 방식(순정률·중전음률·평균율) 실시간 시각화 연동.

#### 3. 최종 산출물 및 파일 경로
- **저장소 경로**: [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/classical_music_golden_age_in_depth.html)
- **브레인 아티팩트**: [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/classical_music_golden_age_in_depth.html)

### 2026-09-23: `eli5` 스킬 Apple Design System 공식 iPhone Duo(apple.com/kr/iphone-duo/) 규격 전면 반영

#### 1. 개정 배경 및 목적
- 사용자 요청: Apple Design System에서 사용되는 컬러, 텍스트, 텍스트 크기, 항목별 구성을 공식 최신 플래그십 페이지인 `https://www.apple.com/kr/iphone-duo/`를 직접 참조하여 전면 업데이트.
- 공식 CSS(`overview.built.css`) 및 마크업 구조를 직접 크롤링/분석하여 정밀한 타이포그래피 스케일, 컬러 토큰, 버튼 인터랙션, 10단 섹션 레이아웃 표준을 `eli5` 스킬 명세에 내장.

#### 2. 핵심 업데이트 내역
- **정밀 타이포그래피 스케일 (Exact Typography Scale)**:
  - `XXL Monumental Headline`: 80px / 64px, line-height 1.05, weight 600, tracking -0.015em
  - `Section Header Headline`: 48px, line-height 1.0835, weight 600, tracking -0.003em ("일단 핵심부터.", "보다 자세히 들여다보기.")
  - `Hero Eyebrow / Media Card Headline`: 28px, line-height 1.1428, weight 600, tracking +0.007em
  - `Display Copy / Large Label`: 24px, line-height 1.1667~1.333, weight 600, tracking +0.009em
  - `Section Eyebrow (Category)`: 21px, line-height 1.0~1.19, weight 600, tracking +0.011em
  - `Standard Body (High Density)`: 17px, line-height 1.4705 (relaxed) / 1.235 (tight), tracking -0.022em
  - `Body Reduced (Secondary Body)`: 14px, line-height 1.4286, tracking -0.016em
  - `Caption / Sosumi / Footnote`: 12px, line-height 1.3334, tracking -0.01em
  - `Stat Value / Tout Metric`: 28px~48px, line-height 1.1428, weight 600/700
- **정밀 컬러 토큰 (Color Tokens)**:
  - Canvas: Background-Alt (`#f5f5f7`), Card/Panel (`#ffffff`), Frosted Glass (`rgba(255,255,255,0.82)`), Specular border (`inset 0 1px 0 rgba(255,255,255,0.75)`)
  - Text: Primary (`#1d1d1f`), Secondary (`#86868b`), Tertiary/Sosumi (`#6e6e73`)
  - Accent: Apple Blue (`#0071e3`, hover `#0076df`, active `#006edb`), Link (`#0066cc`), SF Functional Palette (Indigo `#5856d6`, Green `#34c759`, Orange `#ff9500`, Red `#ff3b30`, Purple `#af52de`)
- **10단 섹션 레이아웃 아키텍처 (Section Progression)**:
  1. `section-localnav`: 플로팅 반투명 내비게이션 바 (좌측 타이틀 + 중앙 퀵점프 탭 + 우측 액션 알약 버튼)
  2. `section-media-hero`: 28px 아이브로우 + 64~80px 초대형 헤드라인 + 14px 서브타이틀 + 듀얼 CTA
  3. `section-highlights`: 48px "일단 핵심부터." 헤드라인 + 4대 스탯 토트 그리드 + 벤토 갤러리 카드
  4. `section-timeline`: 정밀 연결선과 호버 링 섀도우를 갖춘 수직 역사 연대기
  5. `section-product-stories`: 21px 카테고리 아이브로우 + 48px 스토리 헤드라인 + 3~4대 심층 이론 기둥
  6. `section-product-viewer`: iOS 세그먼트 컨트롤 및 실시간 조작 슬라이더를 갖춘 제로 의존성 인터랙티브 시뮬레이터
  7. `section-shared-features`: 28px 헤드라인 + 17px 본문 기반 현대적 유산 및 기술적 파급 카드
  8. `section-contrast`: 승격된 하이라이트 열을 갖춘 애플 스타일 정밀 대조 매트릭스
  9. `section-code`: macOS 다크 크롬 신호등 창 및 JetBrains Mono 문법 강조 코드 셸프
  10. `ac-gf-sosumi` & `ac-gf-footer`: 12px 소수미(Sosumi) 학술 인용 각주 및 애플 공식 저작권 락업
- **갱신된 파일 경로**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`

### 2026-09-23: `eli5` 스킬 한국어 단어 간·의미 간 줄바꿈 단절 방지 표준 반영 및 아티팩트 리마스터

#### 1. 개정 배경 및 목적
- 사용자 요청: 한글 줄바꿈 시 단어 중간이 잘리거나 의미 단위가 부자연스럽게 분절되지 않도록 구성하고, 이를 `eli5` 스킬 작성 가이드에 영구 표준으로 업데이트 및 기존 클래식 아티팩트에 전면 적용.

#### 2. 핵심 표준 규격
- **CSS 전역 타이포그래피 규칙**:
  - `body, p, li, .apple-card, td, th`: `word-break: keep-all; overflow-wrap: break-word; text-wrap: pretty;` (단어/어절 단위 보존 및 본문 마지막 단어 외톨이 방지)
  - `h1~h4, .typography-section-header-headline, .hero-title, etc.`: `word-break: keep-all; overflow-wrap: break-word; text-wrap: balance;` (헤드라인 줄 길이 자동 균형 분배)
- **HTML 마크업 시맨틱 줄바꿈**:
  - 복합 명사 및 명사+조사 결합부, 문장 종결 어미 분절 위험 위치에 `&nbsp;` 비분절 공백 적용.
  - 의미론적 절(Clause) 또는 쉼표 단위에서만 자연스러운 `<br>` 줄바꿈 허용.

#### 3. 적용 및 동기화 산출물
- **스킬 명세서**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- **리마스터 아티팩트**:
  - [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/classical_music_golden_age_in_depth.html)
  - [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/classical_music_golden_age_in_depth.html)

### 2026-09-23: `eli5` 스킬 항목 타이틀 폰트 크기 축소 및 볼드(weight: 700) 강화 표준 반영 및 아티팩트 동기화

#### 1. 개정 배경 및 목적
- 사용자 요청: "각 항목 타이틀 폰트 크기는 조금 작게하고 굵게 표현할 것"
- 기존 초대형 타이틀(48px 헤더, 28px/22px 카드 타이틀)로 인한 시각적 분산과 팽창감을 해소하고, 타이틀 크기를 축소하면서 가중치를 볼드(`font-weight: 700`)로 단단하게 고정하여 본문 대비 위계 질서와 가독성을 대폭 개선.

#### 2. 핵심 변경 스케일 (Typography Hierarchy Updates)
- **섹션 헤더 타이틀 (`.typography-section-header-headline`)**:
  - `48px`, weight `600` $\to$ **`38px`**, weight **`700`**, line-height `1.15`, letter-spacing `-0.015em`
  - 모바일 반응형: 960px 이하 `32px`, 600px 이하 `26px`
- **개별 항목 / 카드 / 타임라인 타이틀 (`.typography-media-card-gallery-headline`)**:
  - `28px` / inline `22px`, weight `600` $\to$ **`20px`**, weight **`700`**, line-height `1.32`, letter-spacing `-0.012em`
- **카테고리 아이브로우 (`.typography-section-header-eyebrow`)**:
  - `21px`, weight `600` $\to$ **`15px`**, weight **`700`**, letter-spacing `0.04em` (애플 특유의 정밀 배지형 레이아웃)
- **디스플레이 라벨 (`.typography-label`)**:
  - `24px` $\to$ **`19px`**, weight **`700`**
- **스탯 토트 수치 및 라벨 (`.typography-tout-stat-value`, `.typography-tout-copy`)**:
  - 수치 `36px` $\to$ **`30px`** (weight `700`), 라벨 weight `400` $\to$ **`700`**
- **헤어로 타이틀 (`.typography-ric-type-lockup-xxl-headline`)**:
  - `80px` $\to$ **`64px`**, weight **`700`**

#### 3. 적용 및 동기화 산출물
- **스킬 명세서**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
- **반영 아티팩트**:
  - [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/classical_music_golden_age_in_depth.html)
  - [`classical_music_golden_age_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/classical_music_golden_age_in_depth.html)

### 2026-09-23: TLA+ & Lean 4 하이브리드 정형 검증 아키텍처 ELI5 아티팩트 제작

#### 1. 개정 배경 및 목적
- 사용자 요청: "TLA+도 잘 작동합니다. 때때로 Lean과 TLA+를 결합해 데이터 흐름, 동시성, 상태 관리 주변의 문제를 찾습니다."
- 동시성(Concurrency), 상태 관리(State Management), 데이터 흐름(Data Flow)의 결함을 잡기 위한 **TLA+의 시간 행동 논리 및 모델 체킹(TLC, Apalache)**과 **Lean 4의 의존형 타입 이론(Dependent Type Theory) 기반 귀납적 증명**을 결합한 하이브리드 정형 검증 가이드 및 인터랙티브 아티팩트 구축.

#### 2. 핵심 아키텍처 및 이론적 기둥
- **TLA+의 강점 (상태 공간 탐색 & 코너케이스 포착)**:
  - 비동기 스레드 인터리빙, 네트워크 메시지 순서 역전, 분산 노드 장애 시나리오의 비결정적 상태 전이($Next$) 모델링.
  - TLC 모델 체커의 무차별 전수 탐색 및 Apalache의 Z3 SMT 기호적 유계 모델 체킹으로 복잡한 반례 트레이스(Counterexample Trace) 신속 도출.
- **Lean 4의 강점 (무한 도메인 수학적 귀납 증명 & 네이티브 코드 합성)**:
  - 커리-하워드 동형에 따른 "명제는 타입, 증명은 프로그램" 패러다임.
  - 상태 수 폭발에 제약받지 않고 임의의 $N$개 노드와 무한 도메인에 대한 불변식 보존 정리($\forall s, s', Inv(s) \land Step(s, s') \to Inv(s')$) 정형 증명.
  - 검증된 함수형 모델을 고성능 C 언어 및 Rust FFI로 직접 컴파일.
- **2단계 하이브리드 시너지 (Dual Verification Stack)**:
  - Step 1: 프로토콜 설계 초기 단계에서 TLA+로 모델링하여 수초 내에 레이스 컨디션 및 데드락 제거.
  - Step 2: 검증된 상태 머신을 Lean 4의 귀납적 관계로 이식하여 무한 상태 안전성 증명 및 런타임 코드 추출.
- **실시간 캔버스 시뮬레이터 (Interactive State Explorer)**:
  - 4대 프리셋 지원: 상호 배제(Mutex), 생산자-소비자 큐(Bounded Buffer), 2단계 커밋(2PC 합의), 순환 대기 데드락 함정.
  - 실시간 상태 전이 그래프 렌더링, TLC 전수 탐색 실행, 안전성 불변식 위반 즉각 감지 및 HUD 상태 동기화.

### 2026-09-24: Dr. Brooks Money & Knowledge Report (`drbrooks-moneyreport.pages.dev`) 자동 퍼블리싱 파이프라인 구축 및 `eli5` 스킬 전면 연동

#### 1. 개정 배경 및 목적
- 사용자 요청: "이 폴더(`eli5-learnings`)에서 만들 파일은 자동으로 https://drbrooks-moneyreport.pages.dev/ 에 퍼블리싱 될 수 있도록 해줘. 관련 스킬이 있으면 그 스킬에 업데이트 해주고."
- `eli5-learnings` 폴더에서 생성되는 모든 지식 아티팩트(`_in_depth.html`, `_guide.html`)가 Cloudflare Pages 배포 플랫폼인 [Dr. Brooks Money & Knowledge Report](https://drbrooks-moneyreport.pages.dev/)에 즉시 연동 및 라이브 퍼블리싱되도록 완전 자동화 파이프라인을 구축하고 관련 스킬 및 하네스 지침을 영구 업데이트.

#### 2. 배포 플랫폼 아키텍처 분석
- **호스팅 환경**: Cloudflare Pages (`https://drbrooks-moneyreport.pages.dev/`)
- **연동 깃 저장소**: `https://github.com/drbrookskim/moneyreport.git` (`branch: main`)
- **로컬 작업 디렉토리**: `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/money-report`
- **지식 데이터베이스**: `money-report/data/reports.json`
  - 리포트 스키마: `id`, `title`, `category`, `author`, `createdAt`, `readingTimeMin`, `keywords`, `summary`, `htmlContent`, `fileSizeBytes`, `reportType: "knowledge"`
  - `main` 브랜치에 변경사항 커밋 & 푸시 시 Cloudflare Pages가 즉시 트리거되어 정적 빌드 및 전 세계 엣지 네트워크에 실시간 배포.

#### 3. 자동 퍼블리싱 파이프라인 스크립트 구현 (`publish_to_moneyreport.py`)
- **스크립트 경로**: [`publish_to_moneyreport.py`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/publish_to_moneyreport.py)
- **주요 기능**:
  1. **정밀 메타데이터 자동 추출**:
     - HTML `<title>` 및 `h1` 태그 기반 타이틀 정제
     - `.eyebrow`, `.nav-tag` 기반 정밀 카테고리 추출
     - `.thesis-card`, `.hero-subtitle` 기반 2줄 핵심 요약문 추출
     - `<script>`, `<style>`, `<svg>` 배제 후 순수 본문 텍스트 기준 정밀 읽기 시간(`readingTimeMin`) 계산
     - 헤딩 및 중요 키워드 빈도 분석을 통한 상위 7개 키워드 자동 태깅
     - HTML 풀 소스코드를 `htmlContent`로 탑재 및 `reportType: "knowledge"` 부여
  2. **`data/reports.json` 멱등적 업데이트**:
     - 기존 리포트(ID 또는 타이틀 매칭) 존재 시 데이터 갱신, 신규 리포트는 최상단에 자동 삽입
  3. **Git 동기화 & 자동 푸시**:
     - 원격 최신 변경사항 확인 (`git pull --rebase origin main`)
     - `data/reports.json` 스테이징 및 시맨틱 커밋 메시지 작성 (`feat(publish): publish "..."`)
     - `origin main`으로 원클릭 `git push` 실행 $\to$ Cloudflare Pages 자동 빌드 & 즉시 라이브 배포 완료
  4. **CLI 편의성**:
     - 단일 파일 배포: `python3 publish_to_moneyreport.py <파일명.html>`
     - 전체 동기화: `python3 publish_to_moneyreport.py --all` (폴더 내 10개 지식 아티팩트 일괄 동기화)

#### 4. 스킬 및 하네스 영구 연동
- **`eli5` 스킬 가이드 갱신**:
  - `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - `/Users/nelcome/.gemini/skills/claude-plugins-community/eli5/skills/eli5/SKILL.md`
  - 실행 지침(Execution Instructions) Step 2에 아티팩트 생성 직후 `publish_to_moneyreport.py` 자동 실행 단계 영구 명시.
- **하네스 규칙 갱신 (`GEMINI.md`)**:
  - 기본 저장 경로 지침에 생성 즉시 자동 퍼블리싱 및 GitHub 동기화 규칙 추가.

### 2026-09-24: 인간 뇌의 신경가소성(Neuroplasticity) 인터랙티브 ELI5 학습 아티팩트 제작 및 자동 퍼블리싱

#### 1. 최종 산출물
- **저장소 산출물**: [`neuroplasticity_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/neuroplasticity_in_depth.html)
- **브레인 아티팩트**: [`neuroplasticity_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/neuroplasticity_in_depth.html)
- **요약 아티팩트**: [`neuroplasticity_summary.md`](file:///Users/nelcome/.gemini/antigravity-cli/brain/16d68905-9887-45d2-9e0b-11e7e49ce536/neuroplasticity_summary.md)
- **라이브 퍼블리싱 URL**: [https://drbrooks-moneyreport.pages.dev/](https://drbrooks-moneyreport.pages.dev/) (`data/reports.json` ID: `rep-neuroplasticity`)

#### 2. 핵심 구현 아키텍처 및 4대 생물학적 기둥
1. **역사적 패러다임 전환 (1913 ~ 2026+)**:
   - 1913 라몬 이 카할의 불변 뇌 교조 $\to$ 1949 도널드 헵 공발화 가설 $\to$ 1969 폴 바키리타 감각 대체 $\to$ 1983 메르제니히 올빼미원숭이 체성감각 피질 재구성 $\to$ 1998 에릭 캔델 분자기전 & 성인 해마 신경발생(700개/일) $\to$ 2026 커넥톰 제어 & 뉴로모픽 인공지능 연속 학습.
2. **4대 생물학적 기둥 (Pillars)**:
   - ① **장기강화(LTP) & 장기약화(LTD)**: NMDA 수용체의 $Mg^{2+}$ 블록 해제 및 $Ca^{2+}$ 유입, CaMKII 활성화와 시냅스 후막 AMPA 수용체 밀도 제어.
   - ② **스파이크 타이밍 의존 가소성(STDP)**: 전·후 뉴런의 $20\text{ms}$ 이내 인과적 발화($\Delta t > 0$) 시 강화($\Delta w > 0$), 비인과적 발화($\Delta t < 0$) 시 약화($\Delta w < 0$).
   - ③ **구조적 개조**: BDNF 분비 $\to$ TrkB 수용체 결합 $\to$ 액틴 세포골격 재편 $\to$ 버섯 모양 수상돌기 가시(Dendritic Spine) 신생 및 미엘린 수초화.
   - ④ **피질 지도 재편 & 항상성**: 입력 빈도에 따른 대뇌 체성감각 피질(S1) 영토 확장/흡수 및 뇌전증 폭주를 막는 시냅스 스케일링(Synaptic Scaling).
3. **실시간 인터랙티브 캔버스 시뮬레이터**:
   - **모드 1 [STDP & 시냅스 분자 모델]**: $\Delta t$ 슬라이더(-40ms ~ +40ms) 조작에 따른 NMDA 채널의 $Mg^{2+}$ 언블록, 칼슘 유입, AMPA 수용체 수(${420\text{개}/\mu\text{m}^2}$) 및 수상돌기 가시 볼륨 실시간 팽창/수축 애니메이션.
   - **모드 2 [체성감각 피질(S1) 토포그래피 재편]**: 5개 손가락(D1~D5) 자극 및 피아노 집중 연습, D3 신경 차단, 합지증(손가락 결합) 4대 임상 시나리오에 따른 피질 영역 침식·확장 실시간 렌더링.
4. **의학·공학적 파급 및 대조 분석**:
   - 뇌졸중 환자의 강제유도 운동치료(CIMT), 인공와우 뇌 적응, 뉴로모픽 AI의 파국적 망각(Catastrophic Forgetting) 극복.
   - 적응적 가소성 vs 환상지 통증/국소성 이긴장증 등 부적응적(Maladaptive) 가소성 1:1 대조 매트릭스.
   - Computational Neuroscience Python 레퍼런스 코드 수록.

### 2026-09-28: 지식 증류(Knowledge Distillation) 인터랙티브 ELI5 학습 아티팩트 제작 및 자동 퍼블리싱

#### 1. 최종 산출물
- **저장소 산출물**: [`knowledge_distillation_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/knowledge_distillation_in_depth.html)
- **브레인 아티팩트**: [`knowledge_distillation_in_depth.html`](file:///Users/nelcome/.gemini/antigravity-cli/brain/c45500f3-7507-490e-8902-98916f8b08e3/knowledge_distillation_in_depth.html)
- **라이브 퍼블리싱 URL**: [https://drbrooks-moneyreport.pages.dev/](https://drbrooks-moneyreport.pages.dev/) (`data/reports.json` ID: `rep-knowledge-distillation`)

#### 2. 핵심 구현 아키텍처 및 4대 이론 기둥
1. **역사적 패러다임 전환 (2006 ~ 2026+)**:
   - 2006 Caruana & Buciluǎ 모델 압축(Model Compression) $\to$ 2015 Hinton, Vinyals, Dean 소프트맥스 온도($T$)와 Dark Knowledge 공식화 $\to$ 2015 Romero et al. FitNets 힌트 계층(Hint Layers) 특징 전이 $\to$ 2017 Zagoruyko & Komodakis 공간 어텐션 전이(AT) $\to$ 2019 Sanh et al. DistilBERT 트랜스포머 압축 표준화 $\to$ 2024~2026 DeepSeek-R1-Distill-Qwen 및 On-Policy CoT(사고 사슬) 추론 궤적 증류.
2. **4대 지식 증류 이론 기둥 (Pillars)**:
   - ① **반응 동역학(Response Dynamics) & Softmax 온도($T$)**: 평탄화 확률 $q_i = \exp(z_i/T)/\sum \exp(z_j/T)$, $\partial \mathcal{D}_{KL}/\partial z_{s, i} \propto 1/T^2$ 상쇄를 위한 $T^2$ 그래디언트 보정 및 고온 극한에서의 MSE 동치성 증명.
   - ② **특징 및 관계 표상 일치(Representation Matching)**: FitNets의 $1\times 1$ 선형 사영 계층($W_r$) 기반 은닉 표상 전이, RKD(Relational KD)의 거리(Distance-wise) 및 각도(Angle-wise) 삼중쌍 기하학 보존.
   - ③ **LLM 추론 동역학**: Forward KL(Zero-avoiding, 환각 유발) vs Reverse KL(Mode-seeking, 날카롭고 논리적인 모드 집중), 학생 샘플링 궤적을 수정하는 온폴리시(On-Policy) 증류.
   - ④ **용량 불일치(Capacity Gap) & 정규화**: 교사-학생 체급 격차를 완화하는 조교 모델(TAKD) 파이프라인, 동일 구조 반복 증류(Born-Again Networks)의 정규화 이점 및 레이블 스무딩 효과.
3. **실시간 인터랙티브 캔버스 시뮬레이터**:
   - **모드 1 [Softmax 온도 & Dark Knowledge 가시화기]**: $T$ 슬라이더(1.0 ~ 15.0) 및 $\alpha$ 슬라이더 조작에 따른 5개 클래스 교사 Soft Targets vs 학생 확률 분포 바/라인 차트, 엔트로피, KL 발산, $T^2 \cdot D_{KL}$ 손실 실시간 연산.
   - **모드 2 [학생 아키텍처 압축 & 파레토 트레이드오프]**: 레이어 수(2~12L), 은닉 차원(128~768d) 조작에 따른 파라미터 감축률, 추론 레이턴시(ms), 속도 가속 배율 및 정확도 보존율(%) 파레토 프론티어 곡선 실시간 렌더링.
4. **산업적 파급 및 4대 경량화 기법 대조**:
   - Apple Neural Engine 온디바이스 탑재, 데이터센터 서빙 비용 및 전력 90% 절감, 소형 언어 모델(Reasoning SLM) 성능 극대화.
   - 지식 증류(KD) vs 양자화(PTQ) vs 가지치기(Pruning) vs 저순위 분해(LoRA/SVD) 6대 축 입체 비교 매트릭스.
   - PyTorch 2.x 벡터화 표준 손실 함수 및 훈련 루프 완벽 구현.
### 2026-09-28: eli5 스킬 디자인 표준 개정 — 타일 UI 좌/상단 컬러 스트라이프 효과 삭제 및 순수 Apple Minimal Surfaces 표준화

#### 1. 개정 배경 및 목적
- **Apple 정통 미니멀리즘 확립**: Apple 공식 제품 쇼케이스(`https://www.apple.com/kr/iphone-duo/`) 규격에 부합하도록 타일 및 카드 컴포넌트에 적용되었던 인위적 좌측/상단 컬러 스트라이프 라인 장식(`::before`, `::after`)과 호버 시의 스트라이프 재드로잉 애니메이션을 전면 배제.
- **시각적 군더더기 제거 및 콘텐츠 집중도 극대화**: 화려하지만 인위적인 장식선을 없애고, 순수한 백색/반투명 세라믹 표면(`border-radius: 20px~28px`), 섬세한 헤어라인 테두리(`border: 1px solid rgba(0, 0, 0, 0.08)`), 절제된 마이크로 리프트(`translateY(-2px)`) 및 자연스러운 앰비언트 블러 섀도우로 절제되고 우아한 애플 감성을 단일 표준화.

#### 2. 주요 반영 내역
- **스킬 명세 갱신**: `/Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md`
  - 기존 "Interactive Accent Stripe UX Animation (상단·좌측 컬러 스트라이프 호버 재드로잉 표준)" 삭제.
  - **"타일 UI 좌/상단 컬러 스트라이프 효과 배제 (순수 Apple Minimal Surfaces 표준)"** 지침 신설 및 엄격한 금지 규칙 명문화.
- **하네스 규칙 갱신**: `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/GEMINI.md` 변경 이력 반영 완료.
- **적용 범위**: 이후 생성되는 모든 ELI5 HTML 아티팩트의 Bento Grid, Theoretical Pillar Cards, Timeline Content, Legacy Cards, Playground Container 전반.

### 2026-09-29: eli5 스킬 Apple iPad Air 쇼케이스 디자인 시스템(웹 효과·버튼·스크롤) 전면 통합

#### 1. 분석 개요 및 개정 목적
- **레퍼런스 대상**: Apple 대한민국 공식 쇼케이스 [`https://www.apple.com/kr/ipad-air/`](https://www.apple.com/kr/ipad-air/)
- **핵심 목표**: iPad Air 특유의 유체 텍스트 그라디언트, 캡슐형 세그먼트 토글러, 스크롤-드리븐 스태거드 리빌/블러 페이드, 스티키 락업 & 스크러빙 메커니즘을 단일 파일 HTML 아티팩트 규격에 완벽히 이식하여, 시각적 몰입감과 상호작용성을 프론티어 수준으로 극대화.

#### 2. 핵심 분석 및 스킬 반영 사항
1. **유체 텍스트 그라디언트 (`.text-gradient`)**:
   - `Air Blue-Cyan` (`#0071e3` $\to$ `#4facfe`), `M4 Cybernetic` (`#ff5e3a` $\to$ `#ff2a68` $\to$ `#af52de`), `Intelligence Aurora` (`#5856d6` $\to$ `#af52de` $\to$ `#ff2d55` $\to$ `#ff9500`) 3대 시그니처 텍스트 그라디언트 토큰화.
2. **iPad Air 시그니처 버튼 & 인터랙티브 컨트롤**:
   - **Primary Action Pill Button**: 9999px 타원 알약 캡슐, Apple Blue/솔리드 딥 블랙, 임계 감쇠 스프링 압축(`transform: scale(0.96)`), 앰비언트 섀도우.
   - **Capsule Segmented Toggle (Two-Sizes Switcher Metaphor)**: 11인치 vs 13인치 스위처에서 유래한 캡슐 트랙 및 화이트 필 활성 탭, 스펙 콜아웃(`.toggle-callout`) 크로스페이드 인터랙션.
   - **Micro-Action Plus Button (`+`)**: 카드 우측 하단 32px 원형 버튼, 호버 시 90도 회전 및 블루 전환 마이크로 스핀 모션.
   - **Fluid Dot Navigation (`.dotnav`)**: 슬라이드 갤러리용 8px 원형 $\to$ 24px 알약 캡슐 확장 유체 도트.
   - **Secondary Link with Kinetic Arrow**: `#0066cc`, trailing arrow `→`, 호버 시 translateX(4px).
3. **스크롤-드리븐 모션 아키텍처 (Scroll-Driven Motion)**:
   - **Top Reading Progress Bar**: 뷰포트 최상단 2.5px 초박형 멀티스톱 진행 표시기.
   - **Sticky Section Lockup & Scrubbing**: `position: sticky` 기반 스크롤 진행에 따른 스케일/투명도 보간 및 다이어그램 회전 싱크.
   - **Scroll-Triggered Staggered Blur Reveal**: `IntersectionObserver` 기반 `translateY(28px) + blur(6px) -> translateY(0) + blur(0)` 순차(80ms) 등장.
   - **Dynamic Spec Counter Roll-Up**: 수치 데이터 뷰포트 진입 시 0에서 목표값까지 카운트업되는 Vanilla JS 마이크로 인터랙션.
4. **M4 Chip High-Performance Inversion**:
   - 심층 아키텍처 및 무거운 계산 섹션에 적용되는 딥 블랙/스페이스 그레이(`#000000`/`#0d0d11`) 반전 및 방사형 네온 글로우.
5. **순수 Apple Minimal Surfaces 유지**:
   - 타일/카드 UI 좌·상단 컬러 스트라이프 라인 장식 금지 원칙 철저 계승.

#### 3. 변경 파일
- [`SKILL.md`](file:///Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md)
- [`GEMINI.md`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/GEMINI.md)
- [`memory.md`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/memory.md)

#### 4. 아티팩트 재생성 및 배포 완료
- **대상 파일**: [`knowledge_distillation_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/knowledge_distillation_in_depth.html)
- **적용된 신규 테마 규격**:
  - `Air Blue-Cyan` 텍스트 그라디언트 헤드라인 적용
  - 상단 2.5px 초박형 멀티스톱 스크롤 진행 바 (`#scroll-progress`) 연동
  - Highlights 섹션 4대 통계 Tout 뷰포트 진입 시 카운트업 롤업 애니메이션 및 4-도트 유체 내비게이터(`.dotnav`) 탑재
  - 4대 이론 기둥 섹션 M4 칩 테마 다크 반전(`#000000`) 및 32px 마이크로 플러스 버튼(`+`) 아코디언 토글 적용
  - 시뮬레이터 모드 전환부에 iPad Air Two-Sizes 스위처 메타포 캡슐 세그먼트 토글러(`.toggle-wrap`, `.toggle-button`, `.toggle-callout`) 및 크로스페이드 인터랙션 탑재
  - 순수 Apple Minimal Surfaces 규격(타일 좌·상단 컬러 스트라이프 일체 배제) 준수
  - `IntersectionObserver` 기반 전 섹션 스태거드 블러 페이드 리빌(`.scroll-reveal`, 80ms 간격 순차 등장)
- **라이브 퍼블리싱 URL**: [https://drbrooks-moneyreport.pages.dev/](https://drbrooks-moneyreport.pages.dev/) (`publish_to_moneyreport.py` 자동 배포 및 GitHub `origin main` 동기화 완료)
 
---

### 2026-09-29: Apple Pencil Pro 활용법 살펴보기 버튼(All-Access-Pass, AAP) 애니메이션 구축 및 스킬 전면 반영

#### 1. 주요 작업 목적
- 공식 Apple iPad Air 쇼케이스(`https://www.apple.com/kr/ipad-air/`)에 탑재된 플래그십 인터랙션 버튼인 **"Apple Pencil Pro 활용법 살펴보기" (All-Access-Pass / AAP L1 Button)** 컴포넌트 및 특유의 애니메이션 역학을 정밀 분석하고, 이를 독립 재사용 가능한 표준 규격으로 확립하여 `eli5` 스킬 및 최근 아티팩트에 전면 적용.

#### 2. 핵심 구현 및 시그니처 애니메이션 명세
1. **HTML 아키텍처 (`.all-access-pass`, `.aap-base`)**:
   - 알약 형태의 라운디드 캡슐 베이스(`border-radius: 9999px`), 좌측 텍스트 레이블, 우측 원형 플러스 버튼(`.aap-base__icon`)으로 구성된 Apple 고유의 3단 구조 충실 계승.
2. **시그니처 90도 스핀 & 팽창 애니메이션 (`.aap-base:hover .aap-base__icon`)**:
   - 버튼 호버 시 우측 파란 원형 아이콘 내부의 플러스(+) SVG 기호가 **`transform: rotate(90deg) scale(1.1);`**로 부드럽게 90도 회전하면서 미세 팽창하는 애플 공식 스프링 역학(`cubic-bezier(0.16, 1, 0.3, 1)`) 구현.
   - 버튼 자체는 `transform: translateY(-2px) scale(1.02);` 및 `box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);`로 우아하게 떠오름.
3. **인터랙티브 All-Access-Pass 모달 시트 (`#aapModal`) 연동**:
   - 버튼 클릭 시 실제 애플 웹사이트와 동일하게 백드롭 블러(`backdrop-filter: blur(24px) saturate(180%)`) 기반의 바텀시트/센터 모달이 부드럽게 팝업.
   - 모달 내부에는 Apple Pencil Pro의 3대 혁신(스퀴즈 제스처 감지, 배럴 롤 자이로스코프, 맞춤형 햅틱 엔진)과 지식 증류의 실무 3단계 파이프라인(로짓 정렬, 잠재 표상 프로젝션, 온폴리시 RLCD 캘리브레이션)을 세그먼트 토글러로 전환하며 탐색할 수 있는 카드 뷰어 완비.
   - ESC 키, 닫기 버튼, 외부 배경 클릭 닫기 및 배경 스크롤 락 완벽 제어.

#### 3. 변경 파일
- [`SKILL.md`](file:///Users/nelcome/.gemini/config/plugins/eli5/skills/eli5/SKILL.md)
- [`knowledge_distillation_in_depth.html`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/knowledge_distillation_in_depth.html)
- [`GEMINI.md`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/GEMINI.md)
- [`memory.md`](file:///Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings/memory.md)

#### 4. 배포 및 동기화 결과
- `publish_to_moneyreport.py`를 통해 Cloudflare Pages 실시간 배포 및 GitHub `origin main` 커밋/푸시 동기화 완료: [https://drbrooks-moneyreport.pages.dev/](https://drbrooks-moneyreport.pages.dev/)

---

## 📌 메모리 관리 및 동기화 지침
1. **저장 경로 기본 준수**: 모든 학습 가이드, 다이어그램, ELI5 HTML 아티팩트는 `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings` 디렉토리에 생성 및 저장한다.
2. **자동 퍼블리싱 준수**: 아티팩트 생성 완료 즉시 `publish_to_moneyreport.py`를 실행하여 `https://drbrooks-moneyreport.pages.dev/`에 실시간 배포 및 GitHub 동기화를 수행한다.
3. **하네스 진화**: 추후 AI 관련 새로운 요구사항이나 모듈 추가 시 `learning-guide-orchestrator` 스킬을 사용하여 기존 에이전트/스킬을 재활용 및 확장한다.
4. **히스토리 작성**: 새로운 세션 작업 완료 시 본 `memory.md` 하단에 날짜별 변경 내역을 지속 기록한다.





