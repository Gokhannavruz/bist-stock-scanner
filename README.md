# BIST Stock Scanner

A full-stack stock scanner application for BIST (Borsa Istanbul) stocks with swing trading and long-term investment strategies.

## Features

- **Swing Trading Scanner**: Identifies momentum breakout, trend continuation, and volatility opportunities
- **Long-Term Investment Scanner**: Finds stocks with strong fundamentals and multi-period momentum
- **Real-time Analysis**: Technical indicators including RSI, MACD, EMA, Bollinger Bands, and more
- **Modern UI**: Built with React, Vite, and TailwindCSS
- **FastAPI Backend**: High-performance Python backend with automatic API documentation

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

### Backend
- FastAPI
- Python 3.13
- pandas & pandas_ta (Technical Analysis)
- yfinance (Market Data)
- uvicorn (ASGI Server)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.13+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project-5
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### Development

Run both frontend and backend:
```bash
npm run dev
```

Or run separately:
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints

- `GET /scan` - Scan market with strategy filter
- `GET /scan/long-term` - Long-term investment opportunities
- `GET /scan/top` - Top N stocks by score
- `GET /history` - List saved scan history

## Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with the included `vercel.json`.

### Backend (Railway)
The backend can be deployed to Railway using the included configuration files:
- `Procfile`
- `railway.json`
- `runtime.txt`

## License

MIT
