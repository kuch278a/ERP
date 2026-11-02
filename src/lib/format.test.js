import { describe, it, expect } from 'vitest';
import { toMinorUnits, fromMinorUnits, withVat, toIsoDate, makeDocId } from './format';

describe('data rules (format.js)', () => {
  it('converts to and from minor units without float drift', () => {
    expect(toMinorUnits(19.99)).toBe(1999);
    expect(toMinorUnits(0.1 + 0.2)).toBe(30);
    expect(fromMinorUnits(1999)).toBeCloseTo(19.99);
  });

  it('applies the 5% VAT rate', () => {
    expect(withVat(100)).toBeCloseTo(105);
  });

  it('formats ISO dates', () => {
    expect(toIsoDate(new Date('2026-11-02T10:00:00Z'))).toBe('2026-11-02');
  });

  it('builds prefixed document ids matching the server series shape', () => {
    expect(makeDocId('SINV')).toMatch(/^SINV-\d{4}-[A-Z0-9]{5}$/);
    expect(makeDocId('GLE')).toMatch(/^GLE-\d{4}-[A-Z0-9]{5}$/);
  });
});
