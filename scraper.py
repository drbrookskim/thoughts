import streamlit as st
import pandas as pd
import random
import time
import urllib.parse

# --- Configuration & Setup ---
st.set_page_config(
    page_title="AliExpress Price Scout",
    page_icon="🛍️",
    layout="wide"
)

# --- The Agent Class ---
class PriceTrackingAgent:
    def __init__(self):
        self.base_url = "https://www.aliexpress.com/wholesale?SearchText="

    def search(self, query, use_simulation=True, expected_price=10.0):
        """
        Orchestrates the search process.
        If use_simulation is True, it generates realistic mock data 
        centered around the 'expected_price' to avoid discrepancies.
        """
        if use_simulation:
            return self._simulate_search(query, expected_price)
        else:
            return self._real_scrape_attempt(query)

    def _simulate_search(self, query, expected_price):
        """
        Generates mock data with VALID links and prices closer to reality.
        """
        time.sleep(1.0) # Simulate network latency
        
        results = []
        # Generate 10-15 random variations of the product
        num_results = random.randint(10, 15)
        
        adjectives = ["Premium", "Generic", "Original", "2025 New", "Durable", "Lightweight", "Pro", "Ultra"]
        conditions = ["New", "Refurbished", "Open Box"]
        
        for i in range(num_results):
            # Create a realistic looking title variation
            title_adj = random.choice(adjectives)
            item_title = f"{title_adj} {query.title()} - {random.choice(conditions)}"
            
            # Generate a price based on the User's Expected Price
            # We create a variance of +/- 30% to simulate different sellers
            price_variance = random.uniform(0.7, 1.3)
            base_price = expected_price * price_variance
            price = round(base_price, 2)
            
            # Generate shipping cost (proportional to item price, sometimes free)
            if random.random() > 0.6:
                shipping = 0.0
            else:
                # Shipping is usually 5-20% of item cost for cheap items, or fixed for expensive ones
                shipping = round(random.uniform(0.5, max(2.0, expected_price * 0.1)), 2)
            
            # Generate seller info
            rating = round(random.uniform(3.5, 5.0), 1)
            sold = random.randint(0, 5000)
            seller_name = f"Store_{random.randint(1000, 9999)}"
            
            # Generate a VALID functional link
            safe_title = urllib.parse.quote(item_title)
            link = f"https://www.aliexpress.com/wholesale?SearchText={safe_title}"
            
            results.append({
                "Product Name": item_title,
                "Price ($)": price,
                "Shipping ($)": shipping,
                "Total Price ($)": price + shipping,
                "Seller": seller_name,
                "Rating": rating,
                "Sold Count": sold,
                "Link": link
            })
            
        return pd.DataFrame(results)

    def _real_scrape_attempt(self, query):
        """
        Executes real scraping using Playwright.
        """
        from playwright.sync_api import sync_playwright
        import re
        
        results = []
        try:
            with sync_playwright() as p:
                # Launch browser with custom user agent to avoid detection
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    viewport={"width": 1920, "height": 1080}
                )
                page = context.new_page()
                
                # Navigate to AliExpress with price sorting
                # Note: SortType=price_asc is the correct parameter
                search_url = f"https://www.aliexpress.com/wholesale?SearchText={urllib.parse.quote(query)}&SortType=price_asc"
                page.goto(search_url, timeout=60000)
                
                # Wait for content - try multiple selectors
                try:
                    page.wait_for_selector('a[href*="/item/"]', timeout=15000)
                except:
                    # If first wait fails, maybe it's a captcha or different layout
                    pass
                
                # Scroll to load lazy images/items
                for _ in range(3):
                    page.evaluate("window.scrollBy(0, 1000)")
                    time.sleep(1)
                
                # Select product cards
                # We look for links containing '/item/' which is standard for AliExpress products
                product_cards = page.query_selector_all('a[href*="/item/"]')
                seen_urls = set()
                
                if not product_cards:
                    st.error("No products found. AliExpress might be blocking the scraper or requiring a captcha.")
                    # Optional: Take a screenshot for debugging (saved locally)
                    # page.screenshot(path="debug_scrape_fail.png")
                
                for card in product_cards:
                    try:
                        link = card.get_attribute('href')
                        if not link:
                            continue
                            
                        # Normalize link
                        if link.startswith('//'):
                            link = 'https:' + link
                        elif link.startswith('/'):
                            link = 'https://www.aliexpress.com' + link
                        
                        # Clean link (remove tracking params for uniqueness check)
                        clean_link = link.split('?')[0]
                        if clean_link in seen_urls:
                            continue
                        seen_urls.add(clean_link)
                        
                        # Extract text
                        text = card.inner_text()
                        lines = text.split('\n')
                        
                        title = "Unknown Product"
                        price = 0.0
                        sold = 0
                        rating = 0.0
                        store = "AliExpress Store"
                        
                        # Heuristic parsing
                        for line in lines:
                            # Price
                            if ('$' in line or '€' in line or '£' in line) and price == 0.0:
                                price_match = re.findall(r'[\d\.,]+', line)
                                if price_match:
                                    try:
                                        price = float(price_match[0].replace(',', ''))
                                    except:
                                        pass
                            # Sold count
                            elif 'sold' in line.lower():
                                sold_match = re.findall(r'\d+', line)
                                if sold_match:
                                    sold = int(sold_match[0])
                            # Rating
                            elif len(line) <= 3 and re.match(r'^\d\.\d$', line):
                                try:
                                    rating = float(line)
                                except:
                                    pass
                            # Title (longest line usually)
                            elif len(line) > 20 and title == "Unknown Product":
                                title = line
                        
                        if price > 0:
                            results.append({
                                "Product Name": title,
                                "Price ($)": price,
                                "Shipping ($)": 0.0, # Hard to scrape reliably without entering page
                                "Total Price ($)": price, # Assuming free shipping for sorting
                                "Seller": store,
                                "Rating": rating,
                                "Sold Count": sold,
                                "Link": link
                            })
                            
                    except Exception as e:
                        continue
                
                browser.close()
                
        except Exception as e:
            st.error(f"Scraping failed: {str(e)}")
            return pd.DataFrame()
            
        return pd.DataFrame(results)

# --- Streamlit UI ---

def main():
    st.title("🛍️ AliExpress Price Scout")
    st.markdown("""
    Enter a product name to find the best deals. 
    This agent compares sellers and sorts by the **lowest total price**.
    """)

    # Sidebar controls
    st.sidebar.header("Search Settings")
    sort_option = st.sidebar.selectbox("Sort By", ["Total Price (Low to High)", "Price (Low to High)", "Rating (High to Low)"])
    simulation_mode = st.sidebar.checkbox("Use Simulation Mode", value=False, help="Generates realistic mock data with valid search links.")
    
    # NEW: Price Calibration Slider
    st.sidebar.divider()
    st.sidebar.subheader("💰 Price Calibration")
    st.sidebar.info("Since this is a simulation, help the agent guess the right price range.")
    expected_price = st.sidebar.number_input("Average Expected Price ($)", min_value=1.0, max_value=1000.0, value=10.0, step=1.0, help="Set this to the approximate cost of the item to fix price discrepancies.")

    # Main Search Input
    # Wrapped in a form to enable "Enter" key submission
    with st.form(key='search_form'):
        col1, col2 = st.columns([5, 1])
        with col1:
            query = st.text_input("What are you looking for?", placeholder="e.g., USB-C Cable, Wireless Mouse")
        with col2:
            st.write("") 
            search_btn = st.form_submit_button("🔍 Search", type="primary", use_container_width=True)

    if search_btn and query:
        agent = PriceTrackingAgent()
        
        with st.spinner(f"Searching global sellers for '{query}' near ${expected_price:.2f}..."):
            df = agent.search(query, use_simulation=simulation_mode, expected_price=expected_price)

        if not df.empty:
            # Logic: Sort the results
            if sort_option == "Total Price (Low to High)":
                df = df.sort_values(by="Total Price ($)", ascending=True)
            elif sort_option == "Price (Low to High)":
                df = df.sort_values(by="Price ($)", ascending=True)
            else:
                df = df.sort_values(by="Rating", ascending=False)

            # Reset index so the cheapest item is definitely at index 0
            df = df.reset_index(drop=True)

            # Display Metrics
            best_deal = df.iloc[0]
            col1, col2, col3 = st.columns(3)
            col1.metric("Lowest Price Found", f"${best_deal['Total Price ($)']:.2f}")
            col2.metric("Average Market Price", f"${df['Total Price ($)'].mean():.2f}")
            col3.metric("Sellers Found", len(df))

            st.divider()

            # Display Results Table
            st.data_editor(
                df,
                column_config={
                    "Link": st.column_config.LinkColumn(
                        "Product Link",
                        help="Click to check live price on AliExpress",
                        display_text="Check Live Price ↗️",
                        validate="^https://.*",
                        max_chars=100,
                    ),
                    "Rating": st.column_config.ProgressColumn(
                        "Seller Rating",
                        format="%.1f",
                        min_value=0,
                        max_value=5,
                    ),
                    "Price ($)": st.column_config.NumberColumn(format="$%.2f"),
                    "Shipping ($)": st.column_config.NumberColumn(format="$%.2f"),
                    "Total Price ($)": st.column_config.NumberColumn(format="$%.2f"),
                },
                hide_index=True,
                use_container_width=True
            )
            
            st.success(f"✅ Top recommendation: **{best_deal['Product Name']}** at ${best_deal['Total Price ($)']:.2f}")
            if simulation_mode:
                st.caption("ℹ️ Note: Prices shown are simulated estimates based on your input range. Click 'Check Live Price' to see exact real-time data.")
            
        else:
            st.error("No products found. If using Real Mode, ensure scraper drivers are configured.")

if __name__ == "__main__":
    main()