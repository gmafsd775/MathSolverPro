import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { HistoryItem } from '../types/math';
import { MathDisplay } from './MathDisplay';

interface HistoryPanelProps {
  history: HistoryItem[];
  isVisible: boolean;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  isVisible,
  onSelect,
  onClear,
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (!isVisible && history.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">History</h3>
        </div>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No calculations yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Your calculation history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">History</h3>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
              {history.length}
            </span>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No calculations yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Your calculation history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300 text-sm font-mono mb-1 truncate">
                      {item.expression}
                    </div>
                    <div className="text-white font-semibold">
                      <MathDisplay value={item.result} className="text-sm" />
                    </div>
                  </div>
                  <div className="text-slate-500 text-xs whitespace-nowrap">
                    {formatTime(new Date(item.timestamp))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};