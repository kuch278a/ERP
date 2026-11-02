import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId } from '../lib/format';

// Form schema mirrors the canonical Opportunity fields (src/schemas/erpnext.js).
const schema = z.object({
  party_name: z.string().trim().min(1, 'Client / prospect is required'),
  opportunity_type: z.string().min(1),
  opportunity_amount: z.coerce.number().positive('Enter an estimated deal value'),
  probability: z.coerce.number().min(0).max(100),
  expected_closing: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  contact_email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
  description: z.string(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

function plusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function NewOpportunityModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      opportunity_type: 'Luxury Residential',
      probability: 60,
      expected_closing: plusDays(45),
      contact_email: '',
      description: '',
    },
  });

  const submit = (data) => {
    onSubmit({
      id: makeDocId('CRM-OPP'),
      party_name: data.party_name,
      opportunity_type: data.opportunity_type,
      opportunity_amount: Number(data.opportunity_amount),
      stage: 'Prospecting',
      probability: Number(data.probability),
      expected_closing: data.expected_closing,
      contact_email: data.contact_email,
      description: data.description || 'High-value bespoke architectural commission enquiry.',
    });
    onClose();
  };

  return (
    <Modal
      title="Log New Opportunity / Bid"
      subtitle="ERPNext CRM Module (DocType: Opportunity)"
      icon={Briefcase}
      onClose={onClose}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="party_name">
              Client / Family Office Prospect *
            </label>
            <input
              id="party_name"
              type="text"
              className="form-input"
              placeholder="e.g. Al-Nahyan Family Office / Villa Palm Jumeirah"
              {...register('party_name')}
            />
            {errors.party_name && (
              <span role="alert" style={fieldError}>
                {errors.party_name.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="opportunity_type">
                Commission Type *
              </label>
              <select id="opportunity_type" className="form-input" {...register('opportunity_type')}>
                <option value="Luxury Residential">Luxury Residential</option>
                <option value="Boutique Hospitality">Boutique Hospitality</option>
                <option value="Private Commercial">Private Commercial</option>
                <option value="Turnkey Yacht Fit-out">Turnkey Yacht Fit-out</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="opportunity_amount">
                Estimated Deal Value ($) *
              </label>
              <input
                id="opportunity_amount"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 7500000"
                className="form-input"
                {...register('opportunity_amount')}
              />
              {errors.opportunity_amount && (
                <span role="alert" style={fieldError}>
                  {errors.opportunity_amount.message}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="probability">
                Win Probability (%)
              </label>
              <input
                id="probability"
                type="range"
                min="10"
                max="100"
                step="5"
                className="form-input"
                style={{ padding: '4px' }}
                {...register('probability')}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expected_closing">
                Expected Decision Date *
              </label>
              <input id="expected_closing" type="date" className="form-input" {...register('expected_closing')} />
              {errors.expected_closing && (
                <span role="alert" style={fieldError}>
                  {errors.expected_closing.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact_email">
              Contact Email
            </label>
            <input
              id="contact_email"
              type="email"
              className="form-input"
              placeholder="vip-desk@familyoffice.ae"
              {...register('contact_email')}
            />
            {errors.contact_email && (
              <span role="alert" style={fieldError}>
                {errors.contact_email.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Scope Description
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={3}
              placeholder="Project brief, total square footage, aesthetic direction..."
              {...register('description')}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Sparkles size={16} />
            <span>Create Opportunity</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
