import React from 'react';
import { Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId } from '../lib/format';

// Form schema mirrors the canonical Project fields (src/schemas/atelier.js).
const schema = z.object({
  name: z.string().trim().min(1, 'Project title is required'),
  type: z.string().min(1),
  client: z.string().min(1),
  location: z.string(),
  area: z.string(),
  totalBudget: z.coerce.number().nonnegative(),
  designFee: z.coerce.number().nonnegative(),
  leadArchitect: z.string().min(1),
  targetHandover: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  aesthetic: z.string(),
  image: z.string(),
  description: z.string(),
});

const fieldError = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewProjectModal({ onClose, onSubmit, clients }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'Luxury Residential Villa',
      client: clients[0]?.name || '',
      totalBudget: 5000000,
      designFee: 400000,
      leadArchitect: 'Sarah Al-Mansoor',
      targetHandover: '2027-06-30',
      image: '/images/villa-interior.jpg',
      aesthetic: 'Warm Travertine Minimalist',
      description: '',
    },
  });

  const submit = (data) => {
    onSubmit({
      ...data,
      id: makeDocId('PRJ'),
      stage: 'Concept & Moodboards',
      progress: 10,
      health: 'On Track',
      invoicedAmount: 0,
      phases: [
        { name: 'Concept & Moodboards', status: 'In Progress', date: 'Now' },
        { name: 'Schematic & 3D Visualization', status: 'Pending', date: 'Next Month' },
        { name: 'Technical BIM & CAD Detailing', status: 'Pending', date: '+3 Months' },
        { name: 'BOQ & Procurement', status: 'Pending', date: '+5 Months' },
        { name: 'Site Fit-Out & Execution', status: 'Pending', date: '+8 Months' },
        { name: 'Snagging & Handover', status: 'Pending', date: data.targetHandover },
      ],
      roomSchedule: ['Grand Foyer', 'Main Salon', 'Master Sanctuary', 'Terrace Suite'],
    });
    onClose();
  };

  return (
    <Modal title="Commission New Architectural Project" icon={Sparkles} onClose={onClose} maxWidth="720px">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Project Title / Residence Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. The Elysium Coastal Estate"
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
              <label className="form-label" htmlFor="type">
                Typology
              </label>
              <select id="type" className="form-input" {...register('type')}>
                <option value="Luxury Residential Villa">Luxury Residential Villa</option>
                <option value="Ultra-Luxury Penthouse">Ultra-Luxury Penthouse</option>
                <option value="Hospitality & Wellness Resort">Hospitality & Wellness Resort</option>
                <option value="Boutique Commercial HQ">Boutique Commercial HQ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="client">
                Client Principal
              </label>
              <select id="client" className="form-input" {...register('client')}>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Location / Sector
              </label>
              <input id="location" type="text" placeholder="e.g. Palm Jumeirah, Frond N" className="form-input" {...register('location')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="area">
                Built Area
              </label>
              <input id="area" type="text" placeholder="e.g. 1,200 m² / 12,900 sq ft" className="form-input" {...register('area')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="totalBudget">
                Total Commission Budget ($)
              </label>
              <input id="totalBudget" type="number" className="form-input" {...register('totalBudget')} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="designFee">
                Ashara Design & BIM Fee ($)
              </label>
              <input id="designFee" type="number" className="form-input" {...register('designFee')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="leadArchitect">
                Lead Architect
              </label>
              <select id="leadArchitect" className="form-input" {...register('leadArchitect')}>
                <option value="Sarah Al-Mansoor">Sarah Al-Mansoor (Principal)</option>
                <option value="Julian Vance">Julian Vance (Senior)</option>
                <option value="Dr. Omar Farooq">Dr. Omar Farooq (Hospitality Lead)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="targetHandover">
                Target Handover
              </label>
              <input id="targetHandover" type="date" className="form-input" {...register('targetHandover')} />
              {errors.targetHandover && (
                <span role="alert" style={fieldError}>
                  {errors.targetHandover.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="aesthetic">
              Aesthetic & Material Identity
            </label>
            <input
              id="aesthetic"
              type="text"
              placeholder="e.g. Warm Travertine Minimalist with Smoked Bronze & Calacatta Oro"
              className="form-input"
              {...register('aesthetic')}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">
              Visual Inspiration Cover
            </label>
            <select id="image" className="form-input" {...register('image')}>
              <option value="/images/villa-interior.jpg">Villa Interior — Honed Travertine & Water Courtyard</option>
              <option value="/images/penthouse-suite.jpg">Obsidian Penthouse — Smoked Oak & Skyline</option>
              <option value="/images/hotel-lobby.jpg">Hotel Lobby — Monumental Fluted Columns & Zen Tree</option>
              <option value="/images/villa-facade.jpg">Modern Facade — Cantilevered Balconies & Sunset Pool</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Architectural Brief & Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Provide client design brief, spatial program, and engineering requirements..."
              className="form-input"
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
            <span>Initialize Project</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
