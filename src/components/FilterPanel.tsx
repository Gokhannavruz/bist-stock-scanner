import { Sliders } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    emaPeriod: number;
    rsiMin: number;
    rsiMax: number;
    volumeMultiplier: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleChange = (key: string, value: number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-glass overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center space-x-2">
        <div className="bg-indigo-50 p-1.5 rounded-lg">
          <Sliders className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Scanner Configuration</h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">EMA Period</label>
          <input
            type="number"
            value={filters.emaPeriod}
            onChange={(e) => handleChange('emaPeriod', parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min RSI</label>
          <input
            type="number"
            value={filters.rsiMin}
            onChange={(e) => handleChange('rsiMin', parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Max RSI</label>
          <input
            type="number"
            value={filters.rsiMax}
            onChange={(e) => handleChange('rsiMax', parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Volume Multiplier (x)</label>
          <input
            type="number"
            step="0.1"
            value={filters.volumeMultiplier}
            onChange={(e) => handleChange('volumeMultiplier', parseFloat(e.target.value))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
