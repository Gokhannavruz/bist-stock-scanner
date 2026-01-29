# BIST Stock Scanner Backend

This is the backend service for the BIST Stock Scanner, built with Python and FastAPI.

## Prerequisites

- Python 3.9+
- pip

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the API server using uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

- **GET /scan**: Returns all stocks matching the swing trading criteria.
- **GET /scan/top**: Returns the top 5 ranked stocks.
- **GET /**: Health check.

## Configuration

- **Data Source**: The system currently uses `data_provider.py` which generates **mock data** for testing. To use real data, update the `fetch_daily_ohlcv` method in `data_provider.py` to connect to a real finance API.
