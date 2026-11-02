/**
 * Shared data rules (see docs/adr/0004-ledger-integrity.md and docs/PLAN.md §L1).
 *
 * Money moves through the app as integer minor units (cents) so arithmetic never
 * drifts; formatting happens only at the render edge.
 */

export const CURRENCY = 'USD';
export const VAT_RATE = 0.05;

/** @param {number|string} amount @returns {number} whole minor units */
export function toMinorUnits(amount) {
  return Math.round(Number(amount) * 100);
}

/** @param {number} minor @returns {number} major units */
export function fromMinorUnits(minor) {
  return Number(minor) / 100;
}

/**
 * @param {number} amount major units
 * @param {string} [currency]
 * @returns {string}
 */
export function formatMoney(amount, currency = CURRENCY) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

/** @param {number} amount @param {number} [rate] @returns {number} */
export function withVat(amount, rate = VAT_RATE) {
  return Number(amount) * (1 + rate);
}

/** @param {string|Date} value @returns {string} ISO date (YYYY-MM-DD) */
export function toIsoDate(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().split('T')[0];
}

/**
 * Placeholder document id for the mock phase. Real ids are server-assigned,
 * monotonic, prefixed series (SINV-.YYYY.-.#####) — see ADR 0004.
 * @param {string} prefix @param {string} [series] @returns {string}
 */
export function makeDocId(prefix, series) {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 5).toUpperCase();
  return series
    ? `${prefix}-${series}-${year}-${suffix}`
    : `${prefix}-${year}-${suffix}`;
}
