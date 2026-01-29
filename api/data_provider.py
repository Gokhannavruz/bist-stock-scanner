import pandas as pd
import yfinance as yf
import logging

logger = logging.getLogger(__name__)

class DataProvider:
    """
    Fetches real stock data from Yahoo Finance.
    """
    
    def __init__(self):
        # List of BIST 100 / Popular stocks
        # Yahoo Finance requires .IS suffix for Borsa Istanbul
        self.symbols = [
            "THYAO.IS", "ASELS.IS", "GARAN.IS", "AKBNK.IS", "EREGL.IS", "KCHOL.IS", 
            "SAHOL.IS", "TUPRS.IS", "SISE.IS", "BIMAS.IS", "PETKM.IS", "TCELL.IS", 
            "YKBNK.IS", "ISCTR.IS", "FROTO.IS", "TTKOM.IS", "ENKAI.IS", "KRDMD.IS", 
            "VESTL.IS", "ARCLK.IS", "ALARK.IS", "DOAS.IS", "HEKTS.IS", "KOZAL.IS",
            "MGROS.IS", "ODAS.IS", "PGSUS.IS", "SASA.IS", "TOASO.IS", "TAVHL.IS"
        ]

    def fetch_daily_ohlcv(self, symbol: str, period="3mo") -> pd.DataFrame:
        """
        Fetches daily OHLCV data for a given symbol from Yahoo Finance.
        """
        try:
            # Fetch data
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period)
            
            if df.empty:
                logger.warning(f"No data found for {symbol}")
                return pd.DataFrame()

            # Ensure columns are properly formatted
            # yfinance returns: Open, High, Low, Close, Volume, Dividends, Stock Splits
            # We only need OHLCV
            df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
            
            # Reset index to make Date a column if needed, or keep it as index.
            # Our scanner logic might expect Date as a column or just iterating rows.
            # Let's keep the standard yfinance format but ensure it's clean.
            
            return df

        except Exception as e:
            logger.error(f"Error fetching data for {symbol}: {e}")
            return pd.DataFrame()

    def get_all_bist_tickers(self):
        return self.symbols

    def fetch_fundamentals(self, symbol: str) -> dict:
        """
        Fetches fundamental data (P/E, EPS, Debt/Equity, etc.)
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Extract key metrics safely
            data = {
                "pe_ratio": info.get("trailingPE", 0),
                "forward_pe": info.get("forwardPE", 0),
                "eps_trailing": info.get("trailingEps", 0),
                "eps_forward": info.get("forwardEps", 0),
                "debt_to_equity": info.get("debtToEquity", 0),
                "free_cash_flow": info.get("freeCashflow", 0),
                "dividend_yield": info.get("dividendYield", 0) * 100 if info.get("dividendYield") else 0,
                "market_cap": info.get("marketCap", 0),
                "revenue_growth": info.get("revenueGrowth", 0) * 100 if info.get("revenueGrowth") else 0,
            }
            return data
        except Exception as e:
            logger.error(f"Error fetching fundamentals for {symbol}: {e}")
            return {}
