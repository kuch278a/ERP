/**
 * Canonical schemas for ERPNext-derived domains (docs/PLAN.md §L1).
 * Field names follow the ERPNext doctype conventions used in the seed data.
 */
import { z } from 'zod';

const DocId = z.string().min(1);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
const Money = z.number();

export const Supplier = z
  .object({
    id: DocId,
    supplier_name: z.string().min(1),
    supplier_group: z.string(),
    country: z.string(),
    tax_id: z.string(),
    payment_terms: z.string(),
    rating: z.number().min(0).max(5),
    average_lead_time_days: z.number().int().nonnegative(),
    total_purchased: Money,
    primary_contact: z.string(),
    email: z.string().email(),
    phone: z.string(),
    status: z.string(),
  })
  .passthrough();

export const PurchaseOrderItem = z.object({
  item_code: z.string().min(1),
  item_name: z.string().min(1),
  qty: z.number(),
  uom: z.string(),
  rate: z.number(),
  amount: z.number(),
  warehouse: z.string(),
});

export const PurchaseOrder = z
  .object({
    id: DocId,
    naming_series: z.string(),
    supplier: z.string(),
    supplier_name: z.string(),
    project: z.string(),
    projectName: z.string(),
    transaction_date: IsoDate,
    schedule_date: IsoDate,
    set_warehouse: z.string(),
    status: z.string(),
    docstatus: z.number(),
    currency: z.string(),
    total_qty: z.number(),
    total: z.number(),
    items: z.array(PurchaseOrderItem),
  })
  .passthrough();

export const Warehouse = z
  .object({
    id: DocId,
    warehouse_name: z.string().min(1),
    warehouse_type: z.string(),
    city: z.string(),
    total_valuation: z.number(),
    item_count: z.number().int().nonnegative(),
    manager: z.string(),
  })
  .passthrough();

export const StockItem = z
  .object({
    item_code: DocId,
    item_name: z.string().min(1),
    item_group: z.string(),
    stock_uom: z.string(),
    is_stock_item: z.number(),
    valuation_method: z.string(),
    valuation_rate: z.number(),
    standard_rate: z.number(),
    qty_on_hand: z.number(),
    qty_reserved: z.number(),
    qty_in_transit: z.number(),
    reorder_level: z.number(),
    brand: z.string(),
    default_warehouse: z.string(),
    lead_time_days: z.number().int().nonnegative(),
    status: z.string(),
  })
  .passthrough();

export const StockEntryItem = z.object({
  item_code: z.string().min(1),
  item_name: z.string().min(1),
  qty: z.number(),
  uom: z.string(),
  valuation_rate: z.number(),
  amount: z.number(),
});

export const StockEntry = z
  .object({
    id: DocId,
    stock_entry_type: z.string(),
    purpose: z.string(),
    posting_date: IsoDate,
    from_warehouse: z.string(),
    to_warehouse: z.string(),
    project: z.string(),
    projectName: z.string(),
    total_outgoing_value: z.number(),
    docstatus: z.number(),
    items: z.array(StockEntryItem),
  })
  .passthrough();

export const StockLedgerEntry = z
  .object({
    id: DocId,
    posting_date: IsoDate,
    posting_time: z.string(),
    item_code: z.string(),
    item_name: z.string(),
    warehouse: z.string(),
    voucher_type: z.string(),
    voucher_no: z.string(),
    actual_qty: z.number(),
    qty_after_transaction: z.number(),
    incoming_rate: z.number(),
    valuation_rate: z.number(),
    stock_value: z.number(),
    stock_value_difference: z.number(),
    batch_no: z.string(),
    project: z.string(),
  })
  .passthrough();

export const BomRawMaterial = z.object({
  item_code: z.string(),
  item_name: z.string(),
  qty: z.number(),
  uom: z.string(),
  rate: z.number(),
  amount: z.number(),
});

export const BomOperation = z.object({
  operation: z.string(),
  workstation: z.string(),
  time_mins: z.number(),
  cost: z.number(),
});

export const Bom = z
  .object({
    id: DocId,
    item: z.string(),
    item_name: z.string(),
    quantity: z.number(),
    uom: z.string(),
    is_active: z.boolean(),
    is_default: z.boolean(),
    currency: z.string(),
    total_raw_material_cost: z.number(),
    total_operating_cost: z.number(),
    total_cost: z.number(),
    raw_materials: z.array(BomRawMaterial),
    operations: z.array(BomOperation),
  })
  .passthrough();

export const WorkOrder = z
  .object({
    id: DocId,
    production_item: z.string(),
    item_name: z.string(),
    bom_no: z.string(),
    qty: z.number(),
    project: z.string(),
    projectName: z.string(),
    source_warehouse: z.string(),
    wip_warehouse: z.string(),
    fg_warehouse: z.string(),
    planned_start_date: IsoDate,
    expected_delivery_date: IsoDate,
    status: z.string(),
    docstatus: z.number(),
    progress: z.number().min(0).max(100),
    leadCraftsman: z.string(),
  })
  .passthrough();

export const Asset = z
  .object({
    id: DocId,
    asset_name: z.string().min(1),
    asset_category: z.string(),
    item_code: z.string(),
    purchase_date: IsoDate,
    gross_purchase_amount: z.number(),
    depreciation_method: z.string(),
    total_number_of_depreciations: z.number().int().positive(),
    value_after_depreciation: z.number(),
    location: z.string(),
    status: z.string(),
  })
  .passthrough();

export const Opportunity = z
  .object({
    id: DocId,
    party_name: z.string().min(1),
    opportunity_type: z.string(),
    opportunity_amount: z.number().nonnegative(),
    stage: z.string(),
    probability: z.number().min(0).max(100),
    expected_closing: IsoDate,
    contact_email: z.string().email(),
    contact_mobile: z.string(),
    city: z.string(),
    description: z.string(),
  })
  .passthrough();

export const SupportIssue = z
  .object({
    id: DocId,
    subject: z.string().min(1),
    customer: z.string(),
    project: z.string(),
    projectName: z.string(),
    priority: z.string(),
    issue_type: z.string(),
    status: z.string(),
    opening_date: IsoDate,
    resolution_details: z.string(),
  })
  .passthrough();

export const SubcontractOrder = z
  .object({
    id: DocId,
    supplier: z.string(),
    project: z.string(),
    projectName: z.string(),
    service_item: z.string(),
    rate: z.number(),
    status: z.string(),
  })
  .passthrough();
