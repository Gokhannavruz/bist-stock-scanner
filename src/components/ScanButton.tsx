import { Search, Loader2 } from 'lucide-react';

interface ScanButtonProps {
  onScan: () => void;
  isLoading: boolean;
}

export default function ScanButton({ onScan, isLoading }: ScanButtonProps) {
  return (
    <button
      onClick={onScan}
      disabled={isLoading}
      className="group relative w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-glow hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300" />
      <div className="relative flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-indigo-100" />
            <span>Scanning Markets...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Run Analysis</span>
          </>
        )}
      </div>
    </button>
  );
}
