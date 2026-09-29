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

const BASE_SIGNAL_COUNTS: Record<Exclude<Marketplace, 'all'>, Record<ReturnCategory, number>> = {
  amazon: {
    'Sizing / Fit Discrepancy': 268,
    'Material Quality Drift': 132,
    'Misleading Listing Image': 121,
    'Missing Assembly Spec': 54,
    'Pricing & Promotion Drift': 45,
  },
  flipkart: {
    'Sizing / Fit Discrepancy': 183,
    'Material Quality Drift': 137,
    'Misleading Listing Image': 73,
    'Missing Assembly Spec': 42,
    'Pricing & Promotion Drift': 25,
  },
  shopify: {
    'Sizing / Fit Discrepancy': 105,
    'Material Quality Drift': 85,
    'Misleading Listing Image': 47,
    'Missing Assembly Spec': 74,
    'Pricing & Promotion Drift': 29,
  },
};

const TIMEFRAME_MULTIPLIER: Record<Timeframe, number> = {
  '7d': 1,
  '30d': 4.1,
  '90d': 12.7,
};

const CATEGORY_META: Record<ReturnCategory, { color: string; description: string }> = {
  'Sizing / Fit Discrepancy': {
    color: '#6366f1',
    description: 'Runs small/large, tight shoulders, incorrect dimensional charts.',
  },
  'Material Quality Drift': {
    color: '#8b5cf6',
    description: 'Fabric opacity/GSM deviation, loose threading, texture complaints.',
  },
  'Misleading Listing Image': {
    color: '#06b6d4',
    description: 'Color mismatch under real lighting, photo accessories not included.',
  },
  'Missing Assembly Spec': {
    color: '#f59e0b',
    description: 'Missing dimensions, bolt checklist omission, unclear manuals.',
  },
  'Pricing & Promotion Drift': {
    color: '#f43f5e',
    description: 'Bundle, discount, or promotion terms differ from buyer expectations.',
  },
};

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

  // Root-cause distribution uses a stable 7-day baseline and layers in simulated
  // webhook events, so marketplace and timeframe filters always reconcile to 100%.
  const rootCauseDistribution = useMemo(() => {
    const counts: Record<ReturnCategory, number> = {
      'Sizing / Fit Discrepancy': 0,
      'Material Quality Drift': 0,
      'Misleading Listing Image': 0,
      'Missing Assembly Spec': 0,
      'Pricing & Promotion Drift': 0,
    };

    const selectedMarketplaces: Exclude<Marketplace, 'all'>[] =
      marketplace === 'all' ? ['amazon', 'flipkart', 'shopify'] : [marketplace];
    selectedMarketplaces.forEach((channel) => {
      (Object.keys(counts) as ReturnCategory[]).forEach((category) => {
        counts[category] += BASE_SIGNAL_COUNTS[channel][category];
      });
    });

    const scale = TIMEFRAME_MULTIPLIER[timeframe];
    (Object.keys(counts) as ReturnCategory[]).forEach((category) => {
      counts[category] = Math.round(counts[category] * scale);
    });

    logs.slice(0, Math.max(0, logs.length - SAMPLE_RETURN_LOGS.length)).forEach((log) => {
      if (marketplace === 'all' || log.marketplace === marketplace) counts[log.category] += 1;
    });

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const categories = Object.keys(counts) as ReturnCategory[];
    let assignedPercentage = 0;

    return categories.map((category, index) => {
      const percentage = index === categories.length - 1
        ? 100 - assignedPercentage
        : Math.round((counts[category] / total) * 100);
      assignedPercentage += percentage;
      return { category, percentage, count: counts[category], ...CATEGORY_META[category] };
    });
  }, [logs, marketplace, timeframe]);

  const signalsProcessed = rootCauseDistribution.reduce((sum, item) => sum + item.count, 0);

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
          totalReturns={signalsProcessed}
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
            <RootCauseAnalytics
              distribution={rootCauseDistribution}
              signalsProcessed={signalsProcessed}
            />
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
