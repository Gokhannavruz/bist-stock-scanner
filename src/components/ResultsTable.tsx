import { useState } from 'react';
import { ArrowUpDown, Info, TrendingUp } from 'lucide-react';

export interface StockResult {
  code: string;
  price: number;
  volumeChange: number;
  rsi: number;
  score: number;
  strategies: string[];
  estimated_holding_period_days: number;
  risk_level: string;
  reason: string;
  priority_score: number;
}

interface ResultsTableProps {
  results: StockResult[];
}

type SortField = 'code' | 'price' | 'volumeChange' | 'rsi' | 'score' | 'priority_score' | 'risk_level';

export default function ResultsTable({ results }: ResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });



  const getValueColor = (value: number) => {
    if (value > 0) return "text-green-600 font-semibold";
    if (value < 0) return "text-red-600 font-semibold";
    return "text-gray-600";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'High': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (results.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center shadow-glass">
        <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-1">No Opportunities Found</h3>
        <p className="text-slate-500">Adjust your filters or try a different strategy to see results.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('code')}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600 transition-colors"
                >
                  <span>Code</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('priority_score')}
                  className="flex items-center justify-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600 w-full"
                >
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Analysis
              </th>

              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort('risk_level')}
                  className="flex items-center justify-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600 w-full"
                >
                  <span>Risk</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>

              <th className="px-6 py-4 text-right">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center justify-end space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600 w-full"
                >
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => handleSort('volumeChange')}
                    className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600"
                  >
                    <span>Vol %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>
              </th>
              <th className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => handleSort('rsi')}
                    className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-indigo-600"
                  >
                    <span>RSI</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedResults.map((result, index) => (
              <tr key={result.code} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {index < 3 && (
                      <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-200">
                        {index + 1}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{result.code}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="inline-flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                    <span className="text-lg font-bold text-slate-700">{result.priority_score}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {result.strategies && result.strategies.map(strat => (
                        <span key={strat} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold bg-violet-100/50 text-violet-700 border border-violet-100">
                          {strat}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{result.reason}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">{result.estimated_holding_period_days} Day Hold</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-gray-900 text-base">₺{result.price.toFixed(2)}</div>
                </td>
                <td className={`px-6 py-4 text-right font-medium ${getValueColor(result.volumeChange)}`}>
                  {result.volumeChange > 0 ? '+' : ''}{result.volumeChange.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-600">
                  {result.rsi.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
