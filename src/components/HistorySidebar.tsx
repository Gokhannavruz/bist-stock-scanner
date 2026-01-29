import { Clock, FileText, Calendar, X } from 'lucide-react';

interface HistoryItem {
    filename: string;
    timestamp: string;
    type: string;
    size: number;
}

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    historyItems: HistoryItem[];
    onSelectHistory: (filename: string) => void;
    isLoading: boolean;
}

export default function HistorySidebar({ isOpen, onClose, historyItems, onSelectHistory, isLoading }: HistorySidebarProps) {
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getTypeName = (type: string) => {
        if (type.includes('swing')) return 'Swing Scan';
        if (type === 'longterm') return 'Long Term';
        return type.replace('_', ' ');
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-semibold text-gray-900">Scan History</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 space-y-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <p className="text-sm text-gray-500">Loading history...</p>
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="text-center py-10">
                                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No history found yet.</p>
                                <p className="text-xs text-gray-400 mt-1">Run a scan to save results.</p>
                            </div>
                        ) : (
                            historyItems.map((item) => (
                                <button
                                    key={item.filename}
                                    onClick={() => onSelectHistory(item.filename)}
                                    className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:border-indigo-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.type === 'longterm'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-indigo-100 text-indigo-700'
                                            }`}>
                                            {getTypeName(item.type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
