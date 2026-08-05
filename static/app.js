// ==========================================================================
// 🚀 BRUNCH SCRAPER FRONTEND LOGIC (VANILLA JS)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let articles = [];
    let activeArticleId = null;
    let scrapeInterval = null;
    let activeCategoryFilter = null;

    // DOM Elements
    const statCount = document.getElementById('stat-count');
    const statLatestDate = document.getElementById('stat-latest-date');
    
    // FAB & Admin Modal Elements
    const fabSyncBtn = document.getElementById('fab-sync-btn');
    const adminModal = document.getElementById('admin-modal');
    const btnModalClose = document.getElementById('btn-modal-close');
    const modalStatePassword = document.getElementById('modal-state-password');
    const modalStateConsole = document.getElementById('modal-state-console');
    const adminPasswordForm = document.getElementById('admin-password-form');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const passwordErrorMsg = document.getElementById('password-error-msg');
    
    const scraperStatusBadge = document.getElementById('scraper-status-badge');
    const consoleLogs = document.getElementById('console-logs');
    const monitorProgressCount = document.getElementById('monitor-progress-count');
    
    const searchInput = document.getElementById('search-input');
    const articlesList = document.getElementById('articles-list');
    
    const welcomeView = document.getElementById('welcome-view');
    const articleView = document.getElementById('article-view');
    
    const viewTitle = document.getElementById('view-title');
    const viewDate = document.getElementById('view-date');
    const viewFileInfo = document.getElementById('view-file-info');
    const viewUrlBtn = document.getElementById('view-url-btn');
    const viewContent = document.getElementById('view-content');

    // 🔔 Sync Banner DOM Elements
    const syncNotificationBanner = document.getElementById('sync-notification-banner');
    const notifyOnlineCount = document.getElementById('notify-online-count');
    const notifyLocalCount = document.getElementById('notify-local-count');
    const btnBannerSync = document.getElementById('btn-banner-sync');
    const btnBannerClose = document.getElementById('btn-banner-close');

    // Tab and Graph View DOM Elements
    const tabGraphBtn = document.getElementById('tab-graph-btn');
    const tabReaderBtn = document.getElementById('tab-reader-btn');
    const tabWriteBtn = document.getElementById('tab-write-btn');
    const graphViewContainer = document.getElementById('graph-view-container');
    const writeView = document.getElementById('write-view');
    const writeForm = document.getElementById('write-form');
    const writeDate = document.getElementById('write-date');
    const writeCategory = document.getElementById('write-category');
    const writeTitle = document.getElementById('write-title');
    const writeContent = document.getElementById('write-content');
    const writePassword = document.getElementById('write-password');
    const btnCancelWrite = document.getElementById('btn-cancel-write');

    let networkInstance = null; // vis.js network instance
    let nodesDataset = null;
    let edgesDataset = null;
    let focusedArticleId = null; // Currently centered article in knowledge graph
    let graphAdjacency = {}; // nodeId -> Set of directly linked nodeIds, for Obsidian hover dimming

    // Check if running in local Flask environment (port 5050)
    const isFlaskEnv = window.location.port === '5050';

    // ==========================================================================
    // 📂 ARTICLE MANAGEMENT & FETCHING
    // ==========================================================================

    // Fetch and render the list of available articles
    async function loadArticles() {
        const fetchUrls = [
            'api/articles.json',
            './api/articles.json',
            '/thoughts/api/articles.json',
            `${window.location.pathname.replace(/\/$/, '')}/api/articles.json`
        ];
        
        let loadedData = null;
        for (const url of fetchUrls) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    loadedData = await res.json();
                    if (Array.isArray(loadedData) && loadedData.length > 0) break;
                }
            } catch (e) {
                // Try next URL fallback
            }
        }

        if (loadedData && Array.isArray(loadedData)) {
            articles = loadedData;
            renderArticlesList(articles);
            updateStats();
        } else {
            console.error('Error: Could not load articles.json from any known path.');
            articlesList.innerHTML = `
                <div class="list-placeholder">
                    <i class="fa-solid fa-triangle-exclamation" style="color: var(--color-error, #ff4d4f)"></i>
                    <p>목록을 불러오는 데 실패했습니다.</p>
                </div>
            `;
        }
    }

    // Render articles list in the sidebar
    function renderArticlesList(items) {
        if (items.length === 0) {
            articlesList.innerHTML = `
                <div class="list-placeholder">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>수집된 글이 없습니다. 위 폼을 이용해 크롤링을 구동해보세요!</p>
                </div>
            `;
            return;
        }

        articlesList.innerHTML = '';
        items.forEach(article => {
            const item = document.createElement('div');
            item.className = `article-item ${activeArticleId === article.id ? 'active' : ''}`;
            item.setAttribute('data-id', article.id);
            
            item.innerHTML = `
                <div class="item-meta">
                    <span class="item-id">ID ${article.id}</span>
                    <span class="item-date">${article.date}</span>
                </div>
                <h3>${article.title}</h3>
                <div class="item-footer">
                    <i class="fa-regular fa-file-lines"></i>
                    <span>${article.size_kb} KB</span>
                </div>
            `;

            item.addEventListener('click', () => {
                selectArticle(article.id);
            });

            articlesList.appendChild(item);
        });
    }

    // Select an article and render its markdown content
    async function selectArticle(id, shouldSwitchTab = true, syncGraphFocus = true) {
        // Automatically switch to reader tab if requested
        if (shouldSwitchTab && (tabGraphBtn.classList.contains('active') || (tabWriteBtn && tabWriteBtn.classList.contains('active')))) {
            tabReaderBtn.classList.add('active');
            tabGraphBtn.classList.remove('active');
            if (tabWriteBtn) tabWriteBtn.classList.remove('active');
            graphViewContainer.classList.add('hidden');
            if (writeView) writeView.classList.add('hidden');
        }

        // Toggle active classes in list
        const items = articlesList.querySelectorAll('.article-item');
        items.forEach(item => {
            if (parseInt(item.getAttribute('data-id')) === id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        activeArticleId = id;
        if (syncGraphFocus) {
            focusedArticleId = id; // Sync centered article in knowledge graph
        }
        
        // Auto-close mobile sidebar when an article is selected
        if (window.innerWidth <= 1024) {
            const sidebarEl = document.querySelector('.sidebar');
            if (sidebarEl) sidebarEl.classList.remove('mobile-open');
        }

        const isReaderActive = shouldSwitchTab || tabReaderBtn.classList.contains('active');

        // Show viewer loading state if reader is active
        if (isReaderActive) {
            welcomeView.classList.add('hidden');
            articleView.classList.remove('hidden');
        }
        
        // Reset loading text in DOM (remains hidden if reader tab is inactive)
        viewTitle.textContent = "불러오는 중...";
        viewDate.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> 로딩 중`;
        viewFileInfo.innerHTML = '';
        if (viewUrlBtn) viewUrlBtn.classList.add('hidden');
        viewContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: var(--text-secondary); gap: 16px;">
                <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--color-primary)"></i>
                <p>글을 불러오고 있습니다.</p>
            </div>
        `;

        try {
            let data;
            if (window.localArticleContents && window.localArticleContents[id]) {
                data = window.localArticleContents[id];
            } else {
                const response = await fetch(`api/article/${id}.json`);
                data = await response.json();
            }

            if (!data || data.error) {
                viewContent.innerHTML = `<p style="color: var(--color-error)">[오류] ${data ? data.error : "글을 찾을 수 없습니다."}</p>`;
                return;
            }

            // Find selected article details for header meta
            const articleMeta = articles.find(a => a.id === id);

            // Render details
            viewTitle.textContent = articleMeta ? articleMeta.title : "제목 없음";
            viewDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${articleMeta ? articleMeta.date : 'N/A'}`;
            viewFileInfo.innerHTML = `<i class="fa-regular fa-file-code"></i> ${data.filename} (${articleMeta ? articleMeta.size_kb : 0} KB)`;
            
            if (articleMeta && articleMeta.url) {
                if (viewUrlBtn) {
                    viewUrlBtn.href = articleMeta.url;
                    viewUrlBtn.classList.remove('hidden');
                }
            } else {
                if (viewUrlBtn) viewUrlBtn.classList.add('hidden');
            }

            // Clean headers and render Markdown content
            let mdContent = data.content;
            
            // Render Markdown using Marked.js
            viewContent.innerHTML = marked.parse(mdContent);

            // Smooth scroll content area to top if reader is active
            if (isReaderActive) {
                document.querySelector('.viewer-content').scrollTop = 0;
            }

        } catch (error) {
            console.error('Error fetching article content:', error);
            viewContent.innerHTML = `<p style="color: var(--color-error)">기사 본문을 불러오는 데 실패했습니다. (${error.message})</p>`;
        }
    }

    // Update statistics dashboard card
    function updateStats() {
        statCount.textContent = articles.length;
        if (articles.length > 0) {
            // Find latest date in list
            const dates = articles.map(a => a.date).filter(d => d !== 'N/A');
            if (dates.length > 0) {
                // Dates are strings like YYYY-MM-DD. Simple sorting works
                dates.sort();
                statLatestDate.textContent = dates[dates.length - 1];
            } else {
                statLatestDate.textContent = 'N/A';
            }
        } else {
            statLatestDate.textContent = 'N/A';
        }
    }

    // Live search filter in sidebar
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderArticlesList(articles);
            return;
        }

        const filtered = articles.filter(article => {
            return article.title.toLowerCase().includes(query) || 
                   article.date.includes(query) ||
                   article.id.toString().includes(query);
        });

        renderArticlesList(filtered);
    });


    // ==========================================================================
    // ⚙️ SCRAPER CONTROL VIA FAB & MODAL
    // ==========================================================================
    let isScraperActive = false;

    // Click listener on FAB Sync button
    fabSyncBtn.addEventListener('click', async () => {
        // Check current running state from server first
        try {
            const response = await fetch('/api/scrape/status');
            const status = await response.json();
            
            if (status.is_running) {
                // If running, open console log immediately
                openModal(true);
                startLogsPolling();
            } else {
                // If not running, ask for password
                openModal(false);
            }
        } catch (error) {
            console.error("Error checking scraper status on FAB click:", error);
            openModal(false); // Fallback to password state
        }
    });

    // Close Modal
    btnModalClose.addEventListener('click', () => {
        adminModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    });

    // Close Modal on clicking backdrop
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    });

    // Open Modal function
    function openModal(showConsole = false) {
        adminModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        passwordErrorMsg.classList.add('hidden');
        adminPasswordInput.value = '';

        if (showConsole) {
            modalStatePassword.classList.add('hidden');
            modalStateConsole.classList.remove('hidden');
        } else {
            modalStatePassword.classList.remove('hidden');
            modalStateConsole.classList.add('hidden');
            setTimeout(() => adminPasswordInput.focus(), 100);
        }
    }

    // Submit password and start scraping
    adminPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = adminPasswordInput.value;
        passwordErrorMsg.classList.add('hidden');

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password
                })
            });

            const result = await response.json();

            if (response.status === 401 || result.error) {
                // Shake modal content and show error
                const modalContent = document.querySelector('.modal-content');
                modalContent.classList.add('shake');
                setTimeout(() => modalContent.classList.remove('shake'), 400);

                passwordErrorMsg.textContent = result.error || "비밀번호가 일치하지 않습니다.";
                passwordErrorMsg.classList.remove('hidden');
                adminPasswordInput.focus();
                return;
            }

            // Transition to Console state
            modalStatePassword.classList.add('hidden');
            modalStateConsole.classList.remove('hidden');
            consoleLogs.textContent = "[*] 관리자 승인 완료. 크롤링 작업을 준비하는 중...\n";
            scraperStatusBadge.textContent = "준비 중";
            scraperStatusBadge.className = "status-badge running";
            fabSyncBtn.classList.add('spinning');

            // Start logs polling
            startLogsPolling();

        } catch (error) {
            passwordErrorMsg.textContent = `서버 연결 오류: ${error.message}`;
            passwordErrorMsg.classList.remove('hidden');
        }
    });

    // Polling interval loop for real-time console status
    function startLogsPolling() {
        if (scrapeInterval) clearInterval(scrapeInterval);
        fabSyncBtn.classList.add('spinning');
        
        scrapeInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/scrape/status');
                const status = await response.json();

                // Update badge and progress count
                monitorProgressCount.textContent = status.saved_count;
                
                if (status.is_running) {
                    scraperStatusBadge.textContent = `글 ID ${status.current_id} 분석 중`;
                    scraperStatusBadge.className = "status-badge running";
                    isScraperActive = true;
                } else if (status.finished) {
                    scraperStatusBadge.textContent = "수집 완료";
                    scraperStatusBadge.className = "status-badge";
                    fabSyncBtn.classList.remove('spinning');
                    clearInterval(scrapeInterval);
                    scrapeInterval = null;
                    isScraperActive = false;
                    
                    // Reload the articles sidebar immediately to show new arrivals!
                    loadArticles();
                    
                    // If notification banner is showing, hide it since we synced
                    syncNotificationBanner.classList.add('hidden');
                } else if (status.error) {
                    scraperStatusBadge.textContent = "오류 발생";
                    scraperStatusBadge.className = "status-badge";
                    fabSyncBtn.classList.remove('spinning');
                    clearInterval(scrapeInterval);
                    scrapeInterval = null;
                    isScraperActive = false;
                }

                // Render latest logs
                if (status.log && status.log.length > 0) {
                    consoleLogs.textContent = status.log.join('\n');
                    // Auto-scroll terminal console to bottom
                    consoleLogs.scrollTop = consoleLogs.scrollHeight;
                }

            } catch (error) {
                console.error("Error polling scraper status:", error);
            }
        }, 800);
    }

    // Check on page load if scraper is already running from a previous instance
    async function checkScraperActiveState() {
        if (window.location.port !== '5050' && !window.location.hostname.includes('127.0.0.1')) {
            // Disable sync checks on GitHub Pages or other non-local environments
            fabSyncBtn.style.display = 'none';
            return;
        }
        try {
            const response = await fetch('/api/scrape/status');
            const status = await response.json();
            
            if (status.is_running) {
                fabSyncBtn.classList.add('spinning');
                startLogsPolling();
            }
        } catch (error) {
            console.error("Error checking initial scraper state:", error);
        }
    }


    // ==========================================================================
    // 🔗 TAB TOGGLING CONTROL
    // ==========================================================================
    tabGraphBtn.addEventListener('click', () => {
        tabGraphBtn.classList.add('active');
        tabReaderBtn.classList.remove('active');
        if (tabWriteBtn) tabWriteBtn.classList.remove('active');
        graphViewContainer.classList.remove('hidden');
        welcomeView.classList.add('hidden');
        articleView.classList.add('hidden');
        if (writeView) writeView.classList.add('hidden');

        // Always re-initialize the graph to reflect any new article selection focus.
        // The graph data is fetched, so the redraw has to wait on it rather than on a
        // timer — on a cold open there is no network instance to redraw yet.
        initKnowledgeGraph(articles).then(() => {
            if (!networkInstance) return;
            // The container was unhidden above, and frameGraph reads clientWidth, which
            // forces the layout to resolve before it measures. This used to sit behind a
            // 100ms timer, which is where the pause on re-entry came from — the graph was
            // built and then held back a tenth of a second for no reason.
            networkInstance.redraw();
            frameGraph();
        });
    });

    tabReaderBtn.addEventListener('click', () => {
        tabReaderBtn.classList.add('active');
        tabGraphBtn.classList.remove('active');
        if (tabWriteBtn) tabWriteBtn.classList.remove('active');
        graphViewContainer.classList.add('hidden');
        if (writeView) writeView.classList.add('hidden');

        if (activeArticleId) {
            articleView.classList.remove('hidden');
            welcomeView.classList.add('hidden');
        } else {
            welcomeView.classList.remove('hidden');
            articleView.classList.add('hidden');
        }
    });

    if (tabWriteBtn) {
        tabWriteBtn.addEventListener('click', () => {
            tabWriteBtn.classList.add('active');
            tabGraphBtn.classList.remove('active');
            tabReaderBtn.classList.remove('active');
            
            graphViewContainer.classList.add('hidden');
            welcomeView.classList.add('hidden');
            articleView.classList.add('hidden');
            if (writeView) writeView.classList.remove('hidden');

            // Reset fields
            if (writeTitle) writeTitle.value = '';
            if (writeContent) writeContent.value = '';
            
            // Set current date in YYYY-MM-DD
            if (writeDate) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                writeDate.value = `${year}-${month}-${day}`;
            }

            // Restore password from sessionStorage if available
            if (writePassword) {
                writePassword.value = sessionStorage.getItem('admin_password') || '';
            }
            
            // Focus on title
            if (writeTitle) {
                setTimeout(() => writeTitle.focus(), 100);
            }
        });
    }

    if (btnCancelWrite) {
        btnCancelWrite.addEventListener('click', () => {
            tabReaderBtn.click();
        });
    }

    function downloadMarkdownFallback(id, title, date, category, content) {
        const safeTitle = title.replace(/[\/:*?"<>|]/g, '_').trim();
        const filename = `${id}_${safeTitle}.md`;
        
        const fileContent = `# ${title}\n\n- **작성일**: ${date}\n- **카테고리**: ${category}\n\n---\n\n${content}\n`;
        
        const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (writeForm) {
        writeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = writeTitle.value.trim();
            const date = writeDate.value;
            const category = writeCategory.value;
            const content = writeContent.value.trim();
            const password = writePassword.value;

            if (!title || !content) {
                alert("제목과 본문을 입력해주세요.");
                return;
            }

            const btnSave = document.getElementById('btn-save-article');
            const originalHtml = btnSave ? btnSave.innerHTML : '저장하기';

            try {
                if (btnSave) {
                    btnSave.disabled = true;
                    btnSave.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> 저장 중...`;
                }

                const response = await fetch('/api/article', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        date,
                        category,
                        content,
                        password
                    })
                });

                if (response.status === 404 || response.status === 502 || response.status === 503) {
                    throw new Error(`Server returned status ${response.status}`);
                }

                const result = await response.json();
                
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.innerHTML = originalHtml;
                }

                if (response.status === 401 || result.error) {
                    const actionsEl = document.querySelector('.write-actions');
                    if (actionsEl) {
                        actionsEl.classList.add('shake');
                        setTimeout(() => actionsEl.classList.remove('shake'), 400);
                    }
                    alert(result.error || "비밀번호가 올바르지 않습니다.");
                    if (writePassword) writePassword.focus();
                    return;
                }

                // Success! Save password in sessionStorage
                sessionStorage.setItem('admin_password', password);
                
                if (writeTitle) writeTitle.value = '';
                if (writeContent) writeContent.value = '';
                if (writePassword) writePassword.value = '';

                // Reload the article list
                await loadArticles();

                // Select and open the new article
                if (result.id) {
                    await selectArticle(result.id, true, true);
                }

            } catch (error) {
                console.warn("API save unavailable, falling back to local file download:", error);
                
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.innerHTML = originalHtml;
                }
                
                // Fallback: Generate custom ID and trigger markdown download
                const maxId = articles.reduce((max, art) => art.id > max ? art.id : max, 0);
                const newId = maxId + 1;
                
                downloadMarkdownFallback(newId, title, date, category, content);
                
                // Construct metadata and content for local-only storage
                const safeTitle = title.replace(/[\/:*?"<>|]/g, '_').trim();
                const filename = `${newId}_${safeTitle}.md`;
                const sizeKb = Math.round((content.length * 2) / 1024 * 10) / 10;
                
                const localArticleMeta = {
                    id: newId,
                    title: title,
                    date: date,
                    url: "",
                    filename: filename,
                    size_kb: sizeKb,
                    category: category
                };
                
                // Add to client memory
                articles.unshift(localArticleMeta);
                articles.sort((a, b) => b.id - a.id);
                
                if (!window.localArticleContents) {
                    window.localArticleContents = {};
                }
                window.localArticleContents[newId] = {
                    id: newId,
                    title: title,
                    date: date,
                    url: "",
                    filename: filename,
                    size_kb: sizeKb,
                    category: category,
                    content: `# ${title}\n\n- **작성일**: ${date}\n- **카테고리**: ${category}\n\n---\n\n${content}`
                };
                
                // Re-render
                renderArticlesList(articles);
                updateStats();
                
                alert(`[안내] 로컬 서버가 연동되지 않았습니다.\n작성한 글이 '${filename}' 파일로 다운로드되었습니다.\n(현재 웹 브라우저 화면의 목록 및 지식 그래프에 반영되었습니다.)`);
                
                if (writeTitle) writeTitle.value = '';
                if (writeContent) writeContent.value = '';
                if (writePassword) writePassword.value = '';
                
                // Open and view it
                await selectArticle(newId, true, true);
            }
        });
    }

    // ==========================================================================
    // 🧠 OBSIDIAN KNOWLEDGE GRAPH VIEW ENGINE
    // ==========================================================================

    let graphSignature = null;
    let graphBlurTimer = null;
    let graphDimmed = new Set(); // ids currently faded out by hover focus
    let dragFollowers = null; // node being dragged plus the neighbours trailing it
    let graphEntranceRaf = null;
    let dragRedrawRaf = null; // pending repaint for the current drag, at most one a frame
    let zoomRaf = null; // eases the view toward zoomTarget
    let zoomTarget = null; // scale the wheel has asked for, reached over several frames
    let zoomAnchor = null; // canvas point under the cursor, held still while the scale changes
    let zoomWired = false; // the wheel listener outlives the network, so bind it once

    // Drives both the opening bloom and the settle after a drag. Node coordinates are
    // written straight onto the vis bodies and drawn once per frame — moveNode() would
    // trigger its own redraw per node, which at 189 nodes a frame is what we removed the
    // physics to avoid.
    function animateNodesTo(startPositions, endPositions, duration) {
        if (!networkInstance) return;
        if (graphEntranceRaf) cancelAnimationFrame(graphEntranceRaf);
        const bodies = networkInstance.body.nodes;
        const ids = Object.keys(endPositions).filter(id => bodies[id] && startPositions[id]);
        if (!ids.length) return;

        const DURATION = duration || 700;
        const t0 = performance.now();
        const step = (now) => {
            if (!networkInstance) return;
            const t = Math.min(1, (now - t0) / DURATION);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            ids.forEach(id => {
                const from = startPositions[id];
                const to = endPositions[id];
                bodies[id].x = from.x + (to.x - from.x) * eased;
                bodies[id].y = from.y + (to.y - from.y) * eased;
            });
            networkInstance.redraw();
            graphEntranceRaf = t < 1 ? requestAnimationFrame(step) : null;
        };
        graphEntranceRaf = requestAnimationFrame(step);
    }

    // vis applies a wheel notch to the scale in one jump. Taking the wheel ourselves and
    // easing toward the scale it asked for turns that into a glide, and holding the canvas
    // point that was under the cursor still keeps the zoom pointed where the user is
    // looking. Only wheel is intercepted, so pinch on a trackpad still reaches vis.
    const ZOOM_MIN = 0.05;
    const ZOOM_MAX = 3;

    function wireSmoothZoom(container) {
        if (zoomWired || !container) return;
        zoomWired = true;

        container.addEventListener('wheel', (e) => {
            if (!networkInstance) return;
            e.preventDefault();
            // vis binds its own wheel handler on this same element, and stopPropagation
            // does not reach listeners sharing the element — without the immediate form
            // vis still applies its jump underneath the glide.
            e.stopImmediatePropagation();

            const box = container.getBoundingClientRect();
            const cursor = { x: e.clientX - box.left, y: e.clientY - box.top };
            zoomAnchor = {
                canvas: networkInstance.DOMtoCanvas(cursor),
                cursor: cursor,
                view: { width: box.width, height: box.height }
            };

            const from = zoomTarget === null ? networkInstance.getScale() : zoomTarget;
            const next = from * Math.exp(-e.deltaY * 0.0015);
            zoomTarget = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));

            if (zoomRaf !== null) return;
            const step = () => {
                if (!networkInstance || zoomTarget === null || !zoomAnchor) {
                    zoomRaf = null;
                    return;
                }
                const current = networkInstance.getScale();
                const eased = current + (zoomTarget - current) * 0.18;
                const done = Math.abs(zoomTarget - current) / zoomTarget < 0.002;
                const scale = done ? zoomTarget : eased;

                // Put the anchored canvas point back under the cursor at the new scale.
                networkInstance.moveTo({
                    scale: scale,
                    position: {
                        x: zoomAnchor.canvas.x - (zoomAnchor.cursor.x - zoomAnchor.view.width / 2) / scale,
                        y: zoomAnchor.canvas.y - (zoomAnchor.cursor.y - zoomAnchor.view.height / 2) / scale
                    }
                });

                if (done) {
                    zoomRaf = null;
                    zoomTarget = null;
                    return;
                }
                zoomRaf = requestAnimationFrame(step);
            };
            zoomRaf = requestAnimationFrame(step);
        }, { capture: true, passive: false });
    }

    // Centre and zoom the graph from the precomputed node coordinates. vis.fit() kept
    // measuring the canvas before it had its visible size and framed the view off-centre;
    // the bounds are known up front, so the camera can be set directly.
    let graphBounds = null;

    function frameGraph() {
        const container = document.getElementById('graph-canvas');
        if (!networkInstance || !graphBounds || !container) return;
        const pad = 120; // room for the labels, which sit outside the node coordinates
        const w = (graphBounds.maxX - graphBounds.minX) + pad * 2;
        const h = (graphBounds.maxY - graphBounds.minY) + pad * 2;
        // The legend used to be a full-width strip along the bottom, so a band of height
        // was reserved for it and the graph pushed up out of the way. It sits in the
        // top-right corner now and covers no strip, so the whole canvas is usable again.
        const viewW = container.clientWidth || 800;
        const viewH = container.clientHeight || 600;
        const scale = Math.max(0.05, Math.min(Math.min(viewW / w, viewH / h), 2));
        networkInstance.moveTo({
            position: {
                x: (graphBounds.minX + graphBounds.maxX) / 2,
                y: (graphBounds.minY + graphBounds.maxY) / 2
            },
            scale: scale
        });
    }

    // Rewriting all 189 nodes on every hover and again on every blur cost ~11ms a pair,
    // which is what made moving the mouse over the graph feel heavy. Only the nodes whose
    // opacity actually changes get written. Pass null to clear the focus.
    function applyGraphDimming(keepFn) {
        if (!nodesDataset) return;
        const updates = [];
        nodesDataset.getIds().forEach(id => {
            const shouldDim = keepFn ? !keepFn(id) : false;
            const isDimmed = graphDimmed.has(id);
            if (shouldDim === isDimmed) return;
            updates.push({ id: id, opacity: shouldDim ? 0.15 : 1 });
            if (shouldDim) graphDimmed.add(id); else graphDimmed.delete(id);
        });
        if (updates.length) nodesDataset.update(updates);
    }

    // The resting state of the graph: everything lit, or — when a legend category is
    // picked — that category's articles plus the concepts they reach. Hover focus is
    // layered on top of this and falls back to it, which is why blur restores through
    // here instead of clearing the dimming outright.
    function restoreGraphFocus() {
        if (!graphData || !activeCategoryFilter) {
            applyGraphDimming(null);
            return;
        }
        const keep = new Set();
        graphData.nodes.forEach(node => {
            if (node.type === 'article' && node.category === activeCategoryFilter) {
                keep.add(node.id);
            }
        });
        // Concepts are what tie the category to the rest of the writing, so a category
        // highlight that stopped at the articles would cut every line it draws.
        [...keep].forEach(id => {
            (graphAdjacency[id] || new Set()).forEach(neighbour => {
                if (String(neighbour).charAt(0) === 'c') keep.add(neighbour);
            });
        });
        applyGraphDimming(id => keep.has(id));
    }

    // The graph is derived from the article text at build time — see build_graph.py.
    // Fetched once and reused; it only changes when the site is rebuilt.
    let graphData = null;
    let graphDataPromise = null;

    function loadGraphData() {
        if (graphData) return Promise.resolve(graphData);
        if (graphDataPromise) return graphDataPromise;
        const candidates = [
            'api/graph.json',
            './api/graph.json',
            '/thoughts/api/graph.json',
            `${window.location.pathname.replace(/\/$/, '')}/api/graph.json`
        ];
        graphDataPromise = (async () => {
            for (const url of candidates) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) continue;
                    graphData = await res.json();
                    return graphData;
                } catch (e) { /* try the next path */ }
            }
            console.error('Error: Could not load graph.json from any known path.');
            return null;
        })();
        return graphDataPromise;
    }

    function initKnowledgeGraph(items) {
        return loadGraphData().then(data => { if (data) buildKnowledgeGraph(data, items); });
    }

    function buildKnowledgeGraph(data, items) {
        const container = document.getElementById('graph-canvas');
        if (!container) return;

        // Monochrome palette, flipped for the light canvas. The dark values wash out
        // completely on the light theme — white edges become invisible.
        const isDark = document.body.classList.contains('theme-dark');

        // The graph is built purely from the graph data and the theme. Rebuilding it on
        // every tab visit threw the settled positions away and re-ran the solver for ~10s
        // each time; reuse the existing layout whenever neither input changed.
        const signature = data.nodes.length + '|' + data.edges.length + '|' + isDark;
        if (networkInstance && signature === graphSignature) {
            networkInstance.redraw();
            return;
        }
        graphSignature = signature;

        const labelColor = isDark ? '#cccccc' : '#4b5563';
        const conceptFill = isDark ? '#5a5f6a' : '#c9ced8';
        // Fallback only — used when an edge's source node has no category to read a
        // colour from, which should not happen once the legend has loaded.
        const edgeIdle = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(17, 24, 39, 0.12)';
        // getComputedStyle hands back "rgb(r, g, b)"; edges want that tinted and
        // translucent rather than the flat dot colour, or 699 of them stacked over each
        // other read as a solid smear instead of a graph.
        function tint(rgbString, alpha) {
            const m = rgbString.match(/[\d.]+/g);
            return m ? `rgba(${m[0]}, ${m[1]}, ${m[2]}, ${alpha})` : edgeIdle;
        }
        // The focused subgraph has to read as a different layer, not a lighter shade of
        // the same one — that contrast is the whole point of the hover state.
        const edgeFocus = isDark ? '#4facfe' : '#2f7fd4';

        // Read straight off the legend swatches. This used to be a second palette here
        // in the script, and all seven colours had drifted from the ones the legend
        // shows — picking 기획론 lit up purple nodes next to a blue dot. Taking them
        // from the dots leaves one place to change a colour.
        const categories = {};
        document.querySelectorAll('.legend-item').forEach(item => {
            const dot = item.querySelector('.dot');
            const category = item.getAttribute('data-category');
            if (dot && category) {
                categories[category] = { color: getComputedStyle(dot).backgroundColor };
            }
        });

        const metaById = {};
        (items || []).forEach(article => { metaById[article.id] = article; });

        const positions = {};
        const entranceStart = {};
        const nodeById = {};
        data.nodes.forEach(node => {
            positions[node.id] = { x: node.x, y: node.y };
            // Everything starts pulled in toward the centre and blooms outward.
            entranceStart[node.id] = { x: node.x * 0.25, y: node.y * 0.25 };
            nodeById[node.id] = node;
        });

        const pts = Object.values(positions);
        graphBounds = pts.length ? {
            minX: Math.min(...pts.map(p => p.x)),
            maxX: Math.max(...pts.map(p => p.x)),
            minY: Math.min(...pts.map(p => p.y)),
            maxY: Math.max(...pts.map(p => p.y))
        } : null;

        // 1. Build Nodes. Articles carry their category colour; concepts are the
        // neutral connective tissue between them and stay muted.
        const nodesArray = data.nodes.map(node => {
            const isArticle = node.type === 'article';
            const catMeta = categories[node.category];
            // No legend in the DOM means no palette to read; the graph still draws.
            const fill = isArticle && catMeta ? catMeta.color : conceptFill;
            const meta = isArticle ? metaById[node.articleId] : null;

            let nodeLabel = node.label;
            if (nodeLabel.length > 25) nodeLabel = nodeLabel.substring(0, 24) + "...";

            return {
                id: node.id,
                label: nodeLabel,
                title: meta ? `${node.label}\n(${node.category} | ${meta.date})` : node.label,
                x: Math.round(node.x),
                y: Math.round(node.y),
                value: node.degree + 1,
                color: {
                    background: fill,
                    border: fill,
                    // Dragging selects the node, which draws this border — it used to be
                    // the fixed hover-focus blue regardless of the node's own colour.
                    // Matching fill keeps the dot reading as itself while it moves.
                    highlight: { background: fill, border: fill },
                    hover: { background: fill, border: edgeFocus }
                },
                font: {
                    size: isArticle ? 11 : 9,
                    color: labelColor,
                    face: 'Inter, sans-serif'
                }
            };
        });

        // 2. Edges come straight from the build. Arrows only on article→concept links,
        // which are directed; the article↔article ones are similarity and are not. Each
        // edge takes its colour from the article it starts at (build_graph.py always
        // orders from/to so "from" is the article side, never the concept), so a cluster
        // reads as one hue instead of the flat grey mesh it was before.
        graphAdjacency = {};
        const edgesArray = data.edges.map((edge, idx) => {
            (graphAdjacency[edge.from] = graphAdjacency[edge.from] || new Set()).add(edge.to);
            (graphAdjacency[edge.to] = graphAdjacency[edge.to] || new Set()).add(edge.from);
            const sourceCategory = nodeById[edge.from] && nodeById[edge.from].category;
            const sourceMeta = categories[sourceCategory];
            return {
                id: 'e' + idx,
                from: edge.from,
                to: edge.to,
                arrows: edge.to.charAt(0) === 'c'
                    ? { to: { enabled: true, scaleFactor: 0.35 } }
                    : undefined,
                color: {
                    color: sourceMeta ? tint(sourceMeta.color, isDark ? 0.30 : 0.35) : edgeIdle,
                    // Dragging selects the node and, via selectConnectedEdges, its edges —
                    // drawn in this colour instead of the global default. Per edge rather
                    // than a single options.edges.color.highlight, which would paint every
                    // dragged node's edges the same fixed hue no matter whose they are.
                    highlight: sourceMeta ? tint(sourceMeta.color, isDark ? 0.85 : 0.9) : edgeIdle
                }
            };
        });

        // Pure Obsidian Vis.js Network Options
        const options = {
            layout: {
                // Positions arrive precomputed, so vis has nothing to lay out — and this
                // algorithm cannot handle the graph's disconnected components anyway: it
                // logs a warning and stalls before the first draw.
                improvedLayout: false
            },
            nodes: {
                shape: 'dot',
                borderWidth: 1.5,
                scaling: {
                    min: 3,
                    max: 20,
                    label: { enabled: true, min: 9, max: 17, drawThreshold: 6 }
                }
            },
            edges: {
                width: 1,
                // vis already redraws the hovered node's edges in this colour, which is
                // the whole focus effect — the per-edge dataset writes it used to take
                // were overwritten by this at draw time anyway. highlight (the drag/select
                // state) is deliberately not set here — each edge carries its own in the
                // dataset above, so a dragged node's edges match that node's colour
                // instead of every drag painting the same fixed hue.
                color: { hover: edgeFocus },
                hoverWidth: 1,
                selectionWidth: 1,
                // Straight lines: 1257 curved edges cost more to draw than they add, and
                // Obsidian draws its own straight.
                smooth: false
            },
            interaction: {
                // Drawing 699 edges and their arrowheads is what a repaint actually costs;
                // the nodes are cheap. vis skips both while a drag is in progress, which
                // is the one moment the graph repaints on every frame.
                hideEdgesOnDrag: true,
                hover: true,
                tooltipDelay: 150,
                zoomView: true,
                dragView: true
            },
            physics: {
                // Node coordinates are precomputed, so there is nothing to solve. This is
                // what removes the ~1.3s of main-thread blocking on open and the
                // background simulation that kept running afterwards.
                enabled: false
            }
        };

        // Rebuilding in place (clear + add + restart physics) skips the configured
        // stabilization pass, so nodes scatter outward and freeze mid-flight as a ring.
        // Recreating runs the same path as the first build and settles properly in ~1s.
        if (networkInstance) {
            clearTimeout(graphBlurTimer);
            if (graphEntranceRaf) cancelAnimationFrame(graphEntranceRaf);
            graphEntranceRaf = null;
            if (dragRedrawRaf !== null) cancelAnimationFrame(dragRedrawRaf);
            dragRedrawRaf = null;
            dragFollowers = null;
            // A glide still in flight would keep calling moveTo on the rebuilt network and
            // fight frameGraph for the camera.
            if (zoomRaf !== null) cancelAnimationFrame(zoomRaf);
            zoomRaf = null;
            zoomTarget = null;
            networkInstance.destroy();
            networkInstance = null;
        }
        graphDimmed.clear();

        {
            nodesDataset = new vis.DataSet(nodesArray);
            edgesDataset = new vis.DataSet(edgesArray);
            networkInstance = new vis.Network(container, { nodes: nodesDataset, edges: edgesDataset }, options);
            wireSmoothZoom(container);

            // Frame the view from the coordinates we generated rather than vis.fit(),
            // which repeatedly measured a stale canvas here and left the graph parked in a
            // corner. Hooked to the first paint: setting the camera before that gets
            // overwritten by vis's own initial view.
            networkInstance.once("afterDrawing", () => {
                frameGraph();
                animateNodesTo(entranceStart, positions);
                // A category may have been picked before the graph was ever opened, or
                // before a theme switch rebuilt it.
                restoreGraphFocus();
            });

            // Obsidian drags the neighbourhood along with the node under the cursor. That
            // came from its force solver; here the same feel is produced by moving only the
            // linked nodes by a fraction of the drag, which costs a few moveNode calls per
            // frame instead of re-simulating the whole graph.
            networkInstance.on("dragStart", function (params) {
                dragFollowers = null;
                // A settle from the previous release may still be running; grabbing a node
                // now must win, or the two write the same coordinates against each other.
                if (graphEntranceRaf) {
                    cancelAnimationFrame(graphEntranceRaf);
                    graphEntranceRaf = null;
                }
                if (dragRedrawRaf !== null) {
                    cancelAnimationFrame(dragRedrawRaf);
                    dragRedrawRaf = null;
                }
                if (!params.nodes || !params.nodes.length) return;
                const draggedId = params.nodes[0];
                const pos = networkInstance.getPositions();
                if (!pos[draggedId]) return;

                const direct = graphAdjacency[draggedId] || new Set();
                const indirect = new Set();
                direct.forEach(nid => {
                    (graphAdjacency[nid] || new Set()).forEach(n2 => {
                        if (n2 !== draggedId && !direct.has(n2)) indirect.add(n2);
                    });
                });

                const followers = [];
                direct.forEach(nid => {
                    if (pos[nid]) followers.push({ id: nid, start: { x: pos[nid].x, y: pos[nid].y }, pull: 0.38 });
                });
                indirect.forEach(nid => {
                    // Hubs can reach a hundred nodes two hops out; cap it so a drag stays cheap.
                    if (pos[nid] && followers.length < 60) {
                        followers.push({ id: nid, start: { x: pos[nid].x, y: pos[nid].y }, pull: 0.13 });
                    }
                });

                // Everything that is not being carried gets shouldered aside when the
                // moving clump runs into it. Their resting coordinates are captured now
                // so each frame can push from the original position rather than from the
                // last pushed one — pushing incrementally makes them drift away and never
                // come back.
                const movingIds = new Set(followers.map(f => f.id));
                movingIds.add(draggedId);
                const bystanders = [];
                Object.keys(pos).forEach(id => {
                    if (!movingIds.has(id)) bystanders.push({ id: id, home: pos[id] });
                });

                dragFollowers = {
                    id: draggedId,
                    start: { x: pos[draggedId].x, y: pos[draggedId].y },
                    followers: followers,
                    movers: [draggedId].concat(followers.map(f => f.id)),
                    bystanders: bystanders,
                    shoved: new Set() // ids actually moved, so only those animate back
                };
            });

            // How close a carried node gets before it starts pushing, and how much of
            // that overlap it actually converts into a shove. Full strength turns the
            // clump into a snowplough; this reads as things being nudged out of the way.
            const SHOVE_RADIUS = 55;
            const SHOVE_STRENGTH = 0.85;

            function shoveBystanders(bodies) {
                const state = dragFollowers;
                const radius2 = SHOVE_RADIUS * SHOVE_RADIUS;
                for (let i = 0; i < state.bystanders.length; i++) {
                    const other = state.bystanders[i];
                    const body = bodies[other.id];
                    if (!body) continue;
                    let pushX = 0;
                    let pushY = 0;
                    for (let m = 0; m < state.movers.length; m++) {
                        const mover = bodies[state.movers[m]];
                        if (!mover) continue;
                        const dx = other.home.x - mover.x;
                        const dy = other.home.y - mover.y;
                        const dist2 = dx * dx + dy * dy;
                        if (dist2 >= radius2 || dist2 === 0) continue;
                        const dist = Math.sqrt(dist2);
                        const overlap = (SHOVE_RADIUS - dist) / dist;
                        pushX += dx * overlap;
                        pushY += dy * overlap;
                    }
                    if (pushX !== 0 || pushY !== 0) {
                        body.x = other.home.x + pushX * SHOVE_STRENGTH;
                        body.y = other.home.y + pushY * SHOVE_STRENGTH;
                        state.shoved.add(other.id);
                    } else if (state.shoved.has(other.id)) {
                        // Out of range again — back home, no animation needed mid-drag.
                        body.x = other.home.x;
                        body.y = other.home.y;
                        state.shoved.delete(other.id);
                    }
                }
            }

            // Not gated on params.nodes: vis does not always report the dragged node on
            // this event, and dragStart already told us which one is being moved.
            networkInstance.on("dragging", function () {
                if (!dragFollowers) return;
                const cur = networkInstance.getPositions([dragFollowers.id])[dragFollowers.id];
                if (!cur) return;
                const dx = cur.x - dragFollowers.start.x;
                const dy = cur.y - dragFollowers.start.y;
                // Written straight onto the bodies, the same way the entrance and the
                // settle do it. moveNode() redraws on every call, so a pointer move was
                // repainting the whole graph up to 61 times.
                const bodies = networkInstance.body.nodes;
                dragFollowers.followers.forEach(f => {
                    const body = bodies[f.id];
                    if (!body) return;
                    body.x = f.start.x + dx * f.pull;
                    body.y = f.start.y + dy * f.pull;
                });
                shoveBystanders(bodies);
                // A mouse reporting faster than the display fires several of these between
                // frames, and each one repainted 357 nodes and 699 edges that nobody saw.
                // Coalescing to one repaint a frame keeps the last positions and drops the
                // rest — the writes above are cheap, the repaint is not.
                if (dragRedrawRaf === null) {
                    dragRedrawRaf = requestAnimationFrame(() => {
                        dragRedrawRaf = null;
                        if (networkInstance) networkInstance.redraw();
                    });
                }
            });

            // Obsidian's neighbours spring back once you let go — the node you moved stays
            // put, the ones that trailed it relax to where they were. The follower list and
            // its original coordinates are already sitting in dragFollowers from dragStart,
            // so this is the same handful of writes per frame the drag itself cost.
            networkInstance.on("dragEnd", function () {
                // The settle drives its own frames from here; a repaint still queued from
                // the last pointer move would draw a stale frame on top of its first one.
                if (dragRedrawRaf !== null) {
                    cancelAnimationFrame(dragRedrawRaf);
                    dragRedrawRaf = null;
                }
                if (!dragFollowers) return;
                const settling = dragFollowers.followers;
                // Whatever got shouldered aside relaxes back with the followers, so the
                // graph is exactly where it was apart from the node that was moved.
                const shovedHomes = dragFollowers.bystanders
                    .filter(b => dragFollowers.shoved.has(b.id));
                dragFollowers = null;
                if (!settling.length && !shovedHomes.length) return;

                const ids = settling.map(f => f.id).concat(shovedHomes.map(b => b.id));
                const from = networkInstance.getPositions(ids);
                const to = {};
                settling.forEach(f => { to[f.id] = f.start; });
                shovedHomes.forEach(b => { to[b.id] = b.home; });
                animateNodesTo(from, to, 320);
            });

            // Obsidian-style hover focus: highlight connected nodes, fade rest
            networkInstance.on("hoverNode", function (params) {
                clearTimeout(graphBlurTimer);
                const neighbors = graphAdjacency[params.node] || new Set();
                applyGraphDimming(id => id === params.node || neighbors.has(id));
            });

            // Restoring on every blur made a mouse sweep across the graph rewrite all 189
            // nodes twice per node passed. Waiting a beat lets the next hover diff against
            // the current state instead.
            networkInstance.on("blurNode", function () {
                clearTimeout(graphBlurTimer);
                graphBlurTimer = setTimeout(restoreGraphFocus, 120);
            });

            // Click node -> select article without reload overhead
            networkInstance.on("click", function (params) {
                if (params.nodes.length > 0) {
                    // Node ids are namespaced now: a<articleId> for articles, c:<term> for
                    // concepts. Only the former opens anything.
                    const nodeId = String(params.nodes[0]);
                    if (nodeId.charAt(0) === 'a') {
                        const articleId = parseInt(nodeId.slice(1), 10);
                        if (!isNaN(articleId)) {
                            focusedArticleId = articleId;
                            selectArticle(articleId, false, true);
                        }
                    }
                }
            });

            // Double-click node -> open the article. A single click already focuses it
            // in place (dimming, sidebar highlight) without leaving the graph; this is
            // the deliberate step past that, into the reader tab.
            networkInstance.on("doubleClick", function (params) {
                if (params.nodes.length > 0) {
                    const nodeId = String(params.nodes[0]);
                    if (nodeId.charAt(0) === 'a') {
                        const articleId = parseInt(nodeId.slice(1), 10);
                        if (!isNaN(articleId)) {
                            focusedArticleId = articleId;
                            selectArticle(articleId, true, true);
                        }
                    }
                }
            });
        }
    }

    // ==========================================================================
    // 🔔 REAL-TIME INCREMENTAL SYNC CHECK (LITE VERSION)
    // ==========================================================================
    async function checkBrunchSync() {
        if (window.location.port !== '5050') {
            return;
        }
        try {
            const author = 'drbrooks';
            const response = await fetch(`/api/check_new?author=${author}`);
            const result = await response.json();
            
            if (result.success && result.has_new) {
                notifyOnlineCount.textContent = result.online_count;
                notifyLocalCount.textContent = result.local_count;
                syncNotificationBanner.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error during Brunch sync check:", error);
        }
    }

    // Sync button logic: Open password validation modal immediately!
    btnBannerSync.addEventListener('click', () => {
        syncNotificationBanner.classList.add('hidden');
        
        // Open the modal
        fabSyncBtn.click();
    });

    btnBannerClose.addEventListener('click', () => {
        syncNotificationBanner.classList.add('hidden');
    });


    // ==========================================================================
    // 🌓 SYSTEM/DARK/LIGHT THEME CONTROLLER
    // ==========================================================================
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    function applyTheme(theme) {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemPrefersDark) {
                document.body.classList.add('theme-dark');
                document.documentElement.classList.add('theme-dark');
            } else {
                document.body.classList.remove('theme-dark');
                document.documentElement.classList.remove('theme-dark');
            }
            localStorage.setItem('drbrooks-theme', 'system');
        } else if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            document.documentElement.classList.add('theme-dark');
            localStorage.setItem('drbrooks-theme', 'dark');
        } else {
            document.body.classList.remove('theme-dark');
            document.documentElement.classList.remove('theme-dark');
            localStorage.setItem('drbrooks-theme', 'light');
        }
        
        // Refresh knowledge graph with new theme colors
        if (typeof networkInstance !== 'undefined' && networkInstance && typeof articles !== 'undefined' && articles.length > 0) {
            initKnowledgeGraph(articles);
        }
    }
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            applyTheme(theme);
        });
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const savedTheme = localStorage.getItem('drbrooks-theme') || 'light';
        if (savedTheme === 'system') {
            applyTheme('system');
        }
    });
    
    // ==========================================================================
    // 🧠 LEGEND INTERACTIVE FILTER CONTROL
    // ==========================================================================
    // The pill can be dragged out of the way — it sits over the top-right of the graph,
    // which is exactly where a node someone wants to read can end up. Position is not
    // kept across reloads; it goes back to the corner on the next visit.
    const legendEl = document.querySelector('.graph-legend');
    let legendDragged = false; // set when a drag ends, so it can swallow the click after it
    if (legendEl) {
        const graphArea = document.getElementById('graph-view-container');
        let grab = null;

        legendEl.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || !graphArea) return;
            const box = legendEl.getBoundingClientRect();
            const area = graphArea.getBoundingClientRect();
            grab = {
                x: e.clientX, y: e.clientY,
                left: box.left - area.left, top: box.top - area.top,
                width: box.width, height: box.height,
                moved: false
            };
        });

        // On document, not on the pill with setPointerCapture: capture retargets every
        // later event to the element holding it, so the click that follows a drag landed
        // on the pill instead of the category inside it and the filter never fired.
        document.addEventListener('pointermove', (e) => {
            if (!grab) return;
            const dx = e.clientX - grab.x;
            const dy = e.clientY - grab.y;
            // A click wobbles a pixel or two. Below this it stays a click on a category.
            if (!grab.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
            grab.moved = true;
            const area = graphArea.getBoundingClientRect();
            const maxLeft = Math.max(0, area.width - grab.width);
            const maxTop = Math.max(0, area.height - grab.height);
            legendEl.style.left = Math.min(Math.max(0, grab.left + dx), maxLeft) + 'px';
            legendEl.style.top = Math.min(Math.max(0, grab.top + dy), maxTop) + 'px';
            legendEl.style.right = 'auto';
        });

        const endLegendDrag = () => {
            if (!grab) return;
            if (grab.moved) {
                legendDragged = true;
                // The click that ends a drag is dispatched before this timer runs, so it
                // gets swallowed and nothing later does. Clearing on the next pointerdown
                // instead would leave the flag armed when a drag ends on the pill's
                // padding, where no click follows to consume it.
                setTimeout(() => { legendDragged = false; }, 0);
            }
            grab = null;
        };
        document.addEventListener('pointerup', endLegendDrag);
        document.addEventListener('pointercancel', endLegendDrag);
    }

    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // The click that closes a drag is not a category pick.
            if (legendDragged) return;
            const category = item.getAttribute('data-category');
            if (activeCategoryFilter === category) {
                activeCategoryFilter = null;
            } else {
                activeCategoryFilter = category;
                focusedArticleId = null; // Clear focused article
            }
            updateLegendUI();
            // Dimming, not a rebuild — the coordinates are precomputed and rebuilding
            // would throw the settled layout away to show the same nodes.
            restoreGraphFocus();
        });
    });

    function updateLegendUI() {
        const items = document.querySelectorAll('.legend-item');
        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (activeCategoryFilter === null) {
                item.classList.remove('active');
                item.classList.remove('inactive');
            } else if (category === activeCategoryFilter) {
                item.classList.add('active');
                item.classList.remove('inactive');
            } else {
                item.classList.remove('active');
                item.classList.add('inactive');
            }
        });
    }

    // Initial theme load
    const initialTheme = localStorage.getItem('drbrooks-theme') || 'light';
    applyTheme(initialTheme);


    // ==========================================================================
    // 📱 MOBILE SIDEBAR TOGGLE
    // ==========================================================================
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarElement = document.querySelector('.sidebar');
    
    if (mobileSidebarToggle && sidebarElement) {
        mobileSidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarElement.classList.toggle('mobile-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebarElement.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                    sidebarElement.classList.remove('mobile-open');
                }
            }
        });
    }

    // ==========================================================================
    // 🎬 INITIAL STARTUP
    // ==========================================================================
    loadArticles().then(() => {
        // Automatically open the most recent article on first load
        if (articles.length > 0 && !activeArticleId) {
            selectArticle(articles[0].id, false, false);
        }
        // Run light check silently in background only after articles are loaded
        checkBrunchSync();
    });
    checkScraperActiveState();
});
