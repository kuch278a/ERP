import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewRouter from './components/ViewRouter';
import ModalRouter from './components/ModalRouter';
import { useEstate } from './hooks/useEstate';
import { useUiState } from './hooks/useUiState';
import { useOverlayState } from './hooks/useOverlayState';

// URL-addressable views (deep links — docs/PLAN.md §L4 routing)
const KNOWN_VIEWS = new Set([
  'dashboard', 'projects', 'ffe', 'snags', 'financials', 'buying', 'stock',
  'manufacturing', 'assets', 'crm', 'support', 'erpnext_desk', 'clients',
  'moodboards', 'materials', 'team',
]);

export default function App() {
  const ui = useUiState();
  const overlay = useOverlayState();
  const estate = useEstate();
  const d = estate.values;
  const { handlers } = estate;

  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname.replace(/^\/+/, '');
  const currentView = KNOWN_VIEWS.has(route) ? route : 'dashboard';
  const setCurrentView = (view) => navigate(`/${view}`);

  // Project update also refreshes the open detail modal.
  const handleUpdateProject = (updatedProject) => {
    estate.setters.setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    overlay.setInspectingProject(updatedProject);
  };

  const openSnagsCount = d.snags.filter((s) => s.status !== 'Approved & Closed').length;

  return (
    <div className="app-container" data-testid="app-root">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        collapsed={ui.sidebarCollapsed}
        setCollapsed={ui.setSidebarCollapsed}
        counts={{
          projects: d.projects.length,
          ffe: d.ffeItems.length,
          snags: d.snags.length,
          openSnags: openSnagsCount,
          invoices: d.invoices.length,
          buying: d.purchaseOrders.length,
          stock: d.stockItems.length,
          manufacturing: d.workOrders.length,
          assets: d.assets.length,
          opportunities: d.opportunities.length,
          issues: d.issues.length,
          clients: d.clients.length,
        }}
      />

      <div className="main-content">
        <Topbar
          searchQuery={ui.searchQuery}
          setSearchQuery={ui.setSearchQuery}
          theme={ui.theme}
          toggleTheme={ui.toggleTheme}
          onOpenNewProject={() => overlay.setActiveModal('newProject')}
          onOpenNewFfe={() => overlay.setActiveModal('newFfe')}
          onOpenNewSnag={() => overlay.setActiveModal('newSnag')}
          onOpenNewInvoice={() => overlay.setActiveModal('newInvoice')}
          onOpenNewPO={() => overlay.setActiveModal('newPO')}
          onOpenNewStockEntry={() => overlay.setActiveModal('newStockEntry')}
          onOpenNewJournalEntry={() => overlay.setActiveModal('newJournalEntry')}
          notifications={ui.notifications}
          onDismissNotification={ui.handleDismissNotification}
        />

        {/* View Routing */}
        <ViewRouter
          currentView={currentView}
          setCurrentView={setCurrentView}
          openModal={overlay.setActiveModal}
          data={{ ...d }}
          handlers={{
            onSelectProject: (p) => overlay.setInspectingProject(p),
            onToggleSample: handlers.handleToggleSample,
            onUpdateFfeStatus: handlers.handleUpdateFfeStatus,
            onUpdateSnagStatus: handlers.handleUpdateSnagStatus,
            onToggleInvoicePaid: handlers.handleToggleInvoicePaid,
            onOpenPrintInvoice: (inv) => overlay.setPrintingInvoice(inv),
            onUpdatePOStatus: handlers.handleUpdatePOStatus,
            onUpdateWorkOrderStatus: handlers.handleUpdateWorkOrderStatus,
            onUpdateOpportunityStage: handlers.handleUpdateOpportunityStage,
            onUpdateIssueStatus: handlers.handleUpdateIssueStatus,
            onOpenDocTypeInspector: (dt) => overlay.setInspectingDocType(dt || 'sales_invoice'),
            onOpenNewClient: () =>
              ui.setNotifications((prev) => [
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
        state={{
          inspectingProject: overlay.inspectingProject,
          inspectingDocType: overlay.inspectingDocType,
          activeModal: overlay.activeModal,
          printingInvoice: overlay.printingInvoice,
        }}
        data={{
          ffeItems: d.ffeItems,
          snags: d.snags,
          invoices: d.invoices,
          clients: d.clients,
          projects: d.projects,
          suppliers: d.suppliers,
          warehouses: d.warehouses,
          stockItems: d.stockItems,
          boms: d.boms,
          chartOfAccounts: d.chartOfAccounts,
        }}
        handlers={{
          closeModal: () => overlay.setActiveModal(null),
          closeProjectDetail: () => overlay.setInspectingProject(null),
          closeDocType: () => overlay.setInspectingDocType(null),
          closePrint: () => overlay.setPrintingInvoice(null),
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
