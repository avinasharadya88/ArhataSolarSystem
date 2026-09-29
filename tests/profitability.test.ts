import { describe, it, expect } from 'vitest';
import {
  calculateProfitability,
  DEFAULT_PROFITABILITY_PARAMS,
} from '../src/utils/profitabilityEngine';

describe('E-Commerce Returns-to-Profit Financial Engine', () => {
  it('calculates realistic baseline loss and turnaround with default parameters', () => {
    const result = calculateProfitability(DEFAULT_PROFITABILITY_PARAMS);

    // Baseline return loss should be substantial (in millions for 120k annual returns)
    expect(result.baselineTotalLoss).toBeGreaterThan(5000000);

    // All turnaround pillars must produce positive savings / recovery
    expect(result.preventionSavings).toBeGreaterThan(0);
    expect(result.exchangeRetainedMargin).toBeGreaterThan(0);
    expect(result.keepItLogisticsSaved).toBeGreaterThan(0);
    expect(result.recommerceResaleRecovered).toBeGreaterThan(0);

    // Net turnaround gain must be the exact sum of all 4 pillars
    const expectedTurnaround =
      result.preventionSavings +
      result.exchangeRetainedMargin +
      result.keepItLogisticsSaved +
      result.recommerceResaleRecovered;
    expect(result.netTurnaroundGain).toBe(expectedTurnaround);

    // Optimized outcome should reflect net loss reduction
    expect(result.newOptimizedOutcome).toBe(
      result.baselineTotalLoss - result.netTurnaroundGain
    );

    // Turnaround percentage should be positive and realistic (e.g. 20% to 80%)
    expect(result.netTurnaroundPercentage).toBeGreaterThan(20);
    expect(result.netTurnaroundPercentage).toBeLessThan(100);
  });

  it('handles 0% prevention rate edge case cleanly', () => {
    const params = {
      ...DEFAULT_PROFITABILITY_PARAMS,
      preventionRate: 0,
    };
    const result = calculateProfitability(params);

    expect(result.preventedUnits).toBe(0);
    expect(result.preventionSavings).toBe(0);
    // Other levers should still function
    expect(result.exchangedUnits).toBeGreaterThan(0);
    expect(result.keepItUnits).toBeGreaterThan(0);
    expect(result.netTurnaroundGain).toBeGreaterThan(0);
  });

  it('correctly scales when exchange conversion rate increases', () => {
    const lowExchange = calculateProfitability({
      ...DEFAULT_PROFITABILITY_PARAMS,
      exchangeConversionRate: 15,
    });
    const highExchange = calculateProfitability({
      ...DEFAULT_PROFITABILITY_PARAMS,
      exchangeConversionRate: 45,
    });

    expect(highExchange.exchangeRetainedMargin).toBeGreaterThan(
      lowExchange.exchangeRetainedMargin
    );
    expect(highExchange.exchangedUnits).toBeGreaterThan(
      lowExchange.exchangedUnits
    );
  });

  it('correctly models keep-it threshold savings', () => {
    const result = calculateProfitability(DEFAULT_PROFITABILITY_PARAMS);

    // Keep-it value includes avoided handling and retained revenue, net of
    // liquidation recovery that would have occurred on a physical return.
    const unitHandlingCost =
      DEFAULT_PROFITABILITY_PARAMS.reverseLogisticsShippingCost +
      DEFAULT_PROFITABILITY_PARAMS.inspectionAndRestockingCost;
    const valuePerKeepIt =
      unitHandlingCost +
      DEFAULT_PROFITABILITY_PARAMS.avgItemPrice *
        (1 - DEFAULT_PROFITABILITY_PARAMS.keepItRefundPercentage / 100) -
      DEFAULT_PROFITABILITY_PARAMS.avgItemPrice * 0.15;

    expect(result.keepItLogisticsSaved).toBe(
      Math.round(result.keepItUnits * valuePerKeepIt)
    );
  });

  it('uses the partial-refund assumption in keep-it economics', () => {
    const generousRefund = calculateProfitability({
      ...DEFAULT_PROFITABILITY_PARAMS,
      keepItRefundPercentage: 80,
    });
    const conservativeRefund = calculateProfitability({
      ...DEFAULT_PROFITABILITY_PARAMS,
      keepItRefundPercentage: 40,
    });

    expect(conservativeRefund.keepItLogisticsSaved).toBeGreaterThan(
      generousRefund.keepItLogisticsSaved
    );
  });
});
