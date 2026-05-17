// ==========================================================================
// 🚀 BRUNCH SCRAPER FRONTEND LOGIC (VANILLA JS)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let articles = [];
    let activeArticleId = null;
    let scrapeInterval = null;

    // DOM Elements
    const statCount = document.getElementById('stat-count');
    const statLatestDate = document.getElementById('stat-latest-date');
    
    const toggleScraperBtn = document.getElementById('toggle-scraper-btn');
    const scraperFormContainer = document.getElementById('scraper-form-container');
    const btnStartScrape = document.getElementById('btn-start-scrape');
    
    const inputAuthor = document.getElementById('input-author');
    const inputStartDate = document.getElementById('input-start-date');
    const inputEndDate = document.getElementById('input-end-date');
    const inputStartId = document.getElementById('input-start-id');
    
    const monitorPanel = document.getElementById('monitor-panel');
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
    const graphViewContainer = document.getElementById('graph-view-container');
    let networkInstance = null; // vis.js network instance
    let focusedArticleId = null; // Currently centered article in knowledge graph

    // Initialize end date to today's date
    const today = new Date().toISOString().split('T')[0];
    inputEndDate.value = today;

    // ==========================================================================
    // 📂 ARTICLE MANAGEMENT & FETCHING
    // ==========================================================================

    // Fetch and render the list of available articles
    async function loadArticles() {
        try {
            const response = await fetch('api/articles.json');
            articles = await response.json();
            
            renderArticlesList(articles);
            updateStats();
            initKnowledgeGraph(articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
            articlesList.innerHTML = `
                <div class="list-placeholder">
                    <i class="fa-solid fa-triangle-exclamation" style="color: var(--color-error)"></i>
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
    async function selectArticle(id, shouldSwitchTab = true) {
        // Automatically switch to reader tab if requested
        if (shouldSwitchTab && tabGraphBtn.classList.contains('active')) {
            tabReaderBtn.classList.add('active');
            tabGraphBtn.classList.remove('active');
            graphViewContainer.classList.add('hidden');
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
        focusedArticleId = id; // Sync centered article in knowledge graph
        
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
        viewUrlBtn.classList.add('hidden');
        viewContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: var(--text-secondary); gap: 16px;">
                <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--color-primary)"></i>
                <p>글을 불러오고 있습니다.</p>
            </div>
        `;

        try {
            const response = await fetch(`api/article/${id}.json`);
            const data = await response.json();

            if (data.error) {
                viewContent.innerHTML = `<p style="color: var(--color-error)">[오류] ${data.error}</p>`;
                return;
            }

            // Find selected article details for header meta
            const articleMeta = articles.find(a => a.id === id);

            // Render details
            viewTitle.textContent = articleMeta ? articleMeta.title : "제목 없음";
            viewDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${articleMeta ? articleMeta.date : 'N/A'}`;
            viewFileInfo.innerHTML = `<i class="fa-regular fa-file-code"></i> ${data.filename} (${articleMeta ? articleMeta.size_kb : 0} KB)`;
            
            if (articleMeta && articleMeta.url) {
                viewUrlBtn.href = articleMeta.url;
                viewUrlBtn.classList.remove('hidden');
            } else {
                viewUrlBtn.classList.add('hidden');
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
    // ⚙️ SCRAPER CONTROL PANEL (ACCORDION & POST TRIGGER)
    // ==========================================================================

    // Toggle scraping options accordion
    toggleScraperBtn.addEventListener('click', () => {
        toggleScraperBtn.classList.toggle('active');
        scraperFormContainer.classList.toggle('hidden');
    });

    // Start background scraper
    btnStartScrape.addEventListener('click', async () => {
        const author = inputAuthor.value.trim();
        const startDate = inputStartDate.value;
        const endDate = inputEndDate.value;
        const startId = parseInt(inputStartId.value);

        if (!author) {
            alert('브런치 작가 ID를 입력해주세요.');
            return;
        }

        // Show monitoring terminal console and hide forms
        scraperFormContainer.classList.add('hidden');
        toggleScraperBtn.classList.remove('active');
        monitorPanel.classList.remove('hidden');
        
        consoleLogs.textContent = "[*] 크롤링 작업을 준비하는 중...\n";
        scraperStatusBadge.textContent = "준비 중";
        scraperStatusBadge.className = "status-badge running";
        
        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: author,
                    start_date: startDate,
                    end_date: endDate,
                    start_id: startId
                })
            });

            const result = await response.json();

            if (result.error) {
                consoleLogs.textContent += `[오류] 시작에 실패했습니다: ${result.error}\n`;
                scraperStatusBadge.textContent = "에러";
                scraperStatusBadge.className = "status-badge";
                return;
            }

            // Start polling the scraper status
            startLogsPolling();

        } catch (error) {
            consoleLogs.textContent += `[오류] 서버 요청 실패: ${error.message}\n`;
            scraperStatusBadge.textContent = "연결 오류";
            scraperStatusBadge.className = "status-badge";
        }
    });

    // Polling interval loop for real-time console status
    function startLogsPolling() {
        if (scrapeInterval) clearInterval(scrapeInterval);
        
        scrapeInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/scrape/status');
                const status = await response.json();

                // Update badge and progress count
                monitorProgressCount.textContent = status.saved_count;
                
                if (status.is_running) {
                    scraperStatusBadge.textContent = `글 ID ${status.current_id} 분석 중`;
                    scraperStatusBadge.className = "status-badge running";
                } else if (status.finished) {
                    scraperStatusBadge.textContent = "수집 완료";
                    scraperStatusBadge.className = "status-badge";
                    clearInterval(scrapeInterval);
                    scrapeInterval = null;
                    
                    // Reload the articles sidebar immediately to show new arrivals!
                    loadArticles();
                } else if (status.error) {
                    scraperStatusBadge.textContent = "오류 발생";
                    scraperStatusBadge.className = "status-badge";
                    clearInterval(scrapeInterval);
                    scrapeInterval = null;
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
        }, 1000);
    }

    // Check on page load if scraper is already running from a previous instance
    async function checkScraperActiveState() {
        try {
            const response = await fetch('/api/scrape/status');
            const status = await response.json();
            
            if (status.is_running) {
                monitorPanel.classList.remove('hidden');
                startLogsPolling();
            }
        } catch (error) {
            console.error("Error checking scraper running status:", error);
        }
    }


    // ==========================================================================
    // 🔗 TAB TOGGLING CONTROL
    // ==========================================================================
    tabGraphBtn.addEventListener('click', () => {
        tabGraphBtn.classList.add('active');
        tabReaderBtn.classList.remove('active');
        graphViewContainer.classList.remove('hidden');
        welcomeView.classList.add('hidden');
        articleView.classList.add('hidden');

        // Always re-initialize the graph to reflect any new article selection focus
        initKnowledgeGraph(articles);

        // Trigger Vis.js dynamic canvas redraw to fix any hidden sizing bugs
        if (networkInstance) {
            setTimeout(() => {
                networkInstance.redraw();
                networkInstance.fit();
            }, 100);
        }
    });

    tabReaderBtn.addEventListener('click', () => {
        tabReaderBtn.classList.add('active');
        tabGraphBtn.classList.remove('active');
        graphViewContainer.classList.add('hidden');
        
        if (activeArticleId) {
            articleView.classList.remove('hidden');
            welcomeView.classList.add('hidden');
        } else {
            welcomeView.classList.remove('hidden');
            articleView.classList.add('hidden');
        }
    });

    // ==========================================================================
    // 🧠 OBSIDIAN KNOWLEDGE GRAPH VIEW ENGINE
    // ==========================================================================
    function initKnowledgeGraph(items) {
        const container = document.getElementById('graph-canvas');
        if (!container) return;
        
        if (networkInstance) {
            networkInstance.destroy();
        }
        
        const isLight = document.documentElement.classList.contains('theme-light');
        const catFontColor = isLight ? '#0f172a' : '#f0f3f8';
        const catBg = isLight ? '#ffffff' : '#131725';
        const catBgHighlight = isLight ? '#f1f5f9' : '#171c2f';
        const artFontColor = isLight ? '#334155' : '#cbd5e1';
        const artBg = isLight ? '#cbd5e1' : '#475569';
        const artBgHover = isLight ? '#94a3b8' : '#8a99ad';
        const edgeBase = isLight ? '#475569' : '#334155';

        // 1. Central Category Nodes Definition
        const categories = {
            "cat_philosophy": { label: "🧠 Philosophy", color: "#ff6b8b", lineColor: "#803545", shadow: "rgba(255, 107, 139, 0.2)" },
            "cat_tech": { label: "💻 AI & Tech", color: "#00f2fe", lineColor: "#00797f", shadow: "rgba(0, 242, 254, 0.2)" },
            "cat_business": { label: "💼 Planning", color: "#fbd043", lineColor: "#7d6821", shadow: "rgba(251, 208, 67, 0.2)" },
            "cat_leadership": { label: "👥 Leadership", color: "#a18cd1", lineColor: "#504668", shadow: "rgba(161, 140, 209, 0.2)" },
            "cat_society": { label: "🌍 Society", color: "#4facfe", lineColor: "#27567f", shadow: "rgba(79, 172, 254, 0.2)" }
        };

        const nodesArray = [];
        const edgesArray = [];

        // Category Classification Algorithm
        function getCategory(title) {
            const lower = title.toLowerCase();
            if (lower.includes("상품기획") || lower.includes("기획") || lower.includes("아이디어") || lower.includes("가치") || lower.includes("비즈니스") || lower.includes("경쟁") || lower.includes("쇼핑카트")) {
                return "cat_business";
            } else if (lower.includes("ai") || lower.includes("웹") || lower.includes("스마트폰") || lower.includes("기술") || lower.includes("프로그래머") || lower.includes("페이지랭크") || lower.includes("토큰") || lower.includes("인공지능")) {
                return "cat_tech";
            } else if (lower.includes("철학") || lower.includes("순수이성") || lower.includes("게티어") || lower.includes("인식") || lower.includes("사고") || lower.includes("본질") || lower.includes("감정") || lower.includes("외로움") || lower.includes("상상력") || lower.includes("자아")) {
                return "cat_philosophy";
            } else if (lower.includes("리더") || lower.includes("소통") || lower.includes("무례") || lower.includes("권위") || lower.includes("말실수") || lower.includes("조언") || lower.includes("태도") || lower.includes("리더십")) {
                return "cat_leadership";
            } else {
                return "cat_society";
            }
        }

        // Resolve focused article details if set
        let focusedArticle = null;
        if (focusedArticleId !== null) {
            focusedArticle = items.find(a => a.id === focusedArticleId);
            if (!focusedArticle) focusedArticleId = null; // Reset if invalid
        }
        const focusedCatId = focusedArticle ? getCategory(focusedArticle.title) : null;
        const focusedCatMeta = focusedCatId ? categories[focusedCatId] : null;

        // Add Category Nodes
        Object.entries(categories).forEach(([id, meta]) => {
            const isFocusedCat = (focusedCatId === id);
            nodesArray.push({
                id: id,
                label: meta.label,
                color: {
                    background: catBg,
                    border: meta.color,
                    highlight: {
                        background: catBgHighlight,
                        border: meta.color
                    }
                },
                // Emphasize the focused category hub, shrink others slightly for focus clarity
                size: focusedArticleId !== null ? (isFocusedCat ? 15 : 9) : 12,
                font: { 
                    size: focusedArticleId !== null ? (isFocusedCat ? 15 : 12) : 16, 
                    bold: true, 
                    color: catFontColor 
                },
                shadow: { enabled: true, color: meta.shadow, size: 15 }
            });
        });

        // Add Article Nodes
        items.forEach(article => {
            const catId = getCategory(article.title);
            const catMeta = categories[catId];
            const isFocused = (article.id === focusedArticleId);
            const isSameCat = (catId === focusedCatId);

            if (isFocused) {
                // Massive Centered Hero Node (Main Center Node)
                nodesArray.push({
                    id: article.id,
                    label: article.title, // Full title without truncation for absolute focus
                    title: `[현재 메인 글]\n${article.title}\n(작성일: ${article.date})`,
                    color: {
                        background: catMeta.color, // Neon glow core matching the category
                        border: isLight ? '#0f172a' : '#ffffff',
                        highlight: {
                            background: catMeta.color,
                            border: isLight ? '#0f172a' : '#ffffff'
                        },
                        hover: {
                            background: catMeta.color,
                            border: isLight ? '#0f172a' : '#ffffff'
                        }
                    },
                    size: 20, // Large physical sphere
                    mass: 3.5, // High mass pulls other nodes visually and structurally
                    font: { size: 15, bold: true, color: catFontColor, face: 'Outfit' },
                    shadow: { enabled: true, color: catMeta.shadow, size: 25 }
                });
            } else {
                // Regular Article Nodes
                let nodeLabel = article.title;
                if (nodeLabel.length > 12) {
                    nodeLabel = nodeLabel.substring(0, 11) + "...";
                }

                let nodeSize = 5.5;
                let nodeFontSize = 12;
                let nodeFontColor = artFontColor;

                // Focus styling optimization
                if (focusedArticleId !== null) {
                    if (isSameCat) {
                        nodeSize = 7.0; // Sibling articles clustered beautifully
                        nodeFontSize = 13;
                        nodeFontColor = catMeta.color; // Highlight color
                    } else {
                        nodeSize = 4.0; // Shrink unrelated articles
                        nodeFontSize = 10;
                        nodeFontColor = isLight ? '#94a3b8' : '#475569'; // Fade unrelated
                    }
                }

                nodesArray.push({
                    id: article.id,
                    label: nodeLabel,
                    title: `${article.title}\n(작성일: ${article.date})`,
                    color: {
                        background: artBg,
                        border: '#64748b',
                        highlight: {
                            background: artBgHover,
                            border: catMeta.color
                        },
                        hover: {
                            background: artBgHover,
                            border: catMeta.color
                        }
                    },
                    size: nodeSize,
                    font: { size: nodeFontSize, color: nodeFontColor, face: 'Outfit' }
                });
            }

            // Connection Edges Definition
            if (focusedArticleId !== null) {
                if (isFocused) {
                    // Central hero connects directly to ALL 5 Category hubs (satellites)
                    Object.keys(categories).forEach(cId => {
                        const cMeta = categories[cId];
                        edgesArray.push({
                            from: article.id,
                            to: cId,
                            length: 160, // Keep hubs nicely spaced
                            width: 1.5,
                            color: {
                                color: isLight ? '#cbd5e1' : '#222c3e',
                                highlight: cMeta.color,
                                hover: cMeta.color
                            }
                        });
                    });
                } else if (isSameCat) {
                    // peer category articles orbit and connect directly to the center focused article!
                    edgesArray.push({
                        from: article.id,
                        to: focusedArticleId,
                        length: 85, // Cluster related reads tightly
                        width: 1.25,
                        color: {
                            color: catMeta.lineColor,
                            highlight: catMeta.color,
                            hover: catMeta.color
                        }
                    });
                } else {
                    // Unrelated category articles connect back to their normal category hubs
                    edgesArray.push({
                        from: article.id,
                        to: catId,
                        color: {
                            color: edgeBase,
                            highlight: catMeta.lineColor,
                            hover: catMeta.lineColor
                        }
                    });
                }
            } else {
                // Normal category hub mode
                edgesArray.push({
                    from: article.id,
                    to: catId,
                    color: {
                        color: edgeBase,
                        highlight: catMeta.lineColor,
                        hover: catMeta.lineColor
                    }
                });
            }
        });

        // Vis.js Data structure binding
        const data = {
            nodes: new vis.DataSet(nodesArray),
            edges: new vis.DataSet(edgesArray)
        };

        // Obsidian style Force-Directed Network physics configuration
        const options = {
            nodes: {
                shape: 'dot',
                font: {
                    face: 'Outfit'
                },
                borderWidth: 1.5,
                borderWidthSelected: 2.5
            },
            edges: {
                width: 1,
                hoverWidth: 1.5
            },
            interaction: {
                hover: true,
                tooltipDelay: 150,
                zoomView: true,
                dragView: true,
                zoomSpeed: 0.2 // Slow down mouse scroll zoom speed by 80% for smooth camera drifts
            },
            physics: {
                stabilization: {
                    enabled: true,
                    iterations: 1000, // Pre-stabilize fully so it is completely calm on load
                    updateInterval: 50
                },
                barnesHut: {
                    gravitationalConstant: -3000, // Push nodes comfortably apart for extreme readability
                    centralGravity: 0.05, // Loosen central pulling so the galaxy spreads nicely
                    springLength: 140, // Lengthen connections for a breathable layout
                    springConstant: 0.008, // Significantly soften pulling spring to stop any shaking/jitter
                    damping: 0.85, // Heavy damping fluid friction to gently absorb kinetic energy
                    avoidOverlap: 1.0 // Complete overlap prevention guarantee
                }
            }
        };

        // Instantiate
        networkInstance = new vis.Network(container, data, options);

        // Click interaction: Clicking an article opens it in the reader AND sets it as focused center!
        networkInstance.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                // If it's a number (meaning it's an article ID), trigger focus and jump to reader!
                if (typeof nodeId === 'number') {
                    focusedArticleId = nodeId;
                    selectArticle(nodeId, true); // Instantly switch to Reader View
                    initKnowledgeGraph(articles);
                } else if (typeof nodeId === 'string' && nodeId.startsWith('cat_')) {
                    // Clicking a category node resets focus to normal
                    focusedArticleId = null;
                    initKnowledgeGraph(articles);
                }
            } else {
                // Clicking blank spaces resets focus to normal
                focusedArticleId = null;
                initKnowledgeGraph(articles);
            }
        });
    }

    // ==========================================================================
    // 🔔 REAL-TIME INCREMENTAL SYNC CHECK (LITE VERSION)
    // ==========================================================================
    async function checkBrunchSync() {
        try {
            const author = inputAuthor.value.trim() || 'drbrooks';
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

    // Sync button logic: Auto-calculate highest ID + 1 and trigger seamless scrape!
    btnBannerSync.addEventListener('click', () => {
        syncNotificationBanner.classList.add('hidden');
        
        // Open control panel accordion
        toggleScraperBtn.classList.add('active');
        scraperFormContainer.classList.remove('hidden');
        
        // Smart ID calculation: auto-fill start ID to (highest local ID + 1)
        if (articles.length > 0) {
            const highestId = articles[0].id; // Sorted newest first
            inputStartId.value = highestId + 1;
        } else {
            inputStartId.value = 164;
        }
        
        // Scroll accordion neatly into view
        toggleScraperBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Quick visual delay so user enjoys the panel slide open, then trigger scrape!
        setTimeout(() => {
            btnStartScrape.click();
        }, 600);
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
                document.body.classList.remove('theme-light');
                document.documentElement.classList.remove('theme-light');
            } else {
                document.body.classList.add('theme-light');
                document.documentElement.classList.add('theme-light');
            }
            localStorage.setItem('drbrooks-theme', 'system');
        } else if (theme === 'light') {
            document.body.classList.add('theme-light');
            document.documentElement.classList.add('theme-light');
            localStorage.setItem('drbrooks-theme', 'light');
        } else {
            document.body.classList.remove('theme-light');
            document.documentElement.classList.remove('theme-light');
            localStorage.setItem('drbrooks-theme', 'dark');
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
        const savedTheme = localStorage.getItem('drbrooks-theme') || 'dark';
        if (savedTheme === 'system') {
            applyTheme('system');
        }
    });
    
    // Initial theme load
    const initialTheme = localStorage.getItem('drbrooks-theme') || 'dark';
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
            selectArticle(articles[0].id);
        }
        // Run light check silently in background only after articles are loaded
        checkBrunchSync();
    });
    checkScraperActiveState();
});
