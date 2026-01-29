import { useState, useEffect } from 'react';
import { History, Clock } from 'lucide-react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ScanButton from './components/ScanButton';
import ResultsTable, { StockResult } from './components/ResultsTable';
import LongTermScanner, { LongTermResult } from './components/LongTermScanner';
import HistorySidebar from './components/HistorySidebar';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [mode, setMode] = useState<'swing' | 'longterm'>('swing');
  const [filters, setFilters] = useState({
    emaPeriod: 20,
    rsiMin: 40,
    rsiMax: 70,
    volumeMultiplier: 1.5
  });

  const [results, setResults] = useState<StockResult[]>([]);
  const [longTermResults, setLongTermResults] = useState<LongTermResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [lastScanTime, setLastScanTime] = useState<string>('');

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<{ date: string, type: string } | null>(null);

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`${API_URL}/history`);
      const data = await response.json();
      setHistoryItems(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleLoadHistory = async (filename: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/history/${filename}`);
      const data = await response.json();

      // Determine type and set results accordingly
      if (data.type === 'longterm') {
        setMode('longterm');
        setLongTermResults(data.data);
      } else {
        setMode('swing');
        setResults(data.data);
        // Try to extract strategy from type string "swing_strategyname"
        const strat = data.type.replace('swing_', '');
        setSelectedStrategy(strat);
      }

      const date = new Date(data.timestamp);
      const formattedDate = new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(date);

      setLastScanTime(formattedDate);
      setViewingHistory({ date: formattedDate, type: data.type });
      setIsHistoryOpen(false);
    } catch (error) {
      console.error('Failed to load history item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    setIsLoading(true);
    setViewingHistory(null); // Clear history mode when scanning fresh

    try {
      let url = '';
      if (mode === 'swing') {
        url = `${API_URL}/scan?strategy=${selectedStrategy}`;
      } else {
        url = `${API_URL}/scan/long-term`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (mode === 'swing') {
        setResults(data);
      } else {
        setLongTermResults(data);
      }

      setLastScanTime(new Date().toLocaleString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }));
    } catch (error) {
      console.error('Error scanning market:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full relative">
        <HistorySidebar
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          historyItems={historyItems}
          onSelectHistory={handleLoadHistory}
          isLoading={isHistoryLoading}
        />

        <div className="space-y-8">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Navigation Tabs */}
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl inline-flex shadow-sm border border-white/40">
              <button
                onClick={() => { setMode('swing'); setViewingHistory(null); }}
                className={`${mode === 'swing'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  } px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200`}
              >
                Swing Trading
              </button>
              <button
                onClick={() => { setMode('longterm'); setViewingHistory(null); }}
                className={`${mode === 'longterm'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  } px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200`}
              >
                Long Term Investment
              </button>
            </div>

            {/* History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all group"
            >
              <History className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Scan History</span>
            </button>
          </div>

          {/* History Mode Banner */}
          {viewingHistory && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Historical View Active</p>
                  <p className="text-xs text-amber-700">
                    Showing results from scan on <span className="font-bold">{viewingHistory.date}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setViewingHistory(null); setResults([]); setLongTermResults([]); }}
                className="px-4 py-2 bg-white border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-50 transition-colors shadow-sm"
              >
                Exit History & Return to Live
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar / Top Mobile */}
            <div className="lg:col-span-1 space-y-6">
              {mode === 'swing' ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-5 shadow-glass space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Strategy Select</label>
                    <select
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                      className="block w-full rounded-xl border-gray-200 bg-gray-50/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
                    >
                      <option value="all">All Strategies</option>
                      <option value="momentum_breakout">Momentum Breakout</option>
                      <option value="trend_continuation">Trend Continuation</option>
                      <option value="momentum_volatility">Momentum Volatility</option>
                    </select>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Select a specific strategy to filter the results. "All" shows combined opportunities.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100/50 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="font-semibold text-emerald-900 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Investment Criteria
                  </h3>
                  <ul className="space-y-2.5">
                    <li className="text-sm text-emerald-800/80 flex items-start">
                      <span className="mr-2">•</span> Multi-Period Momentum (3m/6m/1y)
                    </li>
                    <li className="text-sm text-emerald-800/80 flex items-start">
                      <span className="mr-2">•</span> Price {'>'} 200-day MA Trend
                    </li>
                    <li className="text-sm text-emerald-800/80 flex items-start">
                      <span className="mr-2">•</span> Fundamentals (P/E, Growth, Debt)
                    </li>
                  </ul>
                </div>
              )}

              <div className="hidden lg:block">
                <ScanButton onScan={handleScan} isLoading={isLoading} />
                {lastScanTime && (
                  <p className="text-center text-xs text-slate-400 mt-3">
                    {viewingHistory ? 'Historical Snapshot' : `Last update: ${lastScanTime}`}
                  </p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {mode === 'swing' && !viewingHistory && (
                <FilterPanel filters={filters} onFilterChange={setFilters} />
              )}

              {mode === 'swing' ? (
                <ResultsTable results={results} />
              ) : (
                <LongTermScanner results={longTermResults} />
              )}

              <div className="lg:hidden flex flex-col items-center space-y-3">
                <ScanButton onScan={handleScan} isLoading={isLoading} />
                {lastScanTime && (
                  <p className="text-xs text-slate-400">
                    {viewingHistory ? 'Historical Snapshot' : `Last update: ${lastScanTime}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
