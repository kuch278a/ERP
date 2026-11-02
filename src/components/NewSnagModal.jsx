import React from 'react';
import { HardHat } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

// Form schema mirrors the canonical Snag fields (src/schemas/atelier.js).
const schema = z.object({
  projectId: z.string().min(1),
  location: z.string().trim().min(1, 'Room / grid axis is required'),
  category: z.string().min(1),
  severity: z.string().min(1),
  contractor: z.string().trim().min(1, 'Trade contractor is required'),
  description: z.string().trim().min(1, 'Observation note is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  rectificationPlan: z.string(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewSnagModal({ onClose, onSubmit, projects }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: projects[0]?.id || '',
      category: 'Stonework & Finishes',
      severity: 'Moderate',
      contractor: 'Apex Bespoke Joinery',
      dueDate: '2026-11-05',
      rectificationPlan: '',
    },
  });

  const submit = (data) => {
    const matchedProject = projects.find((p) => p.id === data.projectId);
    onSubmit({
      ...data,
      id: makeDocId('SNG'),
      projectName: matchedProject?.name || 'Ashara Project',
      status: 'Open',
      dateLogged: toIsoDate(),
      photoUrl: matchedProject?.image || '/images/villa-interior.jpg',
      loggedBy: 'Sarah Al-Mansoor (Principal)',
    });
    onClose();
  };

  return (
    <Modal title="Log Site Inspection Snag / Punch Item" icon={HardHat} onClose={onClose} maxWidth="720px">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <label className="form-label" htmlFor="category">
                Trade Category
              </label>
              <select id="category" className="form-input" {...register('category')}>
                <option value="Stonework & Finishes">Stonework & Finishes</option>
                <option value="Joinery & Millwork">Joinery & Millwork</option>
                <option value="MEP & Automation">MEP & Automation</option>
                <option value="Glazing & Facades">Glazing & Facades</option>
                <option value="Paint & Microcement">Paint & Microcement</option>
                <option value="Landscape & Irrigation">Landscape & Irrigation</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Specific Room / Grid Axis
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. Master Bath Zone 2B (Wall 3)"
                className="form-input"
                {...register('location')}
              />
              {errors.location && (
                <span role="alert" style={fieldError}>
                  {errors.location.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="severity">
                Severity Rating
              </label>
              <select id="severity" className="form-input" {...register('severity')}>
                <option value="Critical">Critical (Structural / MEP / Safety)</option>
                <option value="Moderate">Moderate (Finishes / Alignment)</option>
                <option value="Cosmetic">Cosmetic (Touchup / Polish)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="contractor">
                Assigned Trade Contractor
              </label>
              <input id="contractor" type="text" placeholder="e.g. MarbleCraft Italia LLC" className="form-input" {...register('contractor')} />
              {errors.contractor && (
                <span role="alert" style={fieldError}>
                  {errors.contractor.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">
                Rectification Target Date
              </label>
              <input id="dueDate" type="date" className="form-input" {...register('dueDate')} />
              {errors.dueDate && (
                <span role="alert" style={fieldError}>
                  {errors.dueDate.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Defect Observation & Inspection Note
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="State the observed variance against architectural drawings..."
              className="form-input"
              {...register('description')}
            />
            {errors.description && (
              <span role="alert" style={fieldError}>
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rectificationPlan">
              Required Remedial Action
            </label>
            <input
              id="rectificationPlan"
              type="text"
              placeholder="e.g. Re-level anchors, regrout with color-matched epoxy, buff matte seal..."
              className="form-input"
              {...register('rectificationPlan')}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <HardHat size={16} />
            <span>Issue Snag to Contractor</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
