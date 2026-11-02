import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewRouter from './components/ViewRouter';

// URL-addressable views (deep links — docs/PLAN.md §L4 routing)
const KNOWN_VIEWS = new Set([
  'dashboard', 'projects', 'ffe', 'snags', 'financials', 'buying', 'stock',
  'manufacturing', 'assets', 'crm', 'support', 'erpnext_desk', 'clients',
  'moodboards', 'materials', 'team',
]);

// Views are rendered by <ViewRouter /> (lazy-loaded there).

// Modals
const ProjectDetailModal = lazy(() => import('./components/ProjectDetailModal'));
const NewProjectModal = lazy(() => import('./components/NewProjectModal'));
const NewFfeModal = lazy(() => import('./components/NewFfeModal'));
const NewSnagModal = lazy(() => import('./components/NewSnagModal'));
const NewInvoiceModal = lazy(() => import('./components/NewInvoiceModal'));
const PrintableInvoiceModal = lazy(() => import('./components/PrintableInvoiceModal'));
const NewPurchaseOrderModal = lazy(() => import('./components/NewPurchaseOrderModal'));
const NewStockEntryModal = lazy(() => import('./components/NewStockEntryModal'));
const NewJournalEntryModal = lazy(() => import('./components/NewJournalEntryModal'));
const DocTypeInspectorModal = lazy(() => import('./components/DocTypeInspectorModal'));
const NewWorkOrderModal = lazy(() => import('./components/NewWorkOrderModal'));
const NewAssetModal = lazy(() => import('./components/NewAssetModal'));
const NewOpportunityModal = lazy(() => import('./components/NewOpportunityModal'));
const NewSupportIssueModal = lazy(() => import('./components/NewSupportIssueModal'));

// Mock Data
import { 
  INITIAL_PROJECTS, 
  INITIAL_FFE_ITEMS, 
  INITIAL_SNAGS, 
  INITIAL_INVOICES, 
  INITIAL_CLIENTS 
} from './data/mockData';

// ERPNext Schemas & Ported Master Datasets
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
  INITIAL_SUBCONTRACT_ORDERS
} from './data/erpnextSchemas';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('ashara_theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname.replace(/^\/+/, '');
  const currentView = KNOWN_VIEWS.has(route) ? route : 'dashboard';
  const setCurrentView = (view) => navigate(`/${view}`);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain state — persisted via the shared hook (docs/PLAN.md §L4)
  const [projects, setProjects] = useLocalStorageState('ashara_projects', INITIAL_PROJECTS);
  const [ffeItems, setFfeItems] = useLocalStorageState('ashara_ffe', INITIAL_FFE_ITEMS);
  const [snags, setSnags] = useLocalStorageState('ashara_snags', INITIAL_SNAGS);
  const [invoices, setInvoices] = useLocalStorageState('ashara_invoices', INITIAL_INVOICES);
  const [clients] = useLocalStorageState('ashara_clients', INITIAL_CLIENTS);

  const [purchaseOrders, setPurchaseOrders] = useLocalStorageState('ashara_purchase_orders', INITIAL_PURCHASE_ORDERS);
  const [suppliers] = useLocalStorageState('ashara_suppliers', INITIAL_SUPPLIERS);
  const [stockItems, setStockItems] = useLocalStorageState('ashara_stock_items', INITIAL_STOCK_ITEMS);
  const [warehouses] = useState(INITIAL_WAREHOUSES);
  const [stockEntries, setStockEntries] = useLocalStorageState('ashara_stock_entries', INITIAL_STOCK_ENTRIES);
  const [stockLedgerEntries] = useLocalStorageState('ashara_stock_ledger', INITIAL_STOCK_LEDGER_ENTRIES);
  const [chartOfAccounts] = useState(INITIAL_CHART_OF_ACCOUNTS);
  const [glEntries, setGlEntries] = useLocalStorageState('ashara_gl_entries', INITIAL_GL_ENTRIES);
  const [journalEntries, setJournalEntries] = useLocalStorageState('ashara_journal_entries', INITIAL_JOURNAL_ENTRIES);

  const [boms] = useLocalStorageState('ashara_boms', INITIAL_BOMS);
  const [workOrders, setWorkOrders] = useLocalStorageState('ashara_work_orders', INITIAL_WORK_ORDERS);
  const [assets, setAssets] = useLocalStorageState('ashara_assets', INITIAL_ASSETS);
  const [opportunities, setOpportunities] = useLocalStorageState('ashara_opportunities', INITIAL_OPPORTUNITIES);
  const [issues, setIssues] = useLocalStorageState('ashara_support_issues', INITIAL_SUPPORT_ISSUES);
  const [subcontractOrders] = useState(INITIAL_SUBCONTRACT_ORDERS);

  // Modal State
  const [inspectingProject, setInspectingProject] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [inspectingDocType, setInspectingDocType] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  // 'newProject' | 'newFfe' | 'newSnag' | 'newInvoice' | 'newPO' | 'newStockEntry' | 'newJournalEntry' | 'newWorkOrder' | 'newAsset' | 'newOpportunity' | 'newIssue'

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'ERPNext Full Suite Ready', message: 'All 12 ERPNext modules (Accounts, Buying, Stock, Manufacturing, Assets, CRM, Support) active.', type: 'info' },
    { id: 2, title: 'Critical Site Snag', message: 'SNG-102: Dali dimming driver buzzing in Villa Al-Manara cove ceiling.', type: 'warning' },
    { id: 3, title: 'Fabrication Milestone', message: 'MFG-WO-2026-005: Chandelier cold bending finished at Al-Quoz forge.', type: 'info' }
  ]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ashara_theme', theme);
  }, [theme]);

  // Persistence is handled by useLocalStorageState (see the state declarations above).

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handlers for Projects
  const handleCreateProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setInspectingProject(updatedProject);
  };

  // Handlers for FF&E
  const handleCreateFfe = (newItem) => {
    setFfeItems(prev => [newItem, ...prev]);
  };

  const handleToggleSample = (id) => {
    setFfeItems(prev => prev.map(item => 
      item.id === id ? { ...item, sampleApproved: !item.sampleApproved } : item
    ));
  };

  const handleUpdateFfeStatus = (id, newStatus) => {
    setFfeItems(prev => prev.map(item => 
      item.id === id ? { ...item, poStatus: newStatus } : item
    ));
  };

  // Handlers for Snags
  const handleCreateSnag = (newSnag) => {
    setSnags(prev => [newSnag, ...prev]);
  };

  const handleUpdateSnagStatus = (id, newStatus) => {
    setSnags(prev => prev.map(snag => 
      snag.id === id ? { ...snag, status: newStatus } : snag
    ));
  };

  // Handlers for Invoices
  const handleCreateInvoice = (newInv) => {
    setInvoices(prev => [newInv, ...prev]);

    // Automatically post ERPNext General Ledger Entries
    const newGleDr = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newInv.issueDate,
      voucher_type: "Sales Invoice",
      voucher_no: newInv.id,
      account: "1120 - Accounts Receivable (Debtors)",
      party_type: "Customer",
      party: newInv.clientName,
      project: newInv.projectId,
      debit: newInv.totalWithTax || newInv.amount * 1.05,
      credit: 0,
      remarks: `Sales Invoice billing: ${newInv.milestone}`
    };

    const newGleCr = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newInv.issueDate,
      voucher_type: "Sales Invoice",
      voucher_no: newInv.id,
      account: "4110 - Architectural & BIM Design Fees",
      party_type: "Customer",
      party: newInv.clientName,
      project: newInv.projectId,
      debit: 0,
      credit: newInv.amount,
      remarks: `Revenue recognition: ${newInv.milestone}`
    };

    setGlEntries(prev => [newGleDr, newGleCr, ...prev]);
  };

  const handleToggleInvoicePaid = (id) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const nextStatus = inv.status === 'Paid' ? 'Pending' : 'Paid';
        
        if (nextStatus === 'Paid') {
          const payGleDr = {
            id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
            posting_date: new Date().toISOString().split('T')[0],
            voucher_type: "Payment Entry",
            voucher_no: `PAY-${inv.id}`,
            account: "1110 - Cash and Bank Balances (Emirates NBD)",
            party_type: "Customer",
            party: inv.clientName,
            project: inv.projectId,
            debit: inv.totalWithTax || inv.amount * 1.05,
            credit: 0,
            remarks: `Payment settlement received for ${inv.id}`
          };
          const payGleCr = {
            id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
            posting_date: new Date().toISOString().split('T')[0],
            voucher_type: "Payment Entry",
            voucher_no: `PAY-${inv.id}`,
            account: "1120 - Accounts Receivable (Debtors)",
            party_type: "Customer",
            party: inv.clientName,
            project: inv.projectId,
            debit: 0,
            credit: inv.totalWithTax || inv.amount * 1.05,
            remarks: `Accounts receivable cleared for ${inv.id}`
          };
          setGlEntries(gPrev => [payGleDr, payGleCr, ...gPrev]);
        }

        return { ...inv, status: nextStatus };
      }
      return inv;
    }));
  };

  // Handlers for Buying
  const handleCreatePO = (newPO) => {
    setPurchaseOrders(prev => [newPO, ...prev]);
  };

  const handleUpdatePOStatus = (poId, nextStatus) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status: nextStatus };
      }
      return po;
    }));
  };

  // Handlers for Stock
  const handleCreateStockEntry = (newEntry) => {
    setStockEntries(prev => [newEntry, ...prev]);

    setStockItems(prev => prev.map(item => {
      const movedItem = newEntry.items.find(i => i.item_code === item.item_code);
      if (movedItem) {
        if (newEntry.purpose === 'Material Transfer') {
          return {
            ...item,
            qty_reserved: item.qty_reserved + movedItem.qty
          };
        } else if (newEntry.purpose === 'Material Issue') {
          return {
            ...item,
            qty_on_hand: Math.max(0, item.qty_on_hand - movedItem.qty)
          };
        } else if (newEntry.purpose === 'Material Receipt') {
          return {
            ...item,
            qty_on_hand: item.qty_on_hand + movedItem.qty
          };
        }
      }
      return item;
    }));

    const stockGle = {
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}`,
      posting_date: newEntry.posting_date,
      voucher_type: "Stock Entry",
      voucher_no: newEntry.id,
      account: "1140 - Project Work In Progress (WIP Fit-out)",
      party_type: "Project",
      party: newEntry.projectName,
      project: newEntry.project,
      debit: newEntry.total_outgoing_value,
      credit: 0,
      remarks: `Stock movement (${newEntry.purpose}) to site staging`
    };
    setGlEntries(prev => [stockGle, ...prev]);
  };

  // Handlers for Accounts (Journal Entry)
  const handleCreateJournalEntry = (newJV) => {
    setJournalEntries(prev => [newJV, ...prev]);

    const newGleRows = newJV.accounts.map((accRow, idx) => ({
      id: `GLE-2026-${Math.floor(100 + Math.random() * 900)}-${idx}`,
      posting_date: newJV.posting_date,
      voucher_type: newJV.voucher_type,
      voucher_no: newJV.id,
      account: accRow.account,
      party_type: accRow.party_type,
      party: accRow.party,
      project: "",
      debit: accRow.debit,
      credit: accRow.credit,
      remarks: newJV.user_remark
    }));

    setGlEntries(prev => [...newGleRows, ...prev]);
  };

  // Handlers for Manufacturing (Work Orders)
  const handleCreateWorkOrder = (newWO) => {
    setWorkOrders(prev => [newWO, ...prev]);
  };

  const handleUpdateWorkOrderStatus = (woId, nextStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === woId) {
        return { ...wo, status: nextStatus, progress: nextStatus === 'Completed' ? 100 : wo.progress };
      }
      return wo;
    }));
  };

  // Handlers for Fixed Assets
  const handleCreateAsset = (newAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  // Handlers for CRM Opportunities
  const handleCreateOpportunity = (newOpp) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleUpdateOpportunityStage = (oppId, nextStage) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === oppId) {
        return { ...opp, stage: nextStage };
      }
      return opp;
    }));
  };

  // Handlers for Support Tickets
  const handleCreateIssue = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleUpdateIssueStatus = (issueId, nextStatus) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, status: nextStatus };
      }
      return issue;
    }));
  };

  // Close the top-most open overlay on Escape (docs/PLAN.md §L4 a11y)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (activeModal) setActiveModal(null);
      else if (inspectingProject) setInspectingProject(null);
      else if (inspectingDocType) setInspectingDocType(null);
      else if (printingInvoice) setPrintingInvoice(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, inspectingProject, inspectingDocType, printingInvoice]);

  const openSnagsCount = snags.filter(s => s.status !== 'Approved & Closed').length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        counts={{
          projects: projects.length,
          ffe: ffeItems.length,
          snags: snags.length,
          openSnags: openSnagsCount,
          invoices: invoices.length,
          buying: purchaseOrders.length,
          stock: stockItems.length,
          manufacturing: workOrders.length,
          assets: assets.length,
          opportunities: opportunities.length,
          issues: issues.length,
          clients: clients.length
        }}
      />

      {/* Main Layout Area */}
      <div className="main-content">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenNewProject={() => setActiveModal('newProject')}
          onOpenNewFfe={() => setActiveModal('newFfe')}
          onOpenNewSnag={() => setActiveModal('newSnag')}
          onOpenNewInvoice={() => setActiveModal('newInvoice')}
          onOpenNewPO={() => setActiveModal('newPO')}
          onOpenNewStockEntry={() => setActiveModal('newStockEntry')}
          onOpenNewJournalEntry={() => setActiveModal('newJournalEntry')}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
        />

        {/* View Routing */}
        <ViewRouter
          currentView={currentView}
          setCurrentView={setCurrentView}
          openModal={setActiveModal}
          data={{
            projects,
            ffeItems,
            snags,
            invoices,
            purchaseOrders,
            suppliers,
            stockItems,
            warehouses,
            stockEntries,
            stockLedgerEntries,
            workOrders,
            boms,
            assets,
            opportunities,
            issues,
            subcontractOrders,
            clients,
            glEntries,
            journalEntries,
            chartOfAccounts,
          }}
          handlers={{
            onSelectProject: (p) => setInspectingProject(p),
            onToggleSample: handleToggleSample,
            onUpdateFfeStatus: handleUpdateFfeStatus,
            onUpdateSnagStatus: handleUpdateSnagStatus,
            onToggleInvoicePaid: handleToggleInvoicePaid,
            onOpenPrintInvoice: (inv) => setPrintingInvoice(inv),
            onUpdatePOStatus: handleUpdatePOStatus,
            onUpdateWorkOrderStatus: handleUpdateWorkOrderStatus,
            onUpdateOpportunityStage: handleUpdateOpportunityStage,
            onUpdateIssueStatus: handleUpdateIssueStatus,
            onOpenDocTypeInspector: (dt) => setInspectingDocType(dt || 'sales_invoice'),
            onOpenNewClient: () =>
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  title: 'Client onboarding',
                  message: 'The new-client form is not yet available.',
                  type: 'info',
                },
                ...prev,
              ]),
          }}
        />
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
      {inspectingProject && (
        <ProjectDetailModal
          project={inspectingProject}
          onClose={() => setInspectingProject(null)}
          ffeItems={ffeItems}
          snags={snags}
          invoices={invoices}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {inspectingDocType && (
        <DocTypeInspectorModal
          initialDocType={inspectingDocType}
          onClose={() => setInspectingDocType(null)}
        />
      )}

      {activeModal === 'newProject' && (
        <NewProjectModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateProject}
          clients={clients}
        />
      )}

      {activeModal === 'newFfe' && (
        <NewFfeModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateFfe}
          projects={projects}
        />
      )}

      {activeModal === 'newSnag' && (
        <NewSnagModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateSnag}
          projects={projects}
        />
      )}

      {activeModal === 'newInvoice' && (
        <NewInvoiceModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateInvoice}
          projects={projects}
        />
      )}

      {activeModal === 'newPO' && (
        <NewPurchaseOrderModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreatePO}
          suppliers={suppliers}
          projects={projects}
          warehouses={warehouses}
        />
      )}

      {activeModal === 'newStockEntry' && (
        <NewStockEntryModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateStockEntry}
          stockItems={stockItems}
          warehouses={warehouses}
          projects={projects}
        />
      )}

      {activeModal === 'newJournalEntry' && (
        <NewJournalEntryModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateJournalEntry}
          accountsList={chartOfAccounts}
          clients={clients}
          suppliers={suppliers}
        />
      )}

      {activeModal === 'newWorkOrder' && (
        <NewWorkOrderModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateWorkOrder}
          boms={boms}
          projects={projects}
          warehouses={warehouses}
        />
      )}

      {activeModal === 'newAsset' && (
        <NewAssetModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateAsset}
        />
      )}

      {activeModal === 'newOpportunity' && (
        <NewOpportunityModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateOpportunity}
        />
      )}

      {activeModal === 'newIssue' && (
        <NewSupportIssueModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateIssue}
          clients={clients}
          projects={projects}
        />
      )}

      {printingInvoice && (
        <PrintableInvoiceModal
          invoice={printingInvoice}
          onClose={() => setPrintingInvoice(null)}
        />
      )}
      </Suspense>
    </div>
  );
}
