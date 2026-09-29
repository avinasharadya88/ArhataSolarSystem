import React from 'react';
import { CheckCircle2, X, ExternalLink } from 'lucide-react';

interface TicketSuccessToastProps {
  message: string;
  identifier: string;
  target: 'Linear' | 'Jira';
  onClose: () => void;
}

export const TicketSuccessToast: React.FC<TicketSuccessToastProps> = ({
  message,
  identifier,
  target,
  onClose,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 rounded-xl p-4 shadow-2xl flex items-start gap-3 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 mt-0.5">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">
            {target} Issue Published Successfully!
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-slate-300 mt-1">{message}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/20">
            {identifier}
          </span>
          <span className="text-[10px] text-slate-500">GraphQL Mutation 200 OK</span>
        </div>
      </div>
    </div>
  );
};
