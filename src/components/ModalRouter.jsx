import React, { lazy, Suspense } from 'react';

const ProjectDetailModal = lazy(() => import('./ProjectDetailModal'));
const NewProjectModal = lazy(() => import('./NewProjectModal'));
const NewFfeModal = lazy(() => import('./NewFfeModal'));
const NewSnagModal = lazy(() => import('./NewSnagModal'));
const NewInvoiceModal = lazy(() => import('./NewInvoiceModal'));
const PrintableInvoiceModal = lazy(() => import('./PrintableInvoiceModal'));
const NewPurchaseOrderModal = lazy(() => import('./NewPurchaseOrderModal'));
const NewStockEntryModal = lazy(() => import('./NewStockEntryModal'));
const NewJournalEntryModal = lazy(() => import('./NewJournalEntryModal'));
const DocTypeInspectorModal = lazy(() => import('./DocTypeInspectorModal'));
const NewWorkOrderModal = lazy(() => import('./NewWorkOrderModal'));
const NewAssetModal = lazy(() => import('./NewAssetModal'));
const NewOpportunityModal = lazy(() => import('./NewOpportunityModal'));
const NewSupportIssueModal = lazy(() => import('./NewSupportIssueModal'));
const NewClientModal = lazy(() => import('./NewClientModal'));

/**
 * Renders the active modal(s) (docs/PLAN.md §L4). `state`, `data`, and `handlers`
 * are supplied by the App shell; each modal is lazy-loaded.
 */
export default function ModalRouter({ state, data, handlers }) {
  const { inspectingProject, inspectingDocType, activeModal, printingInvoice } = state;
  const { ffeItems, snags, invoices, clients, projects, suppliers, warehouses, stockItems, boms, chartOfAccounts } = data;
  const { closeModal, closeProjectDetail, closeDocType, closePrint, onUpdateProject, create } = handlers;

  return (
    <Suspense fallback={null}>
      {inspectingProject && (
        <ProjectDetailModal
          project={inspectingProject}
          onClose={closeProjectDetail}
          ffeItems={ffeItems}
          snags={snags}
          invoices={invoices}
          onUpdateProject={onUpdateProject}
        />
      )}

      {inspectingDocType && (
        <DocTypeInspectorModal initialDocType={inspectingDocType} onClose={closeDocType} />
      )}

      {activeModal === 'newProject' && (
        <NewProjectModal onClose={closeModal} onSubmit={create.project} clients={clients} />
      )}

      {activeModal === 'newFfe' && (
        <NewFfeModal onClose={closeModal} onSubmit={create.ffe} projects={projects} />
      )}

      {activeModal === 'newSnag' && (
        <NewSnagModal onClose={closeModal} onSubmit={create.snag} projects={projects} />
      )}

      {activeModal === 'newInvoice' && (
        <NewInvoiceModal onClose={closeModal} onSubmit={create.invoice} projects={projects} />
      )}

      {activeModal === 'newClient' && (
        <NewClientModal onClose={closeModal} onSubmit={create.client} />
      )}

      {activeModal === 'newPO' && (
        <NewPurchaseOrderModal
          onClose={closeModal}
          onSubmit={create.po}
          suppliers={suppliers}
          projects={projects}
          warehouses={warehouses}
        />
      )}

      {activeModal === 'newStockEntry' && (
        <NewStockEntryModal
          onClose={closeModal}
          onSubmit={create.stockEntry}
          stockItems={stockItems}
          warehouses={warehouses}
          projects={projects}
        />
      )}

      {activeModal === 'newJournalEntry' && (
        <NewJournalEntryModal
          onClose={closeModal}
          onSubmit={create.journalEntry}
          accountsList={chartOfAccounts}
          clients={clients}
          suppliers={suppliers}
        />
      )}

      {activeModal === 'newWorkOrder' && (
        <NewWorkOrderModal
          onClose={closeModal}
          onSubmit={create.workOrder}
          boms={boms}
          projects={projects}
          warehouses={warehouses}
        />
      )}

      {activeModal === 'newAsset' && (
        <NewAssetModal onClose={closeModal} onSubmit={create.asset} />
      )}

      {activeModal === 'newOpportunity' && (
        <NewOpportunityModal onClose={closeModal} onSubmit={create.opportunity} />
      )}

      {activeModal === 'newIssue' && (
        <NewSupportIssueModal
          onClose={closeModal}
          onSubmit={create.issue}
          clients={clients}
          projects={projects}
        />
      )}

      {printingInvoice && (
        <PrintableInvoiceModal invoice={printingInvoice} onClose={closePrint} />
      )}
    </Suspense>
  );
}
