/**
 * Shared data rules (see docs/adr/0004-ledger-integrity.md and docs/PLAN.md §L1).
 *
 * Money moves through the app as integer minor units (cents) so arithmetic never
 * drifts; formatting happens only at the render edge.
 */

export const CURRENCY = 'USD';
export const VAT_RATE = 0.05;

/** Converts major units to whole minor units (cents). */
export function toMinorUnits(amount: number | string): number {
  return Math.round(Number(amount) * 100);
}

/** Converts minor units (cents) to major units. */
export function fromMinorUnits(minor: number): number {
  return Number(minor) / 100;
}

export function formatMoney(amount: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function withVat(amount: number, rate: number = VAT_RATE): number {
  return Number(amount) * (1 + rate);
}

/** Returns an ISO date (YYYY-MM-DD). */
export function toIsoDate(value: string | Date = new Date()): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().split('T')[0];
}

/**
 * Placeholder document id for the mock phase. Real ids are server-assigned,
 * monotonic, prefixed series (SINV-.YYYY.-.#####) — see ADR 0004.
 */
export function makeDocId(prefix: string): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 5).toUpperCase();
  return `${prefix}-${year}-${suffix}`;
}
