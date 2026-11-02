import React from 'react';
import { Receipt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate, VAT_RATE } from '../lib/format';

// Form schema mirrors the canonical Invoice fields (src/schemas/atelier.js).
const schema = z.object({
  projectId: z.string().min(1),
  milestone: z.string().trim().min(1, 'Milestone / scope draw is required'),
  amount: z.coerce.number().positive('Enter a milestone fee'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  status: z.string().min(1),
  paymentMethod: z.string().trim().min(1, 'Payment method is required'),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewInvoiceModal({ onClose, onSubmit, projects }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: projects[0]?.id || '',
      milestone: 'Phase 2: 3D Visualizations & VR Experience Sign-off',
      amount: 120000,
      dueDate: '2026-11-20',
      status: 'Pending',
      paymentMethod: 'Wire Transfer',
    },
  });

  const submit = (data) => {
    const matchedProject = projects.find((p) => p.id === data.projectId);
    const amount = Number(data.amount);
    onSubmit({
      ...data,
      id: makeDocId('INV'),
      projectName: matchedProject?.name || 'Ashara Commission',
      clientName: matchedProject?.client || 'VIP Client',
      issueDate: toIsoDate(),
      taxRate: VAT_RATE * 100,
      totalWithTax: Math.round(amount * (1 + VAT_RATE)),
    });
    onClose();
  };

  return (
    <Modal title="Generate Milestone Fee Invoice" icon={Receipt} onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="projectId">
              Commission Project
            </label>
            <select id="projectId" className="form-input" {...register('projectId')}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.client})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="milestone">
              Architectural Milestone / Scope Draw
            </label>
            <input id="milestone" type="text" className="form-input" {...register('milestone')} />
            {errors.milestone && (
              <span role="alert" style={fieldError}>
                {errors.milestone.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="amount">
                Milestone Fee Draw ($)
              </label>
              <input id="amount" type="number" className="form-input" {...register('amount')} />
              {errors.amount && (
                <span role="alert" style={fieldError}>
                  {errors.amount.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">
                Payment Due Date
              </label>
              <input id="dueDate" type="date" className="form-input" {...register('dueDate')} />
              {errors.dueDate && (
                <span role="alert" style={fieldError}>
                  {errors.dueDate.message}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Initial Status
              </label>
              <select id="status" className="form-input" {...register('status')}>
                <option value="Pending">Pending (Sent to Client)</option>
                <option value="Paid">Paid / Settled</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="paymentMethod">
                Payment Method
              </label>
              <input id="paymentMethod" type="text" className="form-input" {...register('paymentMethod')} />
              {errors.paymentMethod && (
                <span role="alert" style={fieldError}>
                  {errors.paymentMethod.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Receipt size={16} />
            <span>Issue Tax Invoice</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
