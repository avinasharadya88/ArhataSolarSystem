# Catalog Health & Return Profitability Remediation Hub

An autonomous, interactive dashboard and decision engine designed for E-commerce Product Managers and Category Leaders (Amazon, Flipkart, Shopify ecosystems) to solve the returns crisis: **converting reverse logistics loss into retained margin and recommerce profitability**.

Based on deep research from NotebookLM on unstructured return & review signals vs. catalog quality drift.

---

## 🎯 The Core Problem Solved

In high-volume e-commerce marketplaces, **unstructured customer friction signals** (product reviews, Q&As, return reasons, support transcripts) are siloed away from catalog and listing optimization teams:
- Customers repeatedly return items citing *"runs way too small"*, *"see-through fabric"*, or *"missing hardware bolts"*.
- Category managers spend hundreds of hours manually reviewing disparate logs.
- Uncorrected listing errors continuously drive up return rates, causing massive reverse-logistics cash drains (shipping, warehouse inspection, write-downs, and lost margin).

---

## 💡 The 4 Levers: Turning Returns from Loss to Profit

Instead of accepting returns as a pure balance sheet write-off, the engine implements four high-impact levers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 RETURNS-TO-PROFIT FINANCIAL TRANSFORMATION                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ Lever 1: AI Catalog Prevention ]                                         │
│  Zero-shot feedback extraction auto-patches sizing guides, fabric GSM,      │
│  and hardware manuals — eliminating 18–30% of preventable returns.         │
│                                                                             │
│  [ Lever 2: Exchange-over-Refund Incentives ]                               │
│  Offers customers +10% bonus store credit for exchanges, retaining gross    │
│  margin and repeat customer lifetime value instead of cash refunds.         │
│                                                                             │
│  [ Lever 3: Smart "Keep-It" Arbitrage ]                                     │
│  For low-value items where return logistics ($12+) exceeds residual value,  │
│  automated micro-refunds eliminate costly reverse shipping entirely.        │
│                                                                             │
│  [ Lever 4: Automated Grade & Recommerce Resale ]                           │
│  Routes returned units to Grade-A certified open-box channels at ~58%       │
│  salvage recovery rather than bulk 15% liquidation loss.                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Dashboard Features

1. **Interactive Profitability Modeler**:
   - Editable P&L assumptions for annual return volume, average order value, reverse shipping, inspection/restocking, gross margin, exchange bonus, and keep-it refund rate.
   - Live interactive sliders for Prevention Rate (%), Exchange Incentive Conversion (%), Keep-it Threshold (\$), and Recommerce Salvage Rate (%).
   - Recharts waterfall visualization showing the transition from traditional balance-sheet loss to positive retained turnaround value.
2. **Multi-Marketplace Support**:
   - Filter and analyze feeds across **Amazon US**, **Flipkart**, and **Shopify Global**, with reconciled 7-day, 30-day, and quarter-to-date signal volumes.
3. **AI Zero-Shot Signal Categorization**:
   - Clusters customer feedback into: *Sizing / Fit Discrepancy*, *Material Quality Drift*, *Misleading Listing Image*, *Missing Assembly Spec*, and *Pricing Drift*.
4. **High-Spike SKU Alert Monitor**:
   - Detects abnormal return spikes (e.g. SKU `APP-XL-BLU-2026` +180% return surge) and identifies exact root causes.
5. **Remediation Inspector & Live Diff Editor**:
   - Inspects customer quotes, compares active listing copy with AI proposed updates, and allows PMs to edit copy directly.
6. **One-Click Issue Dispatch**:
   - Dispatches formatted backlog tickets directly to **Linear GraphQL** (`issueCreate`) and **Jira Cloud REST v3** (Atlassian Document Format).
7. **Simulate Webhook Trigger**:
   - Built-in live generator that injects realistic incoming return webhooks with simulated HMAC-SHA256 verification.

---

## 🤖 Dedicated QA Testing Agent Architecture

As specified in system design, testing is decoupled from the main development workflow:
- **Main Agent**: Builds UI components, develops state logic, and constructs financial models.
- **QA Test Agent (`qa_test_agent`)**: An autonomous, dedicated subagent with specialized testing instructions that verifies financial formulas, edge cases, zero-shot classification precision, and API payload schemas without cluttering the main development context.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- Python (3.11+, optional for FastAPI backend)

### 1. Install & Run React Dashboard
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest test suite
npm run test

# Build production bundle
npm run build
```

The application runs on `http://localhost:3000`.

### 2. Optional: Run FastAPI Backend Service
```bash
pip install fastapi uvicorn requests pydantic
export LINEAR_API_KEY="lin_api_your_key_here"
export LINEAR_TEAM_ID="your_linear_team_id"
python -m uvicorn backend_server:app --port 8000 --reload
```

---

## 📦 Repository
- GitHub Repository: [https://github.com/avinasharadya88/ECommerce_PS](https://github.com/avinasharadya88/ECommerce_PS)
