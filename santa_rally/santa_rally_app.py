import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta

# Configuration
st.set_page_config(
    page_title="일년내내 산타랠리",
    page_icon="🎅",
    layout="wide",
    initial_sidebar_state="collapsed" # Google Finance usually doesn't have a giant open sidebar
)

STOCKS = {
    "한미반도체": "042700.KS",
    "제주반도체": "080220.KS",
    "LS머트리얼즈": "417200.KQ",
    "엘엔에프": "066970.KS",
    "한국콜마": "161890.KS",
    "진에어": "272450.KS",
    "가온칩스": "399720.KQ",
    "두산테스나": "131970.KQ",
    "나노신소재": "121600.KQ",
    "더블유씨피": "393890.KQ",
    "퀄리타스반도체": "432720.KQ",
    "칩스앤미디어": "094360.KQ",
    "오픈엣지테크놀로지": "394280.KQ",
    "제이오": "418550.KQ",
    "픽셀플러스": "087600.KQ",
    "KH바텍": "060720.KQ",
    "씨이랩": "189330.KQ",
    "모두투어": "080160.KQ",
    "서린바이오": "038070.KQ",
    "HPSP": "403870.KQ",
    "오로스테크놀로지": "322310.KQ",
    "루닛": "328130.KQ",
    "뷰노": "338220.KQ",
    "제이엘케이": "322510.KQ",
    "딥노이드": "315640.KQ",
    "코어라인소프트": "384470.KQ"
}

MARKET_INDICES = {
    "KOSPI": "^KS11",
    "KOSDAQ": "^KQ11",
    "USD/KRW": "KRW=X"
}

# --- Functions ---

@st.cache_data(ttl=600)
def fetch_index_data(ticker):
    """Fetches key market indices."""
    try:
        df = yf.download(ticker, period="5d", progress=False, auto_adjust=False)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        return df
    except:
        return None

@st.cache_data(ttl=300)
def batch_fetch_latest():
    """Fetches summary data for all stocks efficiently."""
    # Note: Retrieving last 1 month to ensure enough data for sparklines (need ~7-10 points)
    # yfinance threading works well for batch downloading usually, but let's loop for safety with caching
    # Or better: use yf.download with list.
    
    tickers_list = list(STOCKS.values())
    # Download 1mo data
    data = yf.download(tickers_list, period="1mo", group_by='ticker', progress=False, auto_adjust=False)
    
    summary_data = []
    
    for name, ticker in STOCKS.items():
        try:
            # If multiple tickers, 'data' is a dataframe with MultiIndex (Ticker, OHLC)
            # If single ticker, it's just OHLC. 
            # With >1 tickers, it is MultiIndex columns: level 0 = Ticker, level 1 = OHLC
            
            if len(tickers_list) > 1:
                df = data[ticker].copy()
            else:
                df = data.copy()
            
            if df.empty:
                continue

            # Drop NaNs
            df = df.dropna()

            if len(df) == 0:
                continue

            latest = df.iloc[-1]
            if len(df) > 1:
                prev = df.iloc[-2]
                change = latest['Close'] - prev['Close']
                pct_change = (change / prev['Close']) * 100
            else:
                change = 0
                pct_change = 0
            
            # Sparkline: Last 10 closes
            sparkline_data = df['Close'].tail(15).tolist()
            
            summary_data.append({
                "Name": name,
                "Ticker": ticker,
                "Price": latest['Close'],
                "Change": change,
                "Change %": pct_change / 100, # Streamlit format expects decimal for percentage
                "Trend": sparkline_data
            })
        except Exception as e:
            # st.error(f"Error processing {name}: {e}")
            continue
            
    return pd.DataFrame(summary_data)

@st.cache_data(ttl=300)
def fetch_detailed_data(ticker):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    df = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    return df

def analyze_sentiment(df):
    """Simple heuristic for sentiment."""
    if len(df) < 20: return "Neutral", "blue"
    ma20 = df['Close'].rolling(window=20).mean().iloc[-1]
    close = df['Close'].iloc[-1]
    
    if close > ma20: return "Bullish 📈", "green"
    return "Bearish 📉", "red"

# --- Main Layout ---

# Start with CSS styling
st.markdown("""
<style>
    .stApp { background-color: #202124; color: #e8eaed; }
    .metric-container {
        border-radius: 8px;
        border: 1px solid #5f6368;
        padding: 10px;
        background-color: #303134;
        text-align: center;
    }
    .big-stat { font-size: 1.5em; font-weight: bold; }
    .sub-stat { font-size: 0.9em; font-weight: normal; }
</style>
""", unsafe_allow_html=True)

# 1. Header & Market Indices
st.title("🎅 일년내내 산타랠리")

index_cols = st.columns(len(MARKET_INDICES))

for i, (name, ticker) in enumerate(MARKET_INDICES.items()):
    with index_cols[i]:
        df_idx = fetch_index_data(ticker)
        if df_idx is not None and not df_idx.empty:
            last = df_idx.iloc[-1]
            prev = df_idx.iloc[-2]
            val = last['Close']
            diff = val - prev['Close']
            pct = (diff / prev['Close']) * 100
            
            color = "red" if diff > 0 else "deepskyblue" # Korean Colors: Red Up, Blue Down
            
            st.markdown(f"""
            <div class='metric-container'>
                <div>{name}</div>
                <div class='big-stat' style='color:{color}'>{val:,.2f}</div>
                <div class='sub-stat' style='color:{color}'>{diff:+.2f} ({pct:+.2f}%)</div>
            </div>
            """, unsafe_allow_html=True)

st.divider()

# 2. Main Setup
col_list, col_detail = st.columns([1.5, 2])

with col_list:
    st.subheader("관심 종목 (Watchlist)")
    
    # Batch fetch data
    df_summary = batch_fetch_latest()
    
    if not df_summary.empty:
        # Configuration for the table
        st.dataframe(
            df_summary,
            column_config={
                "Name": "종목명",
                "Ticker": "티커",
                "Price": st.column_config.NumberColumn(
                    "현재가", format="%d원"
                ),
                "Change": st.column_config.NumberColumn(
                    "등락", format="%+d원"
                ),
                "Change %": st.column_config.NumberColumn(
                    "등락률", format="%.2f%%"
                ),
                "Trend": st.column_config.LineChartColumn(
                    "7일 추세", y_min=0, y_max=None
                )
            },
            hide_index=True,
            # use_container_width=True, # Deprecated warning in user env
            height=600,
            selection_mode="single-row",
            on_select="rerun" # Simulates simple selection, requires recent Streamlit
        )
    else:
        st.error("데이터 로딩 실패")

# 3. Detailed View (Right Column)
# Default to first stock if nothing selected (Implementation detail: Streamlit selection state is tricky without session state logic)
# We will use a Selectbox as a backup/primary controller for the right pane if dataframe selection isn't available/easy.

with col_detail:
    # Use selectbox for explicit selection for details
    selected_name = st.selectbox("상세 분석 종목 선택", list(STOCKS.keys()))
    selected_ticker = STOCKS[selected_name]
    
    st.subheader(f"{selected_name} ({selected_ticker})")
    
    df_detail = fetch_detailed_data(selected_ticker)
    
    if df_detail is not None:
        # Chart
        fig = go.Figure(data=[go.Candlestick(
            x=df_detail.index,
            open=df_detail['Open'], high=df_detail['High'],
            low=df_detail['Low'], close=df_detail['Close'],
            increasing_line_color='red', decreasing_line_color='blue'
        )])
        
        # Add MA
        ma20 = df_detail['Close'].rolling(window=20).mean()
        fig.add_trace(go.Scatter(x=df_detail.index, y=ma20, line=dict(color='orange', width=1), name='MA20'))
        
        fig.update_layout(
            height=400, 
            margin=dict(l=0, r=0, t=0, b=0),
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(color="white"),
             xaxis=dict(showgrid=True, gridcolor='rgba(128,128,128,0.2)'),
            yaxis=dict(showgrid=True, gridcolor='rgba(128,128,128,0.2)'),
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Sentiment
        sentiment, color = analyze_sentiment(df_detail)
        st.info(f"Market Sentiment: **{sentiment}**")
