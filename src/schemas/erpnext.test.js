import { describe, it, expect } from 'vitest';
import {
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_ITEMS,
  INITIAL_STOCK_ENTRIES,
  INITIAL_STOCK_LEDGER_ENTRIES,
  INITIAL_BOMS,
  INITIAL_WORK_ORDERS,
  INITIAL_ASSETS,
  INITIAL_OPPORTUNITIES,
  INITIAL_SUPPORT_ISSUES,
  INITIAL_SUBCONTRACT_ORDERS,
} from '../data/erpnextSchemas';
import {
  Supplier,
  PurchaseOrder,
  Warehouse,
  StockItem,
  StockEntry,
  StockLedgerEntry,
  Bom,
  WorkOrder,
  Asset,
  Opportunity,
  SupportIssue,
  SubcontractOrder,
} from './erpnext';

/** @param {import('zod').ZodTypeAny} schema @param {unknown[]} rows */
function expectAllValid(schema, rows) {
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    const result = schema.safeParse(row);
    if (!result.success) {
      const label = row?.id ?? row?.item_code ?? JSON.stringify(row);
      throw new Error(`${label} failed schema: ${result.error.message}`);
    }
  }
}

describe('canonical schemas match the ERPNext seed data', () => {
  it('Suppliers', () => expectAllValid(Supplier, INITIAL_SUPPLIERS));
  it('Purchase orders', () => expectAllValid(PurchaseOrder, INITIAL_PURCHASE_ORDERS));
  it('Warehouses', () => expectAllValid(Warehouse, INITIAL_WAREHOUSES));
  it('Stock items', () => expectAllValid(StockItem, INITIAL_STOCK_ITEMS));
  it('Stock entries', () => expectAllValid(StockEntry, INITIAL_STOCK_ENTRIES));
  it('Stock ledger entries', () => expectAllValid(StockLedgerEntry, INITIAL_STOCK_LEDGER_ENTRIES));
  it('BOMs', () => expectAllValid(Bom, INITIAL_BOMS));
  it('Work orders', () => expectAllValid(WorkOrder, INITIAL_WORK_ORDERS));
  it('Assets', () => expectAllValid(Asset, INITIAL_ASSETS));
  it('Opportunities', () => expectAllValid(Opportunity, INITIAL_OPPORTUNITIES));
  it('Support issues', () => expectAllValid(SupportIssue, INITIAL_SUPPORT_ISSUES));
  it('Subcontract orders', () => expectAllValid(SubcontractOrder, INITIAL_SUBCONTRACT_ORDERS));
});
