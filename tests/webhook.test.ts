import { describe, it, expect } from 'vitest';
import {
  simulateIncomingWebhook,
  buildLinearGraphQLPayload,
  buildJiraAdfPayload,
  SAMPLE_RETURN_LOGS,
} from '../src/utils/webhookSimulator';

describe('Webhook Ingestion & Ticket Payload Dispatchers', () => {
  it('simulates realistic return events with required fields', () => {
    const signal = simulateIncomingWebhook();

    expect(signal.id).toMatch(/^RET-\d+/);
    expect(signal.sku).toBeTruthy();
    expect(signal.customerFeedback).toBeTruthy();
    expect(signal.category).toBeTruthy();
    expect(signal.suggestedFix).toBeTruthy();
    expect(signal.confidenceScore).toBeGreaterThan(0.8);
    expect(signal.status).toBe('Pending');
    expect(['amazon', 'flipkart', 'shopify']).toContain(signal.marketplace);
  });

  it('generates valid Linear GraphQL issueCreate payload', () => {
    const sample = SAMPLE_RETURN_LOGS[0];
    const payload = buildLinearGraphQLPayload(sample);

    expect(payload.query).toContain('mutation CreateIssue');
    expect(payload.variables.teamId).toBe('ENG-CAT-TEAM-UUID');
    expect(payload.variables.title).toContain(sample.sku);
    expect(payload.variables.description).toContain(sample.customerFeedback);
    expect(payload.variables.priority).toBe(1); // P1 maps to 1
  });

  it('generates valid Jira REST API v3 ADF payload', () => {
    const sample = SAMPLE_RETURN_LOGS[1];
    const payload = buildJiraAdfPayload(sample);

    expect(payload.fields.project.key).toBe('CAT');
    expect(payload.fields.summary).toContain(sample.sku);
    expect(payload.fields.description.type).toBe('doc');
    expect(payload.fields.priority.name).toBe('Medium');
  });
});
