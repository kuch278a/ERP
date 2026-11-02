import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Accessible modal shell: backdrop + dialog with role/aria, focus trap, and
 * focus restore (docs/PLAN.md §L4). Children render inside the dialog.
 */
export default function Modal({
  title,
  subtitle,
  icon: Icon,
  onClose,
  maxWidth = '600px',
  closeOnBackdrop = true,
  children,
}) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef);

  return (
    <div className="modal-backdrop" onClick={closeOnBackdrop ? onClose : undefined}>
      <div
        ref={dialogRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {Icon && (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--gold-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-bright)',
                }}
              >
                <Icon size={18} />
              </div>
            )}
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>
                {title}
              </h3>
              {subtitle && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</span>
              )}
            </div>
          </div>
          <button className="btn-secondary" style={{ padding: '6px' }} onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
