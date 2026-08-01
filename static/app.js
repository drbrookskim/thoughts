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

        // Always re-initialize the graph to reflect any new article selection focus
        initKnowledgeGraph(articles);

        // The canvas is only sized correctly once the container is visible, so it still
        // needs a redraw here. Framing is not repeated: frameGraphToBounds already set the
        // camera, and vis.fit() at this point would measure a stale canvas and undo it.
        if (networkInstance) {
            setTimeout(() => {
                if (!networkInstance) return;
                networkInstance.redraw();
                frameGraph();
            }, 100);
        }
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
        const legendReserve = 110; // the legend pill floats over the bottom of the canvas
        const viewW = container.clientWidth || 800;
        const viewH = (container.clientHeight || 600) - legendReserve;
        const scale = Math.max(0.05, Math.min(Math.min(viewW / w, viewH / h), 2));
        networkInstance.moveTo({
            position: {
                x: (graphBounds.minX + graphBounds.maxX) / 2,
                // Canvas y grows downward, so moving the camera down lifts the graph clear
                // of the legend strip at the bottom.
                y: (graphBounds.minY + graphBounds.maxY) / 2 + (legendReserve / 2) / scale
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

    function initKnowledgeGraph(items) {
        if (!items || items.length === 0) return;

        const container = document.getElementById('graph-canvas');
        if (!container) return;

        // Monochrome palette, flipped for the light canvas. The dark values wash out
        // completely on the light theme — white edges become invisible.
        const isDark = document.body.classList.contains('theme-dark');

        // The graph is built purely from the article set and the theme. Rebuilding it on
        // every tab visit threw the settled positions away and re-ran the solver for ~10s
        // each time; reuse the existing layout whenever neither input changed.
        const signature = items.length + '|' + isDark;
        if (networkInstance && signature === graphSignature) {
            networkInstance.redraw();
            return;
        }
        graphSignature = signature;

        const nodeFill = isDark ? '#888888' : '#9ca3af';
        const nodeStroke = isDark ? '#aaaaaa' : '#6b7280';
        const nodeAccent = isDark ? '#ffffff' : '#111827';
        const labelColor = isDark ? '#cccccc' : '#4b5563';
        const edgeSpine = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(17, 24, 39, 0.22)';
        const edgeBranch = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(17, 24, 39, 0.14)';

        // Categories & Palette
        const categories = {
            "기획론": { color: "#a18cd1" },
            "상품기획": { color: "#fbd043" },
            "AI와 기술": { color: "#00f2fe" },
            "인간과 심리": { color: "#ff6b8b" },
            "사고와 언어": { color: "#ff9f43" },
            "관계와 사회": { color: "#4facfe" },
            "경제와 가치": { color: "#2ecc71" }
        };

        const nodesArray = [];
        const edgesArray = [];
        graphAdjacency = {};

        // Group articles by category
        const articlesByCategory = {};
        Object.keys(categories).forEach(cat => { articlesByCategory[cat] = []; });
        items.forEach(article => {
            const cat = article.category || "기획론";
            if (articlesByCategory[cat]) articlesByCategory[cat].push(article);
        });

        // Positions are computed here instead of by the physics solver. Running the solver
        // blocked the main thread for ~1.3s every time the graph opened, and needed a
        // freeze afterwards or it simulated forever. The layout only depends on the article
        // set, so it can be derived directly: categories sit on a ring, and each category's
        // articles spiral outward from its centre by the golden angle, which spreads them
        // evenly without any relaxation pass.
        const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
        const catNames = Object.keys(categories);
        const ringRadius = 620;
        const catCenters = {};
        catNames.forEach((cat, i) => {
            const angle = (2 * Math.PI * i) / catNames.length - Math.PI / 2;
            catCenters[cat] = { x: Math.cos(angle) * ringRadius, y: Math.sin(angle) * ringRadius };
        });

        const positions = {};
        Object.entries(articlesByCategory).forEach(([catId, catArticles]) => {
            const centre = catCenters[catId] || { x: 0, y: 0 };
            const spread = 34; // gap between neighbouring articles in a cluster
            [...catArticles].sort((a, b) => a.id - b.id).forEach((article, idx) => {
                const r = spread * Math.sqrt(idx + 0.5);
                const theta = idx * GOLDEN_ANGLE;
                positions[article.id] = {
                    x: centre.x + Math.cos(theta) * r,
                    y: centre.y + Math.sin(theta) * r
                };
            });
        });

        const pts = Object.values(positions);
        graphBounds = pts.length ? {
            minX: Math.min(...pts.map(p => p.x)),
            maxX: Math.max(...pts.map(p => p.x)),
            minY: Math.min(...pts.map(p => p.y)),
            maxY: Math.max(...pts.map(p => p.y))
        } : null;

        // 1. Build Nodes (Clean minimalist dots like Obsidian)
        items.forEach(article => {
            const catId = article.category || "기획론";
            const catMeta = categories[catId] || categories["기획론"];

            let nodeLabel = article.title;
            if (nodeLabel.length > 25) {
                nodeLabel = nodeLabel.substring(0, 24) + "...";
            }

            const pos = positions[article.id] || { x: 0, y: 0 };
            nodesArray.push({
                id: article.id,
                label: nodeLabel,
                title: `${article.title}\n(${catId} | ${article.date})`,
                x: Math.round(pos.x),
                y: Math.round(pos.y),
                color: {
                    background: nodeFill,
                    border: nodeStroke,
                    highlight: { background: nodeAccent, border: nodeAccent },
                    hover: { background: nodeAccent, border: nodeAccent }
                },
                size: 5,
                font: { size: 10, color: labelColor, face: 'Inter, sans-serif' }
            });
        });

        // 2. Build Intra-Category Edge Spine & Keyword Links
        Object.entries(articlesByCategory).forEach(([catId, catArticles]) => {
            catArticles.sort((a, b) => a.id - b.id);
            catArticles.forEach((article, idx) => {
                // Link sequential articles in category
                if (idx > 0) {
                    const prev = catArticles[idx - 1];
                    edgesArray.push({
                        from: article.id,
                        to: prev.id,
                        color: { color: edgeSpine, highlight: nodeAccent }
                    });
                    (graphAdjacency[article.id] = graphAdjacency[article.id] || new Set()).add(prev.id);
                    (graphAdjacency[prev.id] = graphAdjacency[prev.id] || new Set()).add(article.id);
                }
                // Branching link every 4th item
                if (idx > 3 && idx % 4 === 0) {
                    const sibling = catArticles[idx - 4];
                    edgesArray.push({
                        from: article.id,
                        to: sibling.id,
                        color: { color: edgeBranch, highlight: nodeAccent }
                    });
                    (graphAdjacency[article.id] = graphAdjacency[article.id] || new Set()).add(sibling.id);
                    (graphAdjacency[sibling.id] = graphAdjacency[sibling.id] || new Set()).add(article.id);
                }
            });
        });

        // Degree-based sizing (Obsidian hub sizing)
        nodesArray.forEach(node => {
            const degree = (graphAdjacency[node.id] ? graphAdjacency[node.id].size : 0);
            node.value = degree + 1;
        });

        // Pure Obsidian Vis.js Network Options
        const options = {
            layout: {
                // The 7 category clusters are disconnected from each other, which this
                // algorithm cannot position — vis.js logs a warning and stalls before the
                // first draw. Disabling it lets stabilization run and paint.
                improvedLayout: false
            },
            nodes: {
                shape: 'dot',
                borderWidth: 1.5,
                scaling: {
                    min: 4,
                    max: 18,
                    label: { enabled: true, min: 9, max: 18, drawThreshold: 8 }
                }
            },
            edges: {
                width: 1,
                smooth: { type: 'continuous' }
            },
            interaction: {
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
            networkInstance.destroy();
            networkInstance = null;
        }
        graphDimmed.clear();

        {
            nodesDataset = new vis.DataSet(nodesArray);
            edgesDataset = new vis.DataSet(edgesArray);
            networkInstance = new vis.Network(container, { nodes: nodesDataset, edges: edgesDataset }, options);

            // Frame the view from the coordinates we generated rather than vis.fit(),
            // which repeatedly measured a stale canvas here and left the graph parked in a
            // corner. Hooked to the first paint: setting the camera before that gets
            // overwritten by vis's own initial view.
            networkInstance.once("afterDrawing", () => frameGraph());

            // Obsidian drags the neighbourhood along with the node under the cursor. That
            // came from its force solver; here the same feel is produced by moving only the
            // linked nodes by a fraction of the drag, which costs a few moveNode calls per
            // frame instead of re-simulating the whole graph.
            networkInstance.on("dragStart", function (params) {
                dragFollowers = null;
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

                dragFollowers = { id: draggedId, start: { x: pos[draggedId].x, y: pos[draggedId].y }, followers };
            });

            // Not gated on params.nodes: vis does not always report the dragged node on
            // this event, and dragStart already told us which one is being moved.
            networkInstance.on("dragging", function () {
                if (!dragFollowers) return;
                const cur = networkInstance.getPositions([dragFollowers.id])[dragFollowers.id];
                if (!cur) return;
                const dx = cur.x - dragFollowers.start.x;
                const dy = cur.y - dragFollowers.start.y;
                dragFollowers.followers.forEach(f => {
                    networkInstance.moveNode(f.id, f.start.x + dx * f.pull, f.start.y + dy * f.pull);
                });
            });

            networkInstance.on("dragEnd", function () {
                dragFollowers = null;
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
                graphBlurTimer = setTimeout(() => applyGraphDimming(null), 120);
            });

            // Click node -> select article without reload overhead
            networkInstance.on("click", function (params) {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    if (typeof nodeId === 'number') {
                        focusedArticleId = nodeId;
                        selectArticle(nodeId, false, true);
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
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = item.getAttribute('data-category');
            if (activeCategoryFilter === category) {
                activeCategoryFilter = null;
            } else {
                activeCategoryFilter = category;
                focusedArticleId = null; // Clear focused article
            }
            updateLegendUI();
            initKnowledgeGraph(articles);
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
