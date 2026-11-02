import { useState } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_FFE_ITEMS,
  INITIAL_SNAGS,
  INITIAL_INVOICES,
  INITIAL_CLIENTS,
} from '../data/mockData';
import {
  INITIAL_PURCHASE_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_STOCK_ITEMS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_ENTRIES,
  INITIAL_STOCK_LEDGER_ENTRIES,
  INITIAL_CHART_OF_ACCOUNTS,
  INITIAL_GL_ENTRIES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_BOMS,
  INITIAL_WORK_ORDERS,
  INITIAL_ASSETS,
  INITIAL_OPPORTUNITIES,
  INITIAL_SUPPORT_ISSUES,
  INITIAL_SUBCONTRACT_ORDERS,
} from '../data/erpnextSchemas';
import { useLocalStorageState } from './useLocalStorageState';
import { ESTATE_ENDPOINTS, isApiEnabled, useRemoteCollection } from '../lib/estateApi';

/**
 * Domain state + mutation handlers for the app (docs/PLAN.md §L4 decomposition).
 * UI-only state (routing, modals, notifications, theme) stays in the App shell.
 */
export function useEstate() {
  const [projects, setProjects] = useLocalStorageState('ashara_projects', INITIAL_PROJECTS);
  const [ffeItems, setFfeItems] = useLocalStorageState('ashara_ffe', INITIAL_FFE_ITEMS);
  const [snags, setSnags] = useLocalStorageState('ashara_snags', INITIAL_SNAGS);
  const [invoices, setInvoices] = useLocalStorageState('ashara_invoices', INITIAL_INVOICES);
  const [clients] = useLocalStorageState('ashara_clients', INITIAL_CLIENTS);

  const [purchaseOrders, setPurchaseOrders] = useLocalStorageState('ashara_purchase_orders', INITIAL_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useLocalStorageState('ashara_suppliers', INITIAL_SUPPLIERS);
  const [stockItems, setStockItems] = useLocalStorageState('ashara_stock_items', INITIAL_STOCK_ITEMS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [stockEntries, setStockEntries] = useLocalStorageState('ashara_stock_entries', INITIAL_STOCK_ENTRIES);
  const [stockLedgerEntries, setStockLedgerEntries] = useLocalStorageState('ashara_stock_ledger', INITIAL_STOCK_LEDGER_ENTRIES);
  const [chartOfAccounts, setChartOfAccounts] = useState(INITIAL_CHART_OF_ACCOUNTS);
  const [glEntries, setGlEntries] = useLocalStorageState('ashara_gl_entries', INITIAL_GL_ENTRIES);
  const [journalEntries, setJournalEntries] = useLocalStorageState('ashara_journal_entries', INITIAL_JOURNAL_ENTRIES);

  const [boms, setBoms] = useLocalStorageState('ashara_boms', INITIAL_BOMS);
  const [workOrders, setWorkOrders] = useLocalStorageState('ashara_work_orders', INITIAL_WORK_ORDERS);
  const [assets, setAssets] = useLocalStorageState('ashara_assets', INITIAL_ASSETS);
  const [opportunities, setOpportunities] = useLocalStorageState('ashara_opportunities', INITIAL_OPPORTUNITIES);
  const [issues, setIssues] = useLocalStorageState('ashara_support_issues', INITIAL_SUPPORT_ISSUES);
  const [subcontractOrders] = useState(INITIAL_SUBCONTRACT_ORDERS);

  const handleCreateProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleCreateFfe = (newItem) => {
    setFfeItems((prev) => [newItem, ...prev]);
  };

  const handleToggleSample = (id) => {
    setFfeItems((prev) => prev.map((item) => (item.id === id ? { ...item, sampleApproved: !item.sampleApproved } : item)));
  };

  const handleUpdateFfeStatus = (id, newStatus) => {
    setFfeItems((prev) => prev.map((item) => (item.id === id ? { ...item, poStatus: newStatus } : item)));
  };

  const handleCreateSnag = (newSnag) => {
    setSnags((prev) => [newSnag, ...prev]);
  };

  const handleUpdateSnagStatus = (id, newStatus) => {
    setSnags((prev) => prev.map((snag) => (snag.id === id ? { ...snag, status: newStatus } : snag)));
  };

  const handleCreateInvoice = (newInv) => {
    setInvoices((prev) => [newInv, ...prev]);

    // Post double-entry General Ledger rows for the sales invoice.
    const newGleDr = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newInv.issueDate,
      voucher_type: 'Sales Invoice',
      voucher_no: newInv.id,
      account: '1120 - Accounts Receivable (Debtors)',
      party_type: 'Customer',
      party: newInv.clientName,
      project: newInv.projectId,
      debit: newInv.totalWithTax || newInv.amount * 1.05,
      credit: 0,
      remarks: `Sales Invoice billing: ${newInv.milestone}`,
    };
    const newGleCr = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newInv.issueDate,
      voucher_type: 'Sales Invoice',
      voucher_no: newInv.id,
      account: '4110 - Architectural & BIM Design Fees',
      party_type: 'Customer',
      party: newInv.clientName,
      project: newInv.projectId,
      debit: 0,
      credit: newInv.amount,
      remarks: `Revenue recognition: ${newInv.milestone}`,
    };
    setGlEntries((prev) => [newGleDr, newGleCr, ...prev]);
  };

  const handleToggleInvoicePaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const nextStatus = inv.status === 'Paid' ? 'Pending' : 'Paid';

        if (nextStatus === 'Paid') {
          const today = new Date().toISOString().split('T')[0];
          const amount = inv.totalWithTax || inv.amount * 1.05;
          const payGleDr = {
            id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
            posting_date: today,
            voucher_type: 'Payment Entry',
            voucher_no: `PAY-${inv.id}`,
            account: '1110 - Cash and Bank Balances (Emirates NBD)',
            party_type: 'Customer',
            party: inv.clientName,
            project: inv.projectId,
            debit: amount,
            credit: 0,
            remarks: `Payment settlement received for ${inv.id}`,
          };
          const payGleCr = {
            id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
            posting_date: today,
            voucher_type: 'Payment Entry',
            voucher_no: `PAY-${inv.id}`,
            account: '1120 - Accounts Receivable (Debtors)',
            party_type: 'Customer',
            party: inv.clientName,
            project: inv.projectId,
            debit: 0,
            credit: amount,
            remarks: `Accounts receivable cleared for ${inv.id}`,
          };
          setGlEntries((gPrev) => [payGleDr, payGleCr, ...gPrev]);
        }

        return { ...inv, status: nextStatus };
      })
    );
  };

  const handleCreatePO = (newPO) => {
    setPurchaseOrders((prev) => [newPO, ...prev]);
  };

  const handleUpdatePOStatus = (poId, nextStatus) => {
    setPurchaseOrders((prev) => prev.map((po) => (po.id === poId ? { ...po, status: nextStatus } : po)));
  };

  const handleCreateStockEntry = (newEntry) => {
    setStockEntries((prev) => [newEntry, ...prev]);

    setStockItems((prev) =>
      prev.map((item) => {
        const movedItem = newEntry.items.find((i) => i.item_code === item.item_code);
        if (!movedItem) return item;
        if (newEntry.purpose === 'Material Transfer') {
          return { ...item, qty_reserved: item.qty_reserved + movedItem.qty };
        }
        if (newEntry.purpose === 'Material Issue') {
          return { ...item, qty_on_hand: Math.max(0, item.qty_on_hand - movedItem.qty) };
        }
        if (newEntry.purpose === 'Material Receipt') {
          return { ...item, qty_on_hand: item.qty_on_hand + movedItem.qty };
        }
        return item;
      })
    );

    const stockGle = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newEntry.posting_date,
      voucher_type: 'Stock Entry',
      voucher_no: newEntry.id,
      account: '1140 - Project Work In Progress (WIP Fit-out)',
      party_type: 'Project',
      party: newEntry.projectName,
      project: newEntry.project,
      debit: newEntry.total_outgoing_value,
      credit: 0,
      remarks: `Stock movement (${newEntry.purpose}) to site staging`,
    };
    setGlEntries((prev) => [stockGle, ...prev]);
  };

  const handleCreateJournalEntry = (newJV) => {
    setJournalEntries((prev) => [newJV, ...prev]);

    const newGleRows = newJV.accounts.map((accRow, idx) => ({
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}-${idx}`,
      posting_date: newJV.posting_date,
      voucher_type: newJV.voucher_type,
      voucher_no: newJV.id,
      account: accRow.account,
      party_type: accRow.party_type,
      party: accRow.party,
      project: '',
      debit: accRow.debit,
      credit: accRow.credit,
      remarks: newJV.user_remark,
    }));

    setGlEntries((prev) => [...newGleRows, ...prev]);
  };

  const handleCreateWorkOrder = (newWO) => {
    setWorkOrders((prev) => [newWO, ...prev]);
  };

  const handleUpdateWorkOrderStatus = (woId, nextStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === woId ? { ...wo, status: nextStatus, progress: nextStatus === 'Completed' ? 100 : wo.progress } : wo))
    );
  };

  const handleCreateAsset = (newAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleCreateOpportunity = (newOpp) => {
    setOpportunities((prev) => [newOpp, ...prev]);
  };

  const handleUpdateOpportunityStage = (oppId, nextStage) => {
    setOpportunities((prev) => prev.map((opp) => (opp.id === oppId ? { ...opp, stage: nextStage } : opp)));
  };

  const handleCreateIssue = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
  };

  const handleUpdateIssueStatus = (issueId, nextStatus) => {
    setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, status: nextStatus } : issue)));
  };

  // Background hydration from the v1 API (seed data stays until it resolves).
  const apiEnabled = isApiEnabled();
  useRemoteCollection(ESTATE_ENDPOINTS.purchaseOrders, setPurchaseOrders, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.suppliers, setSuppliers, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.stockItems, setStockItems, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.warehouses, setWarehouses, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.stockLedgerEntries, setStockLedgerEntries, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.boms, setBoms, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.workOrders, setWorkOrders, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.assets, setAssets, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.opportunities, setOpportunities, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.issues, setIssues, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.chartOfAccounts, setChartOfAccounts, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.glEntries, setGlEntries, apiEnabled);
  useRemoteCollection(ESTATE_ENDPOINTS.journalEntries, setJournalEntries, apiEnabled);

  const values = {
    projects,
    ffeItems,
    snags,
    invoices,
    clients,
    purchaseOrders,
    suppliers,
    stockItems,
    warehouses,
    stockEntries,
    stockLedgerEntries,
    chartOfAccounts,
    glEntries,
    journalEntries,
    boms,
    workOrders,
    assets,
    opportunities,
    issues,
    subcontractOrders,
  };

  const setters = { setProjects };

  const handlers = {
    handleCreateProject,
    handleCreateFfe,
    handleToggleSample,
    handleUpdateFfeStatus,
    handleCreateSnag,
    handleUpdateSnagStatus,
    handleCreateInvoice,
    handleToggleInvoicePaid,
    handleCreatePO,
    handleUpdatePOStatus,
    handleCreateStockEntry,
    handleCreateJournalEntry,
    handleCreateWorkOrder,
    handleUpdateWorkOrderStatus,
    handleCreateAsset,
    handleCreateOpportunity,
    handleUpdateOpportunityStage,
    handleCreateIssue,
    handleUpdateIssueStatus,
  };

  return { values, setters, handlers };
}
