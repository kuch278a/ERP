import React from 'react';
import { Users, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId } from '../lib/format';

const schema = z.object({
  name: z.string().trim().min(1, 'Client name is required'),
  type: z.string().min(1),
  email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
  phone: z.string().trim(),
  city: z.string().trim(),
  stylePreference: z.string().trim(),
  notes: z.string().trim(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewClientModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'Private Residential (VIP)',
      phone: '',
      email: '',
      city: 'Dubai, UAE',
      stylePreference: 'Warm Minimalist, Italian Travertine, Acoustic Solitude',
      notes: '',
    },
  });

  const submit = (data) => {
    onSubmit({
      id: makeDocId('CLI'),
      name: data.name,
      type: data.type,
      email: data.email || 'client@ashara-atelier.com',
      phone: data.phone || '+971 50 000 0000',
      city: data.city || 'Dubai, UAE',
      stylePreference: data.stylePreference,
      activeProjects: [],
      lifetimeValue: 0,
      status: 'Active - Onboarding',
      notes: data.notes || 'Newly onboarded client commission enquiry.',
    });
    onClose();
  };

  return (
    <Modal
      title="Onboard New Client"
      onClose={onClose}
      icon={Users}
      subtitle="Register a new private or hospitality client profile for atelier briefs."
    >
      <form onSubmit={handleSubmit(submit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="name">
              Client Name / Entity *
            </label>
            <input
              id="name"
              className="form-control"
              placeholder="e.g. Tariq & Reem Al-Ghurair"
              {...register('name')}
            />
            {errors.name && <p style={fieldError}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="type">
              Client Classification
            </label>
            <select id="type" className="form-control" {...register('type')}>
              <option value="Private Residential (VIP)">Private Residential (VIP)</option>
              <option value="Private Residential (HNWI)">Private Residential (HNWI)</option>
              <option value="Boutique Hotel & Resorts">Boutique Hotel & Resorts</option>
              <option value="Private Architectural Estate">Private Architectural Estate</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="city">
              Primary Location / City
            </label>
            <input id="city" className="form-control" placeholder="e.g. Dubai / London" {...register('city')} />
          </div>

          <div>
            <label className="form-label" htmlFor="email">
              Contact Email
            </label>
            <input id="email" type="email" className="form-control" placeholder="client@holdings.ae" {...register('email')} />
            {errors.email && <p style={fieldError}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="phone">
              Direct Phone
            </label>
            <input id="phone" className="form-control" placeholder="+971 50 123 4567" {...register('phone')} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="stylePreference">
              Aesthetic & Style Preference
            </label>
            <input
              id="stylePreference"
              className="form-control"
              placeholder="e.g. Warm Minimalist, Honed Travertine, Fluted Oak"
              {...register('stylePreference')}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="notes">
              Brief & Commission Notes
            </label>
            <textarea
              id="notes"
              className="form-control"
              rows={3}
              placeholder="Key design brief points, delivery preferences, or protocol requirements..."
              {...register('notes')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Sparkles size={16} />
            <span>Complete Onboarding</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

