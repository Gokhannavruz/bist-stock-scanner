import sys
import os
import json

# Add project root to path
sys.path.append(os.getcwd())

try:
    from backend.scanner import StockScanner
    
    print("Initializing Scanner...")
    scanner = StockScanner()
    
    print("Running Long Term Scan (This may take ~30s)...")
    results = scanner.scan_long_term()
    
    print(f"Found {len(results)} long-term opportunities.")
    
    if results:
        print("Top 3 Stocks:")
        print(json.dumps(results[:3], indent=2))
        
        # Check for fundamental data
        has_fundamentals = all('pe_ratio' in r for r in results)
        print(f"Fundamentals Present: {has_fundamentals}")
    else:
        print("No matches found. This might be due to market conditions or strict filters.")

except ImportError as e:
    print(f"Import Error: {e}")
except Exception as e:
    print(f"Runtime Error: {e}")
