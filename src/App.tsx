import React, { useState, useMemo } from 'react';
import {
  ReturnLog,
  Marketplace,
  Timeframe,
  ReturnCategory,
  HighSpikeSku,
  ProfitabilityParams,
} from './types';
import {
  SAMPLE_RETURN_LOGS,
  simulateIncomingWebhook,
} from './utils/webhookSimulator';
import {
  DEFAULT_PROFITABILITY_PARAMS,
  calculateProfitability,
} from './utils/profitabilityEngine';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { ProfitabilityModeler } from './components/ProfitabilityModeler';
import { RootCauseAnalytics } from './components/RootCauseAnalytics';
import { HighSpikeSkuAlerts } from './components/HighSpikeSkuAlerts';
import { RemediationQueue } from './components/RemediationQueue';
import { RemediationModal } from './components/RemediationModal';
import { TicketSuccessToast } from './components/TicketSuccessToast';

const INITIAL_SPIKE_ALERTS: HighSpikeSku[] = [
  {
    sku: 'APP-XL-BLU-2026',
    productName: 'Slim-Fit Linen Blend Oxford Shirt',
    category: 'Apparel',
    returnSpikePercent: 180,
    totalReturns: 218,
    primaryDriver: 'Sizing discrepancy: 84% cite tight shoulder cut & narrow chest spec.',
    complaintQuote: 'Runs way smaller than size chart, fabric tight around shoulders.',
    preventableRate: 85,
    potentialAnnualSavings: 28400,
    badge: 'Critical',
    marketplace: 'amazon',
  },
  {
    sku: 'DEN-32-IND-884',
    productName: 'Selvedge Raw Indigo Slim Denim Jeans',
    category: 'Apparel',
    returnSpikePercent: 95,
    totalReturns: 142,
    primaryDriver: 'Color drift: Received denim looks dark grey-charcoal instead of royal indigo.',
    complaintQuote: 'Color in listing photos looks royal navy, but received dull dark charcoal.',
    preventableRate: 78,
    potentialAnnualSavings: 16800,
    badge: 'Warning',
    marketplace: 'amazon',
  },
  {
    sku: 'HOM-OAK-TAB-09',
    productName: 'Minimalist Solid Oak Coffee Table',
    category: 'Home & Furniture',
    returnSpikePercent: 115,
    totalReturns: 96,
    primaryDriver: 'Missing assembly hardware: Missing 4 M8 bolts & diagram unclear.',
    complaintQuote: 'Assembly hardware missing bolts and no tool checklist included.',
    preventableRate: 92,
    potentialAnnualSavings: 22500,
    badge: 'Investigate',
    marketplace: 'shopify',
  },
];

export default function App() {
  const [logs, setLogs] = useState<ReturnLog[]>(SAMPLE_RETURN_LOGS);
  const [marketplace, setMarketplace] = useState<Marketplace>('all');
  const [timeframe, setTimeframe] = useState<Timeframe>('7d');
  const [selectedLog, setSelectedLog] = useState<ReturnLog | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [params, setParams] = useState<ProfitabilityParams>(DEFAULT_PROFITABILITY_PARAMS);

  const [toast, setToast] = useState<{
    message: string;
    identifier: string;
    target: 'Linear' | 'Jira';
  } | null>(null);

  // Filter logs by marketplace
  const filteredLogs = useMemo(() => {
    if (marketplace === 'all') return logs;
    return logs.filter((l) => l.marketplace === marketplace);
  }, [logs, marketplace]);

  // High spike alerts filtered
  const filteredAlerts = useMemo(() => {
    if (marketplace === 'all') return INITIAL_SPIKE_ALERTS;
    return INITIAL_SPIKE_ALERTS.filter((a) => a.marketplace === marketplace);
  }, [marketplace]);

  // Dynamic profitability breakdown
  const profitabilityBreakdown = useMemo(() => {
    return calculateProfitability(params);
  }, [params]);

  // Root cause distribution
  const rootCauseDistribution = useMemo(() => {
    const counts: Record<ReturnCategory, number> = {
      'Sizing / Fit Discrepancy': 0,
      'Material Quality Drift': 0,
      'Misleading Listing Image': 0,
      'Missing Assembly Spec': 0,
      'Pricing & Promotion Drift': 0,
    };

    filteredLogs.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });

    const total = filteredLogs.length || 1;

    return [
      {
        category: 'Sizing / Fit Discrepancy' as ReturnCategory,
        percentage: Math.round(((counts['Sizing / Fit Discrepancy'] || 0) / total) * 100) || 42,
        count: (counts['Sizing / Fit Discrepancy'] || 0) + 596,
        color: '#6366f1',
        description: 'Runs small/large, tight shoulders, incorrect dimensional charts.',
      },
      {
        category: 'Material Quality Drift' as ReturnCategory,
        percentage: Math.round(((counts['Material Quality Drift'] || 0) / total) * 100) || 28,
        count: (counts['Material Quality Drift'] || 0) + 397,
        color: '#8b5cf6',
        description: 'Fabric opacity/GSM deviation, loose threading, texture complaints.',
      },
      {
        category: 'Misleading Listing Image' as ReturnCategory,
        percentage: Math.round(((counts['Misleading Listing Image'] || 0) / total) * 100) || 18,
        count: (counts['Misleading Listing Image'] || 0) + 255,
        color: '#06b6d4',
        description: 'Color mismatch under real lighting, photo accessories not included.',
      },
      {
        category: 'Missing Assembly Spec' as ReturnCategory,
        percentage: Math.round(((counts['Missing Assembly Spec'] || 0) / total) * 100) || 12,
        count: (counts['Missing Assembly Spec'] || 0) + 172,
        color: '#f59e0b',
        description: 'Missing dimensions, bolt checklist omission, unclear manuals.',
      },
    ];
  }, [filteredLogs]);

  // Push Ticket to Linear or Jira
  const handlePushTicket = (
    id: string,
    target: 'linear' | 'jira',
    customFix?: string
  ) => {
    const ticketId =
      target === 'linear'
        ? `ENG-CAT-${Math.floor(100 + Math.random() * 900)}`
        : `JIRA-RET-${Math.floor(1000 + Math.random() * 9000)}`;

    setLogs((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          return {
            ...log,
            status: target === 'linear' ? 'Pushed to Linear' : 'Pushed to Jira',
            suggestedFix: customFix || log.suggestedFix,
            ticketIdentifier: ticketId,
            ticketUrl:
              target === 'linear'
                ? `https://linear.app/marketplace/issue/${ticketId}`
                : `https://jira.atlassian.net/browse/${ticketId}`,
          };
        }
        return log;
      })
    );

    setToast({
      message: `Backlog ticket created for catalog remediation team.`,
      identifier: ticketId,
      target: target === 'linear' ? 'Linear' : 'Jira',
    });
  };

  // Simulate Webhook Ingestion
  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newSignal = simulateIncomingWebhook();
      setLogs((prev) => [newSignal, ...prev]);
      setIsSimulating(false);
    }, 450);
  };

  const handleRefresh = () => {
    setLogs([...SAMPLE_RETURN_LOGS]);
  };

  const publishedTicketsCount = logs.filter(
    (l) => l.status === 'Pushed to Linear' || l.status === 'Pushed to Jira'
  ).length + 312;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Bar */}
        <Header
          marketplace={marketplace}
          onMarketplaceChange={setMarketplace}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          onSimulateWebhook={handleSimulateWebhook}
          onRefresh={handleRefresh}
          isSimulating={isSimulating}
        />

        {/* Metrics Cards Overview */}
        <MetricsCards
          totalReturns={1420 + (logs.length - SAMPLE_RETURN_LOGS.length)}
          misalignmentRate={18.4}
          publishedTickets={publishedTicketsCount}
          breakdown={profitabilityBreakdown}
        />

        {/* Core Feature: Return-to-Profit Financial Transformation Engine */}
        <ProfitabilityModeler
          params={params}
          onParamsChange={setParams}
          breakdown={profitabilityBreakdown}
        />

        {/* Analytics & High Spike SKU Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RootCauseAnalytics distribution={rootCauseDistribution} />
          </div>
          <div className="lg:col-span-1">
            <HighSpikeSkuAlerts
              alerts={filteredAlerts}
              onSelectSku={() => {}}
              logs={logs}
              onOpenInspector={setSelectedLog}
            />
          </div>
        </div>

        {/* Actionable Remediation Queue Table */}
        <RemediationQueue
          logs={filteredLogs}
          onOpenInspector={setSelectedLog}
          onPushTicket={handlePushTicket}
        />
      </div>

      {/* Detail Inspector Drawer / Modal */}
      {selectedLog && (
        <RemediationModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onApproveAndPush={(id, target, customFix) => {
            handlePushTicket(id, target, customFix);
            setSelectedLog(null);
          }}
        />
      )}

      {/* Success Notification Toast */}
      {toast && (
        <TicketSuccessToast
          message={toast.message}
          identifier={toast.identifier}
          target={toast.target}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
