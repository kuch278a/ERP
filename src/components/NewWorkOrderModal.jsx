import React from 'react';
import { Hammer, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

// Form schema mirrors the canonical WorkOrder fields (src/schemas/erpnext.js).
const schema = z.object({
  bom_no: z.string().min(1, 'Select a bill of materials'),
  qty: z.coerce.number().int().positive('Quantity must be at least 1'),
  project: z.string().min(1, 'Select a project'),
  leadCraftsman: z.string().trim().min(1, 'Lead artisan is required'),
  expected_delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

function plusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function NewWorkOrderModal({ onClose, onSubmit, boms, projects, warehouses: _warehouses }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bom_no: boms[0]?.id || '',
      qty: 1,
      project: projects[0]?.id || '',
      leadCraftsman: 'Master Joiner Tobias Henz',
      expected_delivery_date: plusDays(30),
    },
  });

  const submit = (data) => {
    const selectedBom = boms.find((b) => b.id === data.bom_no) || boms[0];
    const selectedProject = projects.find((p) => p.id === data.project) || projects[0];
    onSubmit({
      id: makeDocId('MFG-WO'),
      production_item: selectedBom.item,
      item_name: selectedBom.item_name,
      bom_no: selectedBom.id,
      qty: Number(data.qty),
      project: selectedProject.id,
      projectName: selectedProject.name,
      source_warehouse: 'WH-DEPOT-01',
      wip_warehouse: 'WH-FAB-MILL',
      fg_warehouse: 'WH-ON-SITE-01',
      planned_start_date: toIsoDate(),
      expected_delivery_date: data.expected_delivery_date,
      status: 'In Process',
      docstatus: 1,
      progress: 10,
      leadCraftsman: data.leadCraftsman,
    });
    onClose();
  };

  return (
    <Modal
      title="Create Manufacturing Work Order"
      subtitle="ERPNext Manufacturing (DocType: Work Order)"
      icon={Hammer}
      onClose={onClose}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="bom_no">
              Select Bill of Materials (BOM) *
            </label>
            <select id="bom_no" className="form-input" {...register('bom_no')}>
              {boms.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.item_name} ({b.id})
                </option>
              ))}
            </select>
            {errors.bom_no && (
              <span role="alert" style={fieldError}>
                {errors.bom_no.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="qty">
                Quantity to Produce *
              </label>
              <input id="qty" type="number" min="1" className="form-input" {...register('qty')} />
              {errors.qty && (
                <span role="alert" style={fieldError}>
                  {errors.qty.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project">
                Project Commission *
              </label>
              <select id="project" className="form-input" {...register('project')}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <span role="alert" style={fieldError}>
                  {errors.project.message}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="leadCraftsman">
                Lead Artisan / Craftsman
              </label>
              <input id="leadCraftsman" type="text" className="form-input" {...register('leadCraftsman')} />
              {errors.leadCraftsman && (
                <span role="alert" style={fieldError}>
                  {errors.leadCraftsman.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expected_delivery_date">
                Target Completion Date *
              </label>
              <input
                id="expected_delivery_date"
                type="date"
                className="form-input"
                {...register('expected_delivery_date')}
              />
              {errors.expected_delivery_date && (
                <span role="alert" style={fieldError}>
                  {errors.expected_delivery_date.message}
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
            <Sparkles size={16} />
            <span>Launch Work Order (DocStatus: 1)</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
