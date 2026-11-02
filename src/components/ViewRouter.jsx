import React, { lazy, Suspense } from 'react';

const DashboardView = lazy(() => import('../views/DashboardView'));
const ProjectsView = lazy(() => import('../views/ProjectsView'));
const FfeScheduleView = lazy(() => import('../views/FfeScheduleView'));
const SiteSnagsView = lazy(() => import('../views/SiteSnagsView'));
const ClientsView = lazy(() => import('../views/ClientsView'));
const MoodboardsView = lazy(() => import('../views/MoodboardsView'));
const MaterialsView = lazy(() => import('../views/MaterialsView'));
const TeamView = lazy(() => import('../views/TeamView'));
const FinancialsView = lazy(() => import('../views/FinancialsView'));
const BuyingView = lazy(() => import('../views/BuyingView'));
const StockView = lazy(() => import('../views/StockView'));
const ManufacturingView = lazy(() => import('../views/ManufacturingView'));
const AssetsView = lazy(() => import('../views/AssetsView'));
const CrmPipelineView = lazy(() => import('../views/CrmPipelineView'));
const SupportMaintenanceView = lazy(() => import('../views/SupportMaintenanceView'));
const ErpnextDeskView = lazy(() => import('../views/ErpnextDeskView'));

/**
 * Renders the active view (docs/PLAN.md §L4). Views are lazy-loaded so each is
 * its own chunk. `data`, `handlers`, and `openModal` are supplied by the App shell.
 */
export default function ViewRouter({ currentView, setCurrentView, openModal, data, handlers }) {
  const {
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
  } = data;

  const {
    onSelectProject,
    onToggleSample,
    onUpdateFfeStatus,
    onUpdateSnagStatus,
    onToggleInvoicePaid,
    onOpenPrintInvoice,
    onUpdatePOStatus,
    onUpdateWorkOrderStatus,
    onUpdateOpportunityStage,
    onUpdateIssueStatus,
    onOpenDocTypeInspector,
    onOpenNewClient,
  } = handlers;

  const deskCounts = {
    projects: projects.length,
    ffe: ffeItems.length,
    snags: snags.length,
    invoices: invoices.length,
    buying: purchaseOrders.length,
    stock: stockItems.length,
    manufacturing: workOrders.length,
    assets: assets.length,
    opportunities: opportunities.length,
    issues: issues.length,
  };

  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading…</div>}>
      {currentView === 'dashboard' && (
        <DashboardView
          projects={projects}
          ffeItems={ffeItems}
          snags={snags}
          invoices={invoices}
          onSelectProject={onSelectProject}
          setCurrentView={setCurrentView}
          onOpenNewProject={() => openModal('newProject')}
        />
      )}

      {currentView === 'projects' && (
        <ProjectsView
          projects={projects}
          ffeItems={ffeItems}
          snags={snags}
          invoices={invoices}
          onSelectProject={onSelectProject}
          onOpenNewProject={() => openModal('newProject')}
        />
      )}

      {currentView === 'ffe' && (
        <FfeScheduleView
          ffeItems={ffeItems}
          onToggleSample={onToggleSample}
          onUpdateStatus={onUpdateFfeStatus}
          onOpenNewFfe={() => openModal('newFfe')}
          projects={projects}
        />
      )}

      {currentView === 'snags' && (
        <SiteSnagsView
          snags={snags}
          onUpdateSnagStatus={onUpdateSnagStatus}
          onOpenNewSnag={() => openModal('newSnag')}
          projects={projects}
        />
      )}

      {currentView === 'financials' && (
        <FinancialsView
          invoices={invoices}
          onTogglePaid={onToggleInvoicePaid}
          onOpenNewInvoice={() => openModal('newInvoice')}
          onOpenPrintInvoice={onOpenPrintInvoice}
          projects={projects}
          glEntries={glEntries}
          journalEntries={journalEntries}
          chartOfAccounts={chartOfAccounts}
          onOpenNewJournalEntry={() => openModal('newJournalEntry')}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'buying' && (
        <BuyingView
          purchaseOrders={purchaseOrders}
          suppliers={suppliers}
          onOpenNewPO={() => openModal('newPO')}
          onUpdatePOStatus={onUpdatePOStatus}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'stock' && (
        <StockView
          stockItems={stockItems}
          warehouses={warehouses}
          stockEntries={stockEntries}
          stockLedgerEntries={stockLedgerEntries}
          onOpenNewStockEntry={() => openModal('newStockEntry')}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'manufacturing' && (
        <ManufacturingView
          workOrders={workOrders}
          boms={boms}
          onOpenNewWorkOrder={() => openModal('newWorkOrder')}
          onUpdateWorkOrderStatus={onUpdateWorkOrderStatus}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'assets' && (
        <AssetsView
          assets={assets}
          onOpenNewAsset={() => openModal('newAsset')}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'crm' && (
        <CrmPipelineView
          opportunities={opportunities}
          onOpenNewOpportunity={() => openModal('newOpportunity')}
          onUpdateOpportunityStage={onUpdateOpportunityStage}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'support' && (
        <SupportMaintenanceView
          issues={issues}
          subcontractOrders={subcontractOrders}
          onOpenNewIssue={() => openModal('newIssue')}
          onUpdateIssueStatus={onUpdateIssueStatus}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'erpnext_desk' && (
        <ErpnextDeskView
          counts={deskCounts}
          setCurrentView={setCurrentView}
          onOpenDocTypeInspector={onOpenDocTypeInspector}
        />
      )}

      {currentView === 'clients' && (
        <ClientsView clients={clients} projects={projects} onOpenNewClient={onOpenNewClient} />
      )}

      {currentView === 'moodboards' && <MoodboardsView />}

      {currentView === 'materials' && <MaterialsView />}

      {currentView === 'team' && <TeamView />}
    </Suspense>
  );
}
