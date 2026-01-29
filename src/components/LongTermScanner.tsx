import { useState } from 'react';
import { ArrowUpDown, TrendingUp } from 'lucide-react';

export interface LongTermResult {
    code: string;
    price: number;
    return_3m: number;
    return_1y: number;
    pe_ratio: number;
    debt_to_equity: number;
    score: number;
    strategies: string[];
}

interface LongTermScannerProps {
    results: LongTermResult[];
}

type SortField = 'code' | 'price' | 'return_3m' | 'return_1y' | 'pe_ratio' | 'debt_to_equity' | 'score';

export default function LongTermScanner({ results }: LongTermScannerProps) {
    const [sortField, setSortField] = useState<SortField>('score');
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

    if (results.length === 0) {
        return (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center shadow-glass">
                <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-1">No Long Term Opportunities</h3>
                <p className="text-slate-500">Try checking back later or adjusting your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-glass overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <button
                                    onClick={() => handleSort('code')}
                                    className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800 transition-colors"
                                >
                                    <span>Stock</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>

                            <th className="px-6 py-4 text-left">
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Strategies</span>
                            </th>

                            <th className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleSort('price')}
                                    className="flex items-center justify-end space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800 w-full"
                                >
                                    <span>Price</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>

                            <th className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                    <button
                                        onClick={() => handleSort('return_3m')}
                                        className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800"
                                    >
                                        <span>3M %</span>
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </th>

                            <th className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                    <button
                                        onClick={() => handleSort('return_1y')}
                                        className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800"
                                    >
                                        <span>1Y %</span>
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </th>

                            <th className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                    <button
                                        onClick={() => handleSort('pe_ratio')}
                                        className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800"
                                    >
                                        <span>P/E</span>
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </th>

                            <th className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                    <button
                                        onClick={() => handleSort('debt_to_equity')}
                                        className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800"
                                    >
                                        <span>Debt/Eq</span>
                                        <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </div>
                            </th>

                            <th className="px-6 py-4 text-center">
                                <button
                                    onClick={() => handleSort('score')}
                                    className="flex items-center justify-center space-x-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider hover:text-emerald-800 w-full"
                                >
                                    <span>Score</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50/50">
                        {sortedResults.map((result, index) => (
                            <tr key={result.code} className="hover:bg-emerald-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        {index < 3 && (
                                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-200">
                                                {index + 1}
                                            </span>
                                        )}
                                        <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{result.code}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {result.strategies && result.strategies.map(strat => (
                                            <span key={strat} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-100/50 text-emerald-700 border border-emerald-100">
                                                {strat}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    ₺{result.price.toFixed(2)}
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${getValueColor(result.return_3m)}`}>
                                    {result.return_3m > 0 ? '+' : ''}{result.return_3m.toFixed(1)}%
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${getValueColor(result.return_1y)}`}>
                                    {result.return_1y > 0 ? '+' : ''}{result.return_1y.toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-right text-slate-600">
                                    {result.pe_ratio.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-600">
                                    {result.debt_to_equity.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex flex-col items-center justify-center w-12 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                                        <span className="text-sm font-bold text-emerald-800">{result.score.toFixed(0)}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
