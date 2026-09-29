import React from 'react';
import { Package, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ProfitabilityBreakdown } from '../types';

interface MetricsCardsProps {
  totalReturns: number;
  misalignmentRate: number;
  publishedTickets: number;
  breakdown: ProfitabilityBreakdown;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  totalReturns,
  misalignmentRate,
  publishedTickets,
  breakdown,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6">
      {/* 1. Total Returns Ingested */}
      <div className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Total Returns Ingested</span>
          <div className="p-1.5 bg-slate-800 rounded-lg">
            <Package className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="text-2xl font-black mt-2 text-white font-mono">
          {totalReturns.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+12% vs prior week</span>
        </div>
      </div>

      {/* 2. Catalog Misalignment Rate */}
      <div className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Catalog Misalignment Rate</span>
          <div className="p-1.5 bg-amber-500/10 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="text-2xl font-black mt-2 text-white font-mono">
          {misalignmentRate.toFixed(1)}%
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1 font-medium">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>-3.2% recovery with AI copy fixes</span>
        </div>
      </div>

      {/* 3. Est. ARR Protected */}
      <div className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Prevented Returns Savings</span>
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div className="text-2xl font-black mt-2 text-white font-mono">
          ${(breakdown.preventionSavings / 1000).toFixed(1)}k
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {breakdown.preventedUnits.toLocaleString()} units saved from logistics drain
        </div>
      </div>

      {/* 4. Net Turnaround Profit Gain */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 transition shadow-sm">
        <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
          <span>Turnaround Value Recovered</span>
          <div className="p-1.5 bg-indigo-500/20 rounded-lg">
            <DollarSign className="w-4 h-4 text-indigo-300" />
          </div>
        </div>
        <div className="text-2xl font-black mt-2 text-emerald-400 font-mono">
          +${(breakdown.netTurnaroundGain / 1000).toFixed(1)}k
        </div>
        <div className="text-xs text-indigo-200/80 mt-1 font-medium">
          {breakdown.netTurnaroundPercentage}% loss reduction turnaround
        </div>
      </div>

      {/* 5. Auto-Tickets Published */}
      <div className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition shadow-sm col-span-1 sm:col-span-2 lg:col-span-4 xl:col-span-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Catalog Fix Tickets</span>
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="text-2xl font-black mt-2 text-white font-mono">
          {publishedTickets}
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Linear GraphQL & Jira Synced</span>
        </div>
      </div>
    </div>
  );
};
