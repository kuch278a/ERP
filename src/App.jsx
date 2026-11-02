import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewRouter from './components/ViewRouter';
import ModalRouter from './components/ModalRouter';
import { useEstate } from './hooks/useEstate';

// URL-addressable views (deep links — docs/PLAN.md §L4 routing)
const KNOWN_VIEWS = new Set([
  'dashboard', 'projects', 'ffe', 'snags', 'financials', 'buying', 'stock',
  'manufacturing', 'assets', 'crm', 'support', 'erpnext_desk', 'clients',
  'moodboards', 'materials', 'team',
]);

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

  // Domain state + handlers (docs/PLAN.md §L4 decomposition)
  const estate = useEstate();
  const {
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
  } = estate.values;
  const { handlers } = estate;

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

  // Project update also refreshes the open detail modal.
  const handleUpdateProject = (updatedProject) => {
    estate.setters.setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    setInspectingProject(updatedProject);
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
            onToggleSample: handlers.handleToggleSample,
            onUpdateFfeStatus: handlers.handleUpdateFfeStatus,
            onUpdateSnagStatus: handlers.handleUpdateSnagStatus,
            onToggleInvoicePaid: handlers.handleToggleInvoicePaid,
            onOpenPrintInvoice: (inv) => setPrintingInvoice(inv),
            onUpdatePOStatus: handlers.handleUpdatePOStatus,
            onUpdateWorkOrderStatus: handlers.handleUpdateWorkOrderStatus,
            onUpdateOpportunityStage: handlers.handleUpdateOpportunityStage,
            onUpdateIssueStatus: handlers.handleUpdateIssueStatus,
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
      <ModalRouter
        state={{ inspectingProject, inspectingDocType, activeModal, printingInvoice }}
        data={{ ffeItems, snags, invoices, clients, projects, suppliers, warehouses, stockItems, boms, chartOfAccounts }}
        handlers={{
          closeModal: () => setActiveModal(null),
          closeProjectDetail: () => setInspectingProject(null),
          closeDocType: () => setInspectingDocType(null),
          closePrint: () => setPrintingInvoice(null),
          onUpdateProject: handleUpdateProject,
          create: {
            project: handlers.handleCreateProject,
            ffe: handlers.handleCreateFfe,
            snag: handlers.handleCreateSnag,
            invoice: handlers.handleCreateInvoice,
            po: handlers.handleCreatePO,
            stockEntry: handlers.handleCreateStockEntry,
            journalEntry: handlers.handleCreateJournalEntry,
            workOrder: handlers.handleCreateWorkOrder,
            asset: handlers.handleCreateAsset,
            opportunity: handlers.handleCreateOpportunity,
            issue: handlers.handleCreateIssue,
          },
        }}
      />
    </div>
  );
}
