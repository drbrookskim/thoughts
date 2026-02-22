import yfinance as yf
import mplfinance as mpf
import pandas as pd
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

# Configuration
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
BLOG_TITLE = "일년내내 산타랠리"
OUTPUT_DIR = "blog_posts"
IMAGE_DIR = os.path.join(OUTPUT_DIR, "images")

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)

# Set Korean Font for Mac
plt.rcParams['font.family'] = 'AppleGothic'
plt.rcParams['axes.unicode_minus'] = False


def fetch_data(ticker):
    """Fetches stock data for the last 6 months."""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Download data
    df = yf.download(ticker, start=start_date, end=end_date, progress=False)
    
    if df.empty:
        return None
    
    # Ensure index is Datetime
    df.index = pd.to_datetime(df.index)
    
    # Handle MultiIndex columns (flatten if necessary)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
        
    return df

def analyze_sentiment(df):
    """
    Simple heuristic for sentiment:
    - Compare today's close vs 20-day MA.
    - Check if 5-day MA > 20-day MA (Golden Cross approximation).
    - Daily price action (Bullish/Bearish candle).
    """
    if len(df) < 20:
        return "데이터 부족 (Neutral)"
    
    # Calculate Moving Averages
    df['MA5'] = df['Close'].rolling(window=5).mean()
    df['MA20'] = df['Close'].rolling(window=20).mean()
    
    # Get latest data
    # yfinance might return MultiIndex columns, ensure we handle it or just extract by position if it's single level
    
    # Safely get scalars
    close_series = df['Close']
    open_series = df['Open']
    
    latest_close = float(close_series.iloc[-1])
    latest_open = float(open_series.iloc[-1])
    
    if len(df) > 1:
        prev_close = float(close_series.iloc[-2])
    else:
        prev_close = latest_close # Fallback
    
    close_price = latest_close
    ma20 = float(df['MA20'].iloc[-1])
    open_price = latest_open
    
    sentiment_score = 0
    reasons = []

    # 1. Trend (Price vs MA20)
    if close_price > ma20:
        sentiment_score += 1
        reasons.append("20일 이동평균선 상회")
    else:
        sentiment_score -= 1
        reasons.append("20일 이동평균선 하회")

    # 2. Daily Action
    change_pct = ((close_price - prev_close) / prev_close) * 100
    if change_pct > 0:
        sentiment_score += 1
        reasons.append(f"전일 대비 상승 ({change_pct:.2f}%)")
    else:
        sentiment_score -= 1
        reasons.append(f"전일 대비 하락 ({change_pct:.2f}%)")
        
    # 3. Intraday Strength
    if close_price > open_price:
        reasons.append("양봉 마감")
    else:
        reasons.append("음봉 마감")

    # Final Verdict
    if sentiment_score >= 2:
        verdict = "매우 긍정적 (Strong Buy Sentiment)"
    elif sentiment_score == 1:
        verdict = "긍정적 (Bullish)"
    elif sentiment_score == 0:
        verdict = "중립 (Neutral)"
    elif sentiment_score == -1:
        verdict = "부정적 (Bearish)"
    else:
        verdict = "매우 부정적 (Strong Sell Sentiment)"
        
    return verdict, ", ".join(reasons)

def plot_charts(df, name):
    """Generates and saves charts."""
    # File paths
    daily_chart_path = os.path.join(IMAGE_DIR, f"{name}_daily.png")
    change_chart_path = os.path.join(IMAGE_DIR, f"{name}_change.png")
    
    # 1. Daily Candle Chart (Last 60 days)
    # Style: 'charles' is a standard candle style
    subset = df.tail(60)
    
    # Create custom style for mplfinance
    mc = mpf.make_marketcolors(up='r', down='b', inherit=True) # Korean style: Up=Red, Down=Blue
    # Set font in style
    s  = mpf.make_mpf_style(marketcolors=mc, rc={'font.family': 'AppleGothic', 'axes.unicode_minus': False})
    
    mpf.plot(subset, type='candle', style=s, title=f"{name} Daily Chart",
             savefig=daily_chart_path, volume=True, tight_layout=True)
    
    # 2. Daily Change (Open vs Close) Bar Chart (Matplotlib)
    latest = df.iloc[-1]
    
    plt.figure(figsize=(6, 4))
    categories = ['Open', 'Close']
    values = [latest['Open'], latest['Close']]
    colors = ['gray', 'red' if latest['Close'] > latest['Open'] else 'blue']
    
    bars = plt.bar(categories, values, color=colors)
    plt.title(f"{name} Today's Open vs Close")
    plt.ylabel("Price")
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                 f'{int(height):,}',
                 ha='center', va='bottom')
                 
    plt.savefig(change_chart_path)
    plt.close()
    
    # Return relative paths for markdown
    return f"images/{name}_daily.png", f"images/{name}_change.png"

def main():
    today_str = datetime.now().strftime("%Y-%m-%d")
    md_content = f"# {BLOG_TITLE} - {today_str}\n\n"
    
    overall_sentiment_count = 0
    stock_reports = []

    for name, ticker in STOCKS.items():
        print(f"Processing {name} ({ticker})...")
        df = fetch_data(ticker)
        
        if df is None:
            print(f"Failed to fetch data for {name}")
            continue
            
        sentiment, reasons = analyze_sentiment(df)
        daily_img, change_img = plot_charts(df, name)
        
        # Determine strict sentiment for overall summary
        if "긍정적" in sentiment:
            overall_sentiment_count += 1
        elif "부정적" in sentiment:
            overall_sentiment_count -= 1
            
        # Get latest stats
        latest = df.iloc[-1]
        close = int(latest['Close'])
        change = close - int(latest['Open']) # Change from Open roughly, or better: Change from Prev Close
        
        # Calculate change from previous close for accurate display
        close_series = df['Close']
        prev_close = float(close_series.iloc[-2]) if len(df) > 1 else latest_open
        diff = int(close - prev_close)
        diff_pct = (diff / prev_close) * 100
        
        # Emoji
        icon = "📈" if diff > 0 else "📉"
        
        report = f"""
## {icon} {name} ({ticker})

**현재가**: {close:,}원 ({diff:+,d}, {diff_pct:+.2f}%)
**시장의 변화 (Sentiment)**: {sentiment}
> *{reasons}*


### 일봉 차트
![{name} 일봉]({daily_img})

### 금일 시가/종가 등락 변화
![{name} 등락]({change_img})

---
"""
        stock_reports.append(report)

    # Generate One Sentence Summary
    if overall_sentiment_count > 0:
        summary_sentence = "오늘은 전체적으로 **매수 심리가 살아있는 훈훈한 하루**였습니다! 🎅"
    elif overall_sentiment_count < 0:
        summary_sentence = "오늘은 다소 **조정이 있는 차가운 하루**였습니다. ❄️"
    else:
        summary_sentence = "오늘은 **방향성을 탐색하는 혼조세**였습니다. ⚖️"
        
    md_content += f"**금일의 시장현황**: {summary_sentence}\n\n"
    md_content += "\n".join(stock_reports)
    
    # Save Blog Post
    filename = os.path.join(OUTPUT_DIR, f"blog_post_{today_str}.md")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    print(f"Blog post generated: {filename}")

if __name__ == "__main__":
    main()
