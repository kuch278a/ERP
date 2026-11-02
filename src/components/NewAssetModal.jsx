import React from 'react';
import { Building2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

const assetFormSchema = z.object({
  asset_name: z.string().trim().min(1, 'Asset name is required'),
  asset_category: z.string().min(1),
  gross_purchase_amount: z.coerce.number().positive('Enter a positive amount'),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  total_number_of_depreciations: z.coerce
    .number()
    .int()
    .min(12, 'Useful life must be at least 12 months')
    .max(240, 'Useful life must be at most 240 months'),
  location: z.string().trim().min(1, 'Location is required'),
});

const fieldErrorStyle = { color: 'var(--status-danger)', fontSize: '12px', marginTop: '4px' };

export default function NewAssetModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      asset_category: 'Fabrication Machinery',
      purchase_date: toIsoDate(),
      location: 'Al-Quoz Fabrication Atelier',
      total_number_of_depreciations: 60,
    },
  });

  const submit = (data) => {
    const amount = Number(data.gross_purchase_amount);
    onSubmit({
      id: makeDocId('ASS'),
      asset_name: data.asset_name,
      asset_category: data.asset_category,
      item_code: makeDocId('EQUIP'),
      purchase_date: data.purchase_date,
      gross_purchase_amount: amount,
      depreciation_method: 'Straight Line',
      total_number_of_depreciations: Number(data.total_number_of_depreciations),
      value_after_depreciation: amount,
      location: data.location,
      status: 'Submitted',
    });
    onClose();
  };

  return (
    <Modal
      title="Register Capital Fixed Asset"
      subtitle="ERPNext Assets Module (DocType: Asset)"
      icon={Building2}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="asset_name">
              Asset Name / Equipment Title *
            </label>
            <input
              id="asset_name"
              type="text"
              className="form-input"
              placeholder="e.g. Scantech 3D Optical Laser Material Scanner"
              {...register('asset_name')}
            />
            {errors.asset_name && (
              <span role="alert" style={fieldErrorStyle}>
                {errors.asset_name.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="asset_category">
                Asset Category *
              </label>
              <select id="asset_category" className="form-input" {...register('asset_category')}>
                <option value="Fabrication Machinery">Fabrication Machinery</option>
                <option value="IT & 3D Compute">IT & 3D Compute</option>
                <option value="Studio Showroom Fixtures">Studio Showroom Fixtures</option>
                <option value="Fleet Vehicles">Fleet Vehicles</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gross_purchase_amount">
                Gross Acquisition Cost ($) *
              </label>
              <input
                id="gross_purchase_amount"
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 85000"
                className="form-input"
                {...register('gross_purchase_amount')}
              />
              {errors.gross_purchase_amount && (
                <span role="alert" style={fieldErrorStyle}>
                  {errors.gross_purchase_amount.message}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="purchase_date">
                Commission Date *
              </label>
              <input id="purchase_date" type="date" className="form-input" {...register('purchase_date')} />
              {errors.purchase_date && (
                <span role="alert" style={fieldErrorStyle}>
                  {errors.purchase_date.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="total_number_of_depreciations">
                Useful Life (Months) *
              </label>
              <input
                id="total_number_of_depreciations"
                type="number"
                min="12"
                max="240"
                className="form-input"
                {...register('total_number_of_depreciations')}
              />
              {errors.total_number_of_depreciations && (
                <span role="alert" style={fieldErrorStyle}>
                  {errors.total_number_of_depreciations.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Physical Studio Location *
            </label>
            <input id="location" type="text" className="form-input" {...register('location')} />
            {errors.location && (
              <span role="alert" style={fieldErrorStyle}>
                {errors.location.message}
              </span>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Sparkles size={16} />
            <span>Capitalize Asset in Register</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
