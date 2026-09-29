import { describe, it, expect } from 'vitest';
import { classifyCustomerFeedback } from '../src/utils/classifier';

describe('AI Zero-Shot Return Cause & Remediation Classifier', () => {
  it('correctly classifies sizing and fit discrepancies and flags as P1', () => {
    const feedback = 'Runs 2 sizes too small and shoulder seams are tight.';
    const result = classifyCustomerFeedback(feedback, 'SKU-SHIRT-01');

    expect(result.category).toBe('Sizing / Fit Discrepancy');
    expect(result.priority).toBe('P1');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(result.suggestedFix).toContain('Runs 1 size small');
  });

  it('correctly classifies material quality and fabric drift as P2', () => {
    const feedback = 'The fabric feels very cheap and is completely see-through in daylight.';
    const result = classifyCustomerFeedback(feedback, 'SKU-TEE-02');

    expect(result.category).toBe('Material Quality Drift');
    expect(result.priority).toBe('P2');
    expect(result.suggestedFix).toContain('fabric weight');
  });

  it('correctly classifies misleading listing imagery', () => {
    const feedback = 'The color in the photo is vivid ocean blue, but received product is dull grey.';
    const result = classifyCustomerFeedback(feedback, 'SKU-PANTS-03');

    expect(result.category).toBe('Misleading Listing Image');
    expect(result.priority).toBe('P2');
    expect(result.suggestedFix).toContain('Replace hero');
  });

  it('correctly classifies missing hardware or assembly specs as P3', () => {
    const feedback = 'Package did not include the 4 M8 bolts or the hex wrench mentioned.';
    const result = classifyCustomerFeedback(feedback, 'SKU-DESK-04');

    expect(result.category).toBe('Missing Assembly Spec');
    expect(result.priority).toBe('P3');
    expect(result.suggestedFix).toContain('hardware');
  });
});
