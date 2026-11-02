import React from 'react';
import { LifeBuoy, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

// Form schema mirrors the canonical SupportIssue fields (src/schemas/erpnext.js).
const schema = z.object({
  subject: z.string().trim().min(1, 'Issue subject is required'),
  customer: z.string().min(1),
  project: z.string().min(1),
  priority: z.string().min(1),
  issue_type: z.string().min(1),
  resolution_details: z.string(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewSupportIssueModal({ onClose, onSubmit, clients, projects }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customer: clients[0]?.name || '',
      project: projects[0]?.id || '',
      priority: 'Medium',
      issue_type: 'Maintenance Service',
      resolution_details: '',
    },
  });

  const submit = (data) => {
    const selectedProject = projects.find((p) => p.id === data.project) || projects[0];
    onSubmit({
      id: makeDocId('ISS'),
      subject: data.subject,
      customer: data.customer,
      project: selectedProject.id,
      projectName: selectedProject.name,
      priority: data.priority,
      issue_type: data.issue_type,
      status: 'Open',
      opening_date: toIsoDate(),
      resolution_details: data.resolution_details || 'Under investigation by atelier client care team.',
    });
    onClose();
  };

  return (
    <Modal
      title="Log Client Warranty & Care Ticket"
      subtitle="ERPNext Support Module (DocType: Issue)"
      icon={LifeBuoy}
      onClose={onClose}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="subject">
              Issue Subject / Service Claim *
            </label>
            <input
              id="subject"
              type="text"
              className="form-input"
              placeholder="e.g. Master Bedroom Acoustic Motorized Drapery Jam"
              {...register('subject')}
            />
            {errors.subject && (
              <span role="alert" style={fieldError}>
                {errors.subject.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="customer">
                Client Head *
              </label>
              <select id="customer" className="form-input" {...register('customer')}>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project">
                Project Handover *
              </label>
              <select id="project" className="form-input" {...register('project')}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                Priority Level *
              </label>
              <select id="priority" className="form-input" {...register('priority')}>
                <option value="Low">Low - Periodic</option>
                <option value="Medium">Medium - Standard (48h)</option>
                <option value="High">High - Priority (24h)</option>
                <option value="Urgent">Urgent - Emergency VIP (4h)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="issue_type">
                Issue Category *
              </label>
              <select id="issue_type" className="form-input" {...register('issue_type')}>
                <option value="Defect Warranty">Defect Warranty</option>
                <option value="Maintenance Service">Maintenance Service</option>
                <option value="Material Wear">Material Wear</option>
                <option value="Automation Tune-up">Automation Tune-up</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="resolution_details">
              Initial Assessment & Action Plan
            </label>
            <textarea
              id="resolution_details"
              className="form-input"
              rows={3}
              placeholder="Technical details of maintenance request or subcontractor dispatch..."
              {...register('resolution_details')}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Sparkles size={16} />
            <span>Log Support Ticket</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
