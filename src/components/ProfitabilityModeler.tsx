import React from 'react';
import { ProfitabilityParams, ProfitabilityBreakdown } from '../types';
import { Sliders, ArrowRight, ShieldCheck, Repeat, Gift, Recycle, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ProfitabilityModelerProps {
  params: ProfitabilityParams;
  onParamsChange: (newParams: ProfitabilityParams) => void;
  breakdown: ProfitabilityBreakdown;
}

export const ProfitabilityModeler: React.FC<ProfitabilityModelerProps> = ({
  params,
  onParamsChange,
  breakdown,
}) => {
  const chartData = [
    {
      name: 'Baseline Loss',
      amount: -Math.abs(Math.round(breakdown.baselineTotalLoss / 1000)),
      fill: '#ef4444',
      type: 'baseline',
    },
    {
      name: '1. AI Fix Prevention',
      amount: Math.round(breakdown.preventionSavings / 1000),
      fill: '#6366f1',
      type: 'gain',
    },
    {
      name: '2. Exchange Retention',
      amount: Math.round(breakdown.exchangeRetainedMargin / 1000),
      fill: '#8b5cf6',
      type: 'gain',
    },
    {
      name: '3. Keep-It Savings',
      amount: Math.round(breakdown.keepItLogisticsSaved / 1000),
      fill: '#06b6d4',
      type: 'gain',
    },
    {
      name: '4. Recommerce Salvage',
      amount: Math.round(breakdown.recommerceResaleRecovered / 1000),
      fill: '#10b981',
      type: 'gain',
    },
    {
      name: 'Optimized Outcome',
      amount: -Math.abs(Math.round(breakdown.newOptimizedOutcome / 1000)),
      fill: '#38bdf8',
      type: 'outcome',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 my-6 shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Returns-to-Profit Financial Transformation Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate how autonomous catalog fixes, exchange incentives, keep-it thresholds, and recommerce turn returns from a balance-sheet loss into retained profit.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">Total Turnaround Gain:</span>
          <span className="font-mono font-bold text-emerald-400">
            +${(breakdown.netTurnaroundGain / 1000).toFixed(1)}k
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
            {breakdown.netTurnaroundPercentage}% Recovered
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Interactive Levers */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Interactive Strategic Levers
            </h3>
            <span className="text-[11px] text-slate-500">Live dynamic modeling</span>
          </div>

          {/* Lever 1: AI Catalog Fix Prevention Rate */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-200">
                  Lever 1: AI Catalog Fix Prevention Rate
                </span>
              </div>
              <span className="font-mono font-bold text-indigo-300">
                {params.preventionRate}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={params.preventionRate}
              onChange={(e) =>
                onParamsChange({ ...params, preventionRate: Number(e.target.value) })
              }
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Resolves sizing, fabric & spec gaps before order</span>
              <span className="font-medium text-emerald-400">
                +${(breakdown.preventionSavings / 1000).toFixed(1)}k saved
              </span>
            </div>
          </div>

          {/* Lever 2: Exchange-over-Refund Incentives */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-violet-400" />
                <span className="font-semibold text-slate-200">
                  Lever 2: Exchange Conversion Rate (+{params.exchangeBonusCreditRate}% bonus credit)
                </span>
              </div>
              <span className="font-mono font-bold text-violet-300">
                {params.exchangeConversionRate}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              step="1"
              value={params.exchangeConversionRate}
              onChange={(e) =>
                onParamsChange({ ...params, exchangeConversionRate: Number(e.target.value) })
              }
              className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Retains revenue as store credit purchases</span>
              <span className="font-medium text-emerald-400">
                +${(breakdown.exchangeRetainedMargin / 1000).toFixed(1)}k retained
              </span>
            </div>
          </div>

          {/* Lever 3: Smart Keep-It / Micro-Refund Policy */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-200">
                  Lever 3: Smart "Keep-It" Price Ceiling
                </span>
              </div>
              <span className="font-mono font-bold text-cyan-300">
                ${params.keepItItemValueThreshold}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={params.keepItItemValueThreshold}
              onChange={(e) =>
                onParamsChange({ ...params, keepItItemValueThreshold: Number(e.target.value) })
              }
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Eliminates shipping & labor where return cost &gt; salvage</span>
              <span className="font-medium text-emerald-400">
                +${(breakdown.keepItLogisticsSaved / 1000).toFixed(1)}k saved
              </span>
            </div>
          </div>

          {/* Lever 4: Automated Grade & Recommerce / Open-Box Resale */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">
                  Lever 4: Recommerce / Refurbished Resale Recovery
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-300">
                {params.recommerceRecoveryRate}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="2"
              value={params.recommerceRecoveryRate}
              onChange={(e) =>
                onParamsChange({ ...params, recommerceRecoveryRate: Number(e.target.value) })
              }
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Routes returned units to certified open-box channels</span>
              <span className="font-medium text-emerald-400">
                +${(breakdown.recommerceResaleRecovered / 1000).toFixed(1)}k recovered
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Waterfall Bar Chart & Strategy Summary */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-semibold text-slate-300">
                Annual Financial Turnaround ($k USD)
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {params.annualReturnsCount.toLocaleString()} Annual Returns
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`$${Math.abs(Number(value))}k`, 'Value']}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strategic PM Action Playbook */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/90">
              <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Catalog Fix Engine
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero-shot LLM inspects customer return quotes to auto-patch size charts, GSM specs, and hardware manuals before more buyers order.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/90">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Recommerce Routing
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                AI visual grading sorts returned inventory into Grade-A open box & B2B refurbished channels, beating bulk 15% liquidation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
