import React from 'react';
import { HighSpikeSku, ReturnLog } from '../types';
import { AlertTriangle, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

interface HighSpikeSkuAlertsProps {
  alerts: HighSpikeSku[];
  onSelectSku: (sku: string) => void;
  logs: ReturnLog[];
  onOpenInspector: (log: ReturnLog) => void;
}

export const HighSpikeSkuAlerts: React.FC<HighSpikeSkuAlertsProps> = ({
  alerts,
  logs,
  onOpenInspector,
}) => {
  const handleReviewClick = (sku: string) => {
    const matchingLog = logs.find((l) => l.sku === sku);
    if (matchingLog) {
      onOpenInspector(matchingLog);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            High-Spike SKU Alerts
          </h2>
          <span className="text-[11px] font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            {alerts.length} Action Items
          </span>
        </div>

        <div className="space-y-3.5 mt-3.5">
          {alerts.map((item) => (
            <div
              key={item.sku}
              className="bg-red-950/20 border border-red-500/20 hover:border-red-500/40 rounded-lg p-3.5 transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[11px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-semibold">
                    {item.sku}
                  </span>
                  <h3 className="text-xs font-semibold text-white mt-1.5">{item.productName}</h3>
                </div>
                <span className="text-xs font-bold text-red-400 font-mono whitespace-nowrap">
                  +{item.returnSpikePercent}% Spike
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                <span className="font-semibold text-slate-400">Primary Driver: </span>
                {item.primaryDriver}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-red-500/10">
                <span>{item.totalReturns} units returned</span>
                <span className="font-mono text-emerald-400 font-medium">
                  +${(item.potentialAnnualSavings / 1000).toFixed(1)}k ARR at risk
                </span>
              </div>

              <button
                onClick={() => handleReviewClick(item.sku)}
                className="mt-3 w-full text-xs bg-red-600 hover:bg-red-500 text-white font-medium py-1.5 rounded-md transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Review AI Listing Copy Fix
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Anomaly threshold: &gt; +50% weekly volume</span>
        <span className="text-indigo-400 hover:underline cursor-pointer">Configure Thresholds</span>
      </div>
    </div>
  );
};
