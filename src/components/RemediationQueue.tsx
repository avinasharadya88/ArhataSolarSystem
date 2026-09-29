import React, { useState } from 'react';
import { ReturnLog, ReturnCategory } from '../types';
import {
  Edit3,
  Send,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RemediationQueueProps {
  logs: ReturnLog[];
  onOpenInspector: (log: ReturnLog) => void;
  onPushTicket: (id: string, target: 'linear' | 'jira') => void;
}

export const RemediationQueue: React.FC<RemediationQueueProps> = ({
  logs,
  onOpenInspector,
  onPushTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.customerFeedback.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || log.category === selectedCategory;

    const matchesPriority =
      selectedPriority === 'all' || log.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm my-6">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Incoming Return Signals & AI Catalog Remediation Queue
            </h2>
            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-semibold">
              {filteredLogs.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time webhook signals classified into catalog fixes, exchange retentions, and keep-it routing
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search SKU, quote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 outline-none focus:border-indigo-500 w-44 sm:w-56"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
          >
            <option value="all">All Root Causes</option>
            <option value="Sizing / Fit Discrepancy">Sizing / Fit</option>
            <option value="Material Quality Drift">Material Quality</option>
            <option value="Misleading Listing Image">Misleading Imagery</option>
            <option value="Missing Assembly Spec">Missing Specs</option>
            <option value="Pricing & Promotion Drift">Pricing Drift</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Medium</option>
            <option value="P3">P3 - Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">SKU & Channel</th>
              <th className="p-3.5">Customer Friction Signal</th>
              <th className="p-3.5">AI Root Cause Category</th>
              <th className="p-3.5">Drafted Listing Remediation</th>
              <th className="p-3.5">Turnaround Lever</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5 text-right">Backlog Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition">
                {/* SKU & Marketplace */}
                <td className="p-3.5">
                  <div className="font-mono text-indigo-400 font-bold">{log.sku}</div>
                  <div className="text-slate-300 text-[11px] font-medium truncate max-w-[140px]">
                    {log.productName}
                  </div>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${
                      log.marketplace === 'amazon'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : log.marketplace === 'flipkart'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {log.marketplace}
                  </span>
                </td>

                {/* Customer Feedback */}
                <td className="p-3.5 max-w-xs">
                  <p
                    className="text-slate-200 line-clamp-2 italic"
                    title={log.customerFeedback}
                  >
                    "{log.customerFeedback}"
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                    {log.timestamp}
                  </span>
                </td>

                {/* Category */}
                <td className="p-3.5">
                  <span className="inline-block bg-slate-800 text-slate-300 px-2 py-1 rounded text-[11px] border border-slate-700/80 font-medium">
                    {log.category}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">
                    {(log.confidenceScore * 100).toFixed(1)}% match
                  </div>
                </td>

                {/* Suggested Fix */}
                <td className="p-3.5 max-w-sm">
                  <p className="text-slate-300 text-xs line-clamp-2 bg-slate-950/50 p-2 rounded border border-slate-800/80">
                    {log.suggestedFix}
                  </p>
                </td>

                {/* Profitability Resolution Mode */}
                <td className="p-3.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${
                      log.resolutionMode === 'exchanged'
                        ? 'bg-violet-500/10 text-violet-300 border-violet-500/25'
                        : log.resolutionMode === 'keep_item'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                    }`}
                  >
                    {log.resolutionMode === 'exchanged'
                      ? 'Exchange (+Bonus Credit)'
                      : log.resolutionMode === 'keep_item'
                      ? 'Keep-It Arbitrage'
                      : 'Recommerce Open-Box'}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Est. Value: ${log.itemValue}
                  </div>
                </td>

                {/* Priority */}
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      log.priority === 'P1'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : log.priority === 'P2'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-700/60 text-slate-300 border border-slate-600/40'
                    }`}
                  >
                    {log.priority}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3.5 text-right whitespace-nowrap">
                  {log.status === 'Pushed to Linear' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Linear Synced
                    </span>
                  ) : log.status === 'Pushed to Jira' ? (
                    <span className="inline-flex items-center gap-1 text-sky-400 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Jira Synced
                    </span>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenInspector(log)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        title="Inspect & Refine Fix"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onPushTicket(log.id, 'linear')}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-xs font-medium transition shadow-sm"
                        title="Dispatch Linear GraphQL mutation"
                      >
                        <Send className="w-3 h-3" />
                        Linear
                      </button>
                      <button
                        onClick={() => onPushTicket(log.id, 'jira')}
                        className="flex items-center gap-1 bg-sky-700 hover:bg-sky-600 text-white px-2.5 py-1 rounded text-xs font-medium transition shadow-sm"
                        title="Create Jira REST v3 issue"
                      >
                        Jira
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
