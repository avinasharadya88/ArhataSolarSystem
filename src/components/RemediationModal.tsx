import React, { useState } from 'react';
import { ReturnLog } from '../types';
import { X, Send, Sparkles, Check, Copy, ExternalLink, Code2 } from 'lucide-react';
import { buildLinearGraphQLPayload, buildJiraAdfPayload } from '../utils/webhookSimulator';

interface RemediationModalProps {
  log: ReturnLog | null;
  onClose: () => void;
  onApproveAndPush: (id: string, target: 'linear' | 'jira', customFix?: string) => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
  log,
  onClose,
  onApproveAndPush,
}) => {
  if (!log) return null;

  const [editableFix, setEditableFix] = useState(log.suggestedFix);
  const [activeTab, setActiveTab] = useState<'editor' | 'linear_preview' | 'jira_preview'>('editor');
  const [copied, setCopied] = useState(false);

  const linearPayload = buildLinearGraphQLPayload(log, editableFix);
  const jiraPayload = buildJiraAdfPayload(log, editableFix);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex justify-end z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between h-full overflow-y-auto shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {log.sku}
                </span>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  {log.marketplace}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                Remediation Inspector & Catalog Diff
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('editor')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'editor'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Fix Editor
            </button>
            <button
              onClick={() => setActiveTab('linear_preview')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'linear_preview'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Linear GraphQL Payload
            </button>
            <button
              onClick={() => setActiveTab('jira_preview')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'jira_preview'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Jira REST v3 ADF
            </button>
          </div>

          {/* Tab 1: Interactive Fix Editor */}
          {activeTab === 'editor' && (
            <div className="mt-4 space-y-4 text-xs">
              {/* Product Info */}
              <div>
                <span className="text-slate-400 font-medium">Product Title</span>
                <div className="text-slate-200 font-semibold mt-0.5">{log.productName}</div>
              </div>

              {/* Raw Customer Signal */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Raw Customer Return Signal</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <blockquote className="mt-1 p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 italic leading-relaxed">
                  "{log.customerFeedback}"
                </blockquote>
              </div>

              {/* AI Classification & Confidence */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Identified Root Cause</span>
                  <span className="text-indigo-400 font-bold mt-0.5 inline-block">
                    {log.category}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">AI Model Confidence</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mt-0.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    {(log.confidenceScore * 100).toFixed(1)}% Match
                  </div>
                </div>
              </div>

              {/* Original Listing Copy */}
              <div>
                <span className="text-slate-400 font-medium">Current Active Listing Copy</span>
                <div className="mt-1 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-slate-400 text-[11px]">
                  {log.originalListingCopy}
                </div>
              </div>

              {/* Recommended Listing Edit (Editable) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Proposed Catalog Copy Fix (Editable)
                  </span>
                  <span className="text-[10px] text-slate-500">PM review required</span>
                </div>
                <textarea
                  value={editableFix}
                  onChange={(e) => setEditableFix(e.target.value)}
                  className="w-full bg-slate-950 border border-indigo-500/40 rounded-lg p-3 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed transition"
                  rows={4}
                />
              </div>

              {/* Profitability Outcome Strategy */}
              <div className="p-3 bg-gradient-to-r from-indigo-950/40 to-slate-950 rounded-lg border border-indigo-500/20">
                <span className="text-indigo-300 font-semibold block text-[11px]">
                  Optimal Profitability Routing for this Return
                </span>
                <p className="text-slate-300 text-[11px] mt-1">
                  {log.resolutionMode === 'exchanged'
                    ? `Item value is $${log.itemValue}. Offering +10% store credit incentive retains the sale, preserving gross margin and preventing a cash refund outflow.`
                    : log.resolutionMode === 'keep_item'
                    ? `Item value is $${log.itemValue} with reverse shipping + handling costing $${log.returnCost}. A 60% partial refund ("Keep the Item") saves $11 in reverse logistics net loss.`
                    : `Item routed to Automated Grade-A Recommerce / Open-Box Resale, salvaging 58% of retail value instead of bulk 15% liquidation loss.`}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Linear GraphQL Payload */}
          {activeTab === 'linear_preview' && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Header: Authorization: lin_api_... (No Bearer)</span>
                <button
                  onClick={() => handleCopyCode(JSON.stringify(linearPayload, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy GraphQL'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(linearPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Tab 3: Jira ADF Payload */}
          {activeTab === 'jira_preview' && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Endpoint: POST /rest/api/3/issue</span>
                <button
                  onClick={() => handleCopyCode(JSON.stringify(jiraPayload, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-sky-400 overflow-x-auto max-h-96">
                {JSON.stringify(jiraPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex gap-2.5">
          <button
            onClick={() => onApproveAndPush(log.id, 'linear', editableFix)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Approve & Dispatch Linear Issue
          </button>
          <button
            onClick={() => onApproveAndPush(log.id, 'jira', editableFix)}
            className="flex-1 bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Jira ADF Issue
          </button>
        </div>
      </div>
    </div>
  );
};
