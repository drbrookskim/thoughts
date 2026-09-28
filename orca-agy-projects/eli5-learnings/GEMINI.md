## 하네스: AI 학습 가이드 제작 하네스

**목표:** ML 기초부터 DL, Transformer, 최신 2026 프론티어 모델(Claude Fable 5, GPT-5.6 Sol)까지 다루는 종합 AI 학습 가이드 구축 및 지속 갱신

**기본 저장 경로 및 자동 퍼블리싱:** `/Users/nelcome/Codes/Antigravity_code_repository/orca-agy-projects/eli5-learnings` (모든 산출물 및 ELI5 아티팩트는 해당 폴더에 저장하고, 생성 즉시 `publish_to_moneyreport.py`를 통해 `https://drbrooks-moneyreport.pages.dev/`에 자동 퍼블리싱 및 GitHub `origin main` 동기화할 것. memory.md에도 실시간 기록 유지)

**트리거:** AI 학습 가이드 제작, 수정, 업데이트 요청 시 `learning-guide-orchestrator` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-08-08 | 초기 하네스 구성 및 4인 에이전트/스킬 등록 | 전체 | AI 학습 가이드 제작 하네스 최초 생성 |
| 2026-08-30 | 단일 뉴런 ELI5 아티팩트 제작 및 기본 저장소 경로 고정 | 전체 | 산출물 저장 경로 일원화 및 memory.md 기록 지침 반영 |
| 2026-08-31 | 이중차분법(DiD) 심층 ELI5 아티팩트 제작 및 기록 | 전체 | 인과추론 및 준실험 방법론 인터랙티브 가이드 추가 |
| 2026-09-06 | 시맨틱 지식 체계(Semantics, Taxonomy, Ontology, KG) 아티팩트 & 프레젠테이션 슬라이드 덱 제작 | 전체 | 지식 표현 스펙트럼, GraphRAG 인터랙티브 가이드 및 12장 슬라이드 덱 추가 |
| 2026-09-18 | Full-Stack AI & LLM Systems 인터랙티브 ELI5 아티팩트 제작 | 전체 | ML기초, LLM, 그라운딩, 에이전트, 평가, LLMOps 전 과정 통합 가이드 추가 |
| 2026-09-20 | 기계공학 & AI 융합(학문·실용·대졸 캡스톤 아이디어 5선) ELI5 아티팩트 제작 | 전체 | 4대역학 PINN, 스마트제조/PHM, 자율로봇 Sim2Real, 캡스톤 진단기 추가 |
| 2026-09-20 | eli5 스킬 디자인 표준 개정 (라이트 테마 통일 및 좌측 목차 index 제거) | 전체 | 가독성 극대화 및 중앙 집중형 에디토리얼 레이아웃 표준화 |
| 2026-09-20 | 기계공학 & AI 융합 대학교 2학년 실전 가이드 & 5대 프로젝트 아티팩트 제작 | 전체 | 라이트 테마 표준 적용, 공업수학/기초역학 연계 1자유도 진동 캔버스 시뮬레이터 및 2학년 맞춤 프로젝트 추가 |
| 2026-09-20 | TypeSafe AI Jev & System One 모델 (Choice, Noul, Score) ELI5 아티팩트 제작 | 전체 | 비자기회귀 병렬 샘플링, RLCD 확률 교정, 3대 결정 원형 인터랙티브 시뮬레이터 가이드 추가 |
| 2026-09-21 | eli5 스킬 Apple Design 표준 통합 (유체 역학 모션, 반투명 유리, 옵티컬 타이포그래피) | 전체 | Apple의 유체 인터페이스(WWDC) 및 반투명 머티리얼, 스프링 모션 표준 전면 도입 |
| 2026-09-21 | eli5 스킬 본문 작성에 /im-not-ai(humanize-korean) 표준 통합 | 전체 | AI 번역투·상투어·Hype 배제, 문장 리듬감 및 자연스러운 한국어 기술 문체 표준화 |
| 2026-09-21 | eli5 스킬 타일 상단·좌측 컬러 스트라이프 호버 재드로잉 UX 애니메이션 표준 기본적용 | 전체 | 타일 호버 시 좌→우(상단), 하→상(좌측) 자연스럽고 연한 드로잉 UX 애니메이션 전면 도입 |
| 2026-09-21 | eli5 스킬 Steep 디자인 시스템 (DESIGN-steep.md) 기본 UX 테마 전면 적용 | 전체 | "Soft dawn on a marble dashboard", Signifier/Sohne 에디토리얼 타이포, 24px 세라믹 타일, 3단 시그니처 섀도우, Ink/Rust/Apricot Wash 팔레트 표준 도입 |
| 2026-09-21 | eli5 스킬 Starbucks 디자인 시스템 (DESIGN-starbucks.md) 기본 UX 테마 전면 적용 | 전체 | "Warm retail flagship", 4계층 그린, 웜 크림/세라믹 캔버스, 50px 풀필 버튼, 12px 위스퍼 섀도우 카드, 플로팅 Frap 버튼 표준 도입 |
| 2026-09-21 | eli5 스킬 Apple Design 시스템 (apple-design-SKILL.md) 기본 UX 테마 복원 및 재적용 | 전체 | Apple 유체 인터페이스(Fluid Interfaces), 반투명 프로스티드 글래스, SF Pro 타이포, 임계감쇠 스프링 및 스트라이프 호버 재드로잉 통합 표준 복원 |
| 2026-09-23 | 클래식 음악의 황금기(1680~1830) 심층 분석 ELI5 아티팩트 제작 | 전체 | 음향물리학, 기능화성학, 평균율 조율, 부르주아 공공영역 전환 및 Web Audio 실시간 화성합성 오디토리움 인터랙티브 가이드 추가 |
| 2026-09-23 | eli5 스킬 Apple Design System 공식 iPhone Duo(apple.com/kr/iphone-duo/) 규격 전면 반영 | 전체 | 10단 섹션 레이아웃, 정밀 타이포그래피 스케일(80px/48px/28px/21px/17px/14px/12px), 정밀 컬러 토큰 및 버튼 역학 표준화 |
| 2026-09-23 | eli5 스킬 한국어 단어 간·의미 간 줄바꿈 단절 방지 표준 반영 | 전체 | word-break: keep-all, text-wrap: balance/pretty 및 semantic &nbsp; 어절 보존 표준화 |
| 2026-09-23 | eli5 스킬 항목 타이틀 폰트 크기 축소 및 볼드(weight: 700) 강화 표준 반영 | 전체 | 섹션 헤더(38px), 카드 타이틀(20px), 아이브로우(15px) 볼드화로 시각적 위계 명료화 |
| 2026-09-24 | Money & Knowledge Report(drbrooks-moneyreport.pages.dev) 자동 퍼블리싱 파이프라인 구축 및 eli5 스킬 연동 | 전체 | eli5-learnings 내 생성 아티팩트 자동 배포 및 data/reports.json/GitHub main 동기화 파이프라인 확립 |
| 2026-09-24 | 인간 뇌의 신경가소성(Neuroplasticity) 심층 ELI5 아티팩트 제작 및 자동 퍼블리싱 | 전체 | LTP/LTD, STDP, BDNF 가시 신생, 피질 지도 재편 및 실시간 시뮬레이터 배포 완료 |
| 2026-09-28 | 지식 증류(Knowledge Distillation) 심층 ELI5 아티팩트 제작 및 자동 퍼블리싱 | 전체 | 반응·특징·관계 3대 패러다임, Softmax 온도 및 Dark Knowledge 수학적 증명, PyTorch 표준 손실 구현 및 실시간 시뮬레이터 배포 완료 |
| 2026-09-28 | eli5 스킬 타일 UI 좌/상단 컬러 스트라이프 효과 삭제 및 순수 Apple Minimal Surfaces 표준화 | 전체 | 타일/카드 UI 상단·좌측 컬러 바 장식 및 호버 드로잉 애니메이션을 완전 제거하고 순수 애플 미니멀 라운디드 서피스·헤어라인 보더로 일원화 |
| 2026-09-29 | eli5 스킬 Apple iPad Air 쇼케이스 웹/버튼/스크롤 모션 아키텍처 전면 통합 | 전체 | https://www.apple.com/kr/ipad-air/ 정밀 분석 기반 유체 텍스트 그라디언트, 세그먼트 토글러, 스크롤 리빌/블러 페이드, 스티키 락업 표준화 |
| 2026-09-29 | Apple Pencil Pro 활용법 살펴보기 버튼 애니메이션(AAP) 컴포넌트 구축 및 스킬 반영 | 전체 | 공식 iPad Air 쇼케이스 .aap-base 캡슐 버튼, 90도 회전 스핀 플러스 아이콘, 반투명 글래스 모달 팝업 연동 및 지식 증류 아티팩트 자동 배포 완료 |









