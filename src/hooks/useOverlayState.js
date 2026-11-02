import { useState, useEffect } from 'react';

/**
 * Overlay (modal/detail/print) state for the app shell, plus the global
 * Escape-to-close behaviour (docs/PLAN.md §L4 a11y).
 */
export function useOverlayState() {
  const [inspectingProject, setInspectingProject] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [inspectingDocType, setInspectingDocType] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

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

  return {
    inspectingProject,
    setInspectingProject,
    printingInvoice,
    setPrintingInvoice,
    inspectingDocType,
    setInspectingDocType,
    activeModal,
    setActiveModal,
  };
}
