import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId } from '../lib/format';

// Form schema mirrors the canonical FfeItem fields (src/schemas/atelier.js).
const schema = z.object({
  specCode: z.string().trim().min(1, 'Spec code is required'),
  category: z.string().min(1),
  name: z.string().trim().min(1, 'Item description is required'),
  projectId: z.string().min(1),
  room: z.string(),
  vendor: z.string(),
  leadTime: z.string(),
  unitCost: z.coerce.number().nonnegative(),
  markupPct: z.coerce.number().min(0),
  finish: z.string(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewFfeModal({ onClose, onSubmit, projects }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      specCode: 'FFE-2026-099',
      category: 'Loose Furniture',
      room: 'Main Living Hall',
      projectId: projects[0]?.id || '',
      leadTime: '8-10 weeks',
      unitCost: 5000,
      markupPct: 35,
      vendor: '',
      finish: '',
    },
  });

  const submit = (data) => {
    const matchedProject = projects.find((p) => p.id === data.projectId);
    const clientPrice = Math.round(Number(data.unitCost) * (1 + Number(data.markupPct) / 100));
    onSubmit({
      ...data,
      id: makeDocId('FFE'),
      projectName: matchedProject?.name || 'Ashara Project',
      clientPrice,
      qty: 1,
      dimensions: '',
      notes: '',
      sampleApproved: false,
      poStatus: 'Spec Draft',
    });
    onClose();
  };

  return (
    <Modal title="Add FF&E Specification Item" icon={Plus} onClose={onClose} maxWidth="720px">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="specCode">
                Spec Code
              </label>
              <input id="specCode" type="text" className="form-input" {...register('specCode')} />
              {errors.specCode && (
                <span role="alert" style={fieldError}>
                  {errors.specCode.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select id="category" className="form-input" {...register('category')}>
                <option value="Loose Furniture">Loose Furniture</option>
                <option value="Bespoke Lighting">Bespoke Lighting</option>
                <option value="Stone & Finishes">Stone & Finishes</option>
                <option value="Millwork & Joinery">Millwork & Joinery</option>
                <option value="Sanitaryware">Sanitaryware</option>
                <option value="Textiles & Rugs">Textiles & Rugs</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Item Description / Model Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Sculptural Travertine Plinth Cocktail Table"
              className="form-input"
              {...register('name')}
            />
            {errors.name && (
              <span role="alert" style={fieldError}>
                {errors.name.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="projectId">
                Commission Project
              </label>
              <select id="projectId" className="form-input" {...register('projectId')}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="room">
                Spatial Zone / Room
              </label>
              <input id="room" type="text" placeholder="e.g. Master Suite / Formal Majlis" className="form-input" {...register('room')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="vendor">
                Vendor / Atelier Source
              </label>
              <input id="vendor" type="text" placeholder="e.g. Minotti Studio / Henge Florence" className="form-input" {...register('vendor')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="leadTime">
                Lead Time
              </label>
              <input id="leadTime" type="text" placeholder="e.g. 10 weeks (Milan)" className="form-input" {...register('leadTime')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="unitCost">
                Trade Unit Cost ($)
              </label>
              <input id="unitCost" type="number" className="form-input" {...register('unitCost')} />
              {errors.unitCost && (
                <span role="alert" style={fieldError}>
                  {errors.unitCost.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="markupPct">
                Markup %
              </label>
              <input id="markupPct" type="number" className="form-input" {...register('markupPct')} />
              {errors.markupPct && (
                <span role="alert" style={fieldError}>
                  {errors.markupPct.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="finish">
              Finish & Material Specification
            </label>
            <textarea
              id="finish"
              rows={2}
              placeholder="e.g. Unfilled open-pore Roman Travertine, brushed brass base with clear matte polyurethane coat..."
              className="form-input"
              {...register('finish')}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Plus size={16} />
            <span>Save FF&E Spec</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
