from backend.scanner import StockScanner
import json

def test_scanner():
    print("Initializing Scanner...")
    scanner = StockScanner()
    
    print("Running Filter...")
    results = scanner.filter_stocks()
    
    print(f"Found {len(results)} stocks matching criteria.")
    
    if results:
        print("Top 3 Stocks:")
        print(json.dumps(results[:3], indent=2))
        
        # Count strategies
        counts = {}
        for r in results:
            for s in r.get("strategies", []):
                counts[s] = counts.get(s, 0) + 1
        
        print("\nStrategy Counts:")
        for s, count in counts.items():
            print(f"{s}: {count}")
    else:
        print("No stocks found. Try running again as data is random.")

if __name__ == "__main__":
    test_scanner()
