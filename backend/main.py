import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scanner import StockScanner
import uvicorn

app = FastAPI(title="BIST Stock Scanner API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scanner = StockScanner()

# History Configuration
HISTORY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "history")
os.makedirs(HISTORY_DIR, exist_ok=True)

def save_scan_result(data: list, scan_type: str):
    """Saves scan results to a JSON file with a timestamp."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"scan_{timestamp}_{scan_type}.json"
    filepath = os.path.join(HISTORY_DIR, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "type": scan_type,
            "count": len(data),
            "data": data
        }, f, indent=4, ensure_ascii=False)
    return filename

@app.get("/")
def read_root():
    return {"message": "BIST Stock Scanner API is running"}

@app.get("/scan")
def scan_market(strategy: str = "all"):
    """
    Scans the market and returns stocks based on the selected strategy.
    Strategies: 'momentum_breakout', 'trend_continuation', 'momentum_volatility', 'all'
    """
    try:
        results = scanner.filter_stocks()
        
        final_results = []
        if strategy == "all":
            final_results = results
        else:
            strategy_map = {
                "momentum_breakout": "Momentum Breakout",
                "trend_continuation": "Trend Continuation",
                "momentum_volatility": "Momentum Volatility"
            }
            
            target_strat = strategy_map.get(strategy)
            if not target_strat:
                 final_results = results # Return all if invalid strategy
            else:
                for stock in results:
                    if target_strat in stock.get("strategies", []):
                        final_results.append(stock)
        
        # Save to history
        save_scan_result(final_results, f"swing_{strategy}")
        
        return final_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/long-term")
def scan_long_term_market():
    """
    Scans for 3-month to 2-year investment opportunities with fundamental analysis.
    """
    try:
        results = scanner.scan_long_term()
        # Save to history
        save_scan_result(results, "longterm")
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/top")
def scan_top_market(limit: int = 5):
    """
    Returns the top N stocks ranked by score.
    """
    try:
        results = scanner.filter_stocks()
        return results[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history_list():
    """Returns a list of saved history files."""
    try:
        files = []
        if os.path.exists(HISTORY_DIR):
            for f in os.listdir(HISTORY_DIR):
                if f.endswith(".json"):
                    filepath = os.path.join(HISTORY_DIR, f)
                    stats = os.stat(filepath)
                    # Parse filename for reliable metadata if needed, or open file
                    # scan_YYYYMMDD_HHMMSS_TYPE.json
                    try:
                        parts = f.replace(".json", "").split("_")
                        # parts: ["scan", "YYYYMMDD", "HHMMSS", "TYPE..."]
                        # Type might contain underscores, so join everything after time
                        timestamp_str = f"{parts[1]}_{parts[2]}"
                        scan_type = "_".join(parts[3:])
                        
                        dt = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S")
                        
                        files.append({
                            "filename": f,
                            "timestamp": dt.isoformat(),
                            "type": scan_type,
                            "size": stats.st_size
                        })
                    except:
                        continue # Skip malformed filenames
                        
        # Sort by timestamp descending (newest first)
        files.sort(key=lambda x: x["timestamp"], reverse=True)
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{filename}")
def get_history_item(filename: str):
    """Returns the content of a specific history file."""
    try:
        filepath = os.path.join(HISTORY_DIR, filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="History file not found")
            
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
