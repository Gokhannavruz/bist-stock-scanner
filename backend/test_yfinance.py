import yfinance as yf
import pandas as pd

symbol = "THYAO.IS"
print(f"Fetching data for {symbol}...")
ticker = yf.Ticker(symbol)
df = ticker.history(period="3mo")

if df.empty:
    print("DataFrame is empty! yfinance might be failing.")
else:
    print(f"Success! Retrieved {len(df)} rows.")
    print(df.tail())
