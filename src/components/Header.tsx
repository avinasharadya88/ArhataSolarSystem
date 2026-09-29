import React from 'react';
import { Marketplace, Timeframe } from '../types';
import { RefreshCw, Zap, ExternalLink, ShieldCheck, Layers } from 'lucide-react';

interface HeaderProps {
  marketplace: Marketplace;
  onMarketplaceChange: (m: Marketplace) => void;
  timeframe: Timeframe;
  onTimeframeChange: (t: Timeframe) => void;
  onSimulateWebhook: () => void;
  onRefresh: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  marketplace,
  onMarketplaceChange,
  timeframe,
  onTimeframeChange,
  onSimulateWebhook,
  onRefresh,
  isSimulating,
}) => {
  return (
    <header className="pb-6 border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      {/* Brand & Title */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Catalog Health & Return Remediation Engine
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Webhook Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Autonomous return signal extraction, listing copy optimizer & reverse-logistics profit turnaround
            </p>
          </div>
        </div>
      </div>

      {/* Control Actions & Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Marketplace Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => onMarketplaceChange('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              marketplace === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Marketplaces
          </button>
          <button
            onClick={() => onMarketplaceChange('amazon')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              marketplace === 'amazon'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Amazon US
          </button>
          <button
            onClick={() => onMarketplaceChange('flipkart')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              marketplace === 'flipkart'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flipkart
          </button>
          <button
            onClick={() => onMarketplaceChange('shopify')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              marketplace === 'shopify'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shopify
          </button>
        </div>

        {/* Timeframe Selector */}
        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value as Timeframe)}
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 font-medium outline-none focus:border-indigo-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Quarter to Date</option>
        </select>

        {/* Simulate Webhook Trigger */}
        <button
          onClick={onSimulateWebhook}
          disabled={isSimulating}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
          {isSimulating ? 'Ingesting...' : 'Simulate Webhook'}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition"
          title="Refresh Signals"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
