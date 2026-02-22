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

    def search(self, query, use_simulation=True, expected_price=10.0, max_price=0.0, exclude_refurbished=False):
        """
        Orchestrates the search process.
        If use_simulation is True, it generates realistic mock data 
        centered around the 'expected_price' to avoid discrepancies.
        """
        if use_simulation:
            return self._simulate_search(query, expected_price, max_price, exclude_refurbished)
        else:
            return self._real_scrape_attempt(query)

    def _simulate_search(self, query, expected_price, max_price, exclude_refurbished):
        """
        Generates mock data with VALID links and prices closer to reality.
        """
        time.sleep(1.0) # Simulate network latency
        
        results = []
        # Generate exactly 20 items as requested
        num_results = 20
        
        adjectives = ["Premium", "Generic", "Original", "2025 New", "Durable", "Lightweight", "Pro", "Ultra"]
        conditions = ["New", "Refurbished", "Open Box"]
        
        if exclude_refurbished:
            conditions = [c for c in conditions if c != "Refurbished"]
        
        # Curated list of real AliExpress sellers for realistic simulation
        REAL_SELLERS = [
            "Anker Official Store", "Baseus Official Store", "UGREEN Official Store", 
            "Xiaomi Mi Store", "Factory Direct Store", "Global Electronics Store",
            "Shop1102154892 Store", "Digitaling Store", "Hoco Official Store",
            "Essager Official Store", "Toocki Official Store", "Lenovo Official Store"
        ]

        for i in range(num_results):
            # Create a realistic looking title variation
            title_adj = random.choice(adjectives)
            # REMOVED: Suffix like " - Refurbished" or " - Open Box" as per user request
            item_title = f"{title_adj} {query.title()}"
            
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
            
            total_price = price + shipping
            
            # Filter by Max Price if set
            if max_price > 0 and total_price > max_price:
                continue

            # Generate seller info from Real Sellers list
            base_seller_name = random.choice(REAL_SELLERS)
            
            # Official stores usually have higher ratings and sold counts
            if "Official" in base_seller_name or "Xiaomi" in base_seller_name:
                rating = round(random.uniform(4.7, 5.0), 1)
                raw_sold = random.randint(2000, 50000)
                # Add verification badge for official stores
                seller_name = f"{base_seller_name} ✅"
            else:
                rating = round(random.uniform(4.3, 4.9), 1)
                raw_sold = random.randint(100, 5000)
                seller_name = base_seller_name
            
            # Format Sold Count string
            if raw_sold >= 1000:
                sold_str = f"{raw_sold/1000:.1f}k+ sold"
            else:
                sold_str = f"{raw_sold} sold"
            
            # Generate a VALID functional link
            # We include the seller name in the search query to "synchronize" the result
            # FIXED: Use 'query' instead of 'item_title' to avoid over-specific searches that return 0 results
            safe_query = urllib.parse.quote(f"{base_seller_name} {query}")
            
            # FIXED: Add minPrice and maxPrice to force AliExpress to show items in the simulated range.
            # This solves the discrepancy where "Low to High" shows $0.50 accessories instead of the $20 item.
            min_p = max(0.01, price * 0.8)
            max_p = price * 1.2
            
            # REVERTED: Added &SortType=price_asc back as per user request to see low price order.
            link = f"https://www.aliexpress.com/wholesale?SearchText={safe_query}&SortType=price_asc&minPrice={min_p:.2f}&maxPrice={max_p:.2f}"
            
            results.append({
                "Product Name": item_title,
                "Price ($)": price,
                "Shipping ($)": shipping,
                "Total Price ($)": total_price,
                "Seller": seller_name,
                "Rating": rating,
                "Sold Count": sold_str,
                "Link": link
            })
            
        return pd.DataFrame(results)

    def _real_scrape_attempt(self, query):
        """
        Placeholder for real scraping logic.
        """
        st.warning("⚠️ Real-time scraping requires Selenium/Playwright drivers installed locally.")
        return pd.DataFrame()

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
    simulation_mode = st.sidebar.checkbox("Use Simulation Mode", value=True, help="Generates realistic mock data with valid search links.")
    
    # NEW: Filters
    st.sidebar.subheader("Filters")
    exclude_refurbished = st.sidebar.checkbox("Exclude Refurbished", value=False)
    max_price = st.sidebar.number_input("Max Price ($)", min_value=0.0, value=5.0, step=5.0, help="Set to 0 for no limit.")
    
    st.sidebar.divider()
    st.sidebar.subheader("💰 Price Calibration")
    st.sidebar.info("Since this is a simulation, help the agent guess the right price range.")
    expected_price = st.sidebar.number_input("Average Expected Price ($)", min_value=1.0, max_value=1000.0, value=2.0, step=1.0, help="Set this to the approximate cost of the item to fix price discrepancies.")

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
        # Enforce Logic: Max Price must be > Average Expected Price (if Max Price is set)
        if max_price > 0 and expected_price >= max_price:
            st.error(f"⚠️ Configuration Error: 'Average Expected Price' (${expected_price}) must be lower than 'Max Price' (${max_price}). Please adjust your settings.")
            return

        agent = PriceTrackingAgent()
        
        with st.spinner(f"Searching global sellers for '{query}' near ${expected_price:.2f}..."):
            df = agent.search(query, use_simulation=simulation_mode, expected_price=expected_price, max_price=max_price, exclude_refurbished=exclude_refurbished)

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

            # Reorder columns for display: Link after Total Price, remove Seller/Sold Count
            display_df = df[["Product Name", "Price ($)", "Shipping ($)", "Total Price ($)", "Link", "Rating"]]

            # Display Results Table
            st.data_editor(
                display_df,
                column_config={
                    "Link": st.column_config.LinkColumn(
                        "Product Link",
                        help="Click to check live price on AliExpress",
                        display_text="Check ↗️",
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
            if simulation_mode:
                st.warning("No products found matching your criteria. Try adjusting your filters (e.g., increase Max Price).")
            else:
                st.error("No products found. If using Real Mode, ensure scraper drivers are configured.")

if __name__ == "__main__":
    main()