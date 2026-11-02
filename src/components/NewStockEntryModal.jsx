import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

const stockEntrySchema = z
  .object({
    stock_entry_type: z.string().min(1),
    from_warehouse: z.string(),
    to_warehouse: z.string(),
    project: z.string().min(1),
    items: z
      .array(
        z.object({
          item_code: z.string().min(1),
          item_name: z.string().min(1),
          qty: z.number().positive('Quantity must be at least 1'),
          uom: z.string(),
          valuation_rate: z.number().nonnegative(),
        })
      )
      .min(1, 'Add at least one stock item.'),
  })
  .refine((v) => v.stock_entry_type !== 'Material Transfer' || v.from_warehouse !== v.to_warehouse, {
    message: 'Source and target warehouse cannot be the same for a transfer.',
    path: ['to_warehouse'],
  });

export default function NewStockEntryModal({ onClose, onSubmit, stockItems, warehouses, projects }) {
  const [purpose, setPurpose] = useState('Material Transfer');
  const [fromWarehouse, setFromWarehouse] = useState(warehouses[0]?.id || 'WH-DEPOT-01');
  const [toWarehouse, setToWarehouse] = useState(warehouses[2]?.id || 'WH-ON-SITE-01');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [items, setItems] = useState([
    {
      item_code: stockItems[0]?.item_code || 'MAT-TRV-01',
      item_name: stockItems[0]?.item_name || 'Honed Roman Travertine Slabs',
      qty: 20,
      uom: stockItems[0]?.stock_uom || 'm²',
      valuation_rate: stockItems[0]?.valuation_rate || 266.67,
    },
  ]);
  const [formError, setFormError] = useState('');

  const handleAddItem = () => {
    const defaultItem = stockItems[0] || {};
    setItems([
      ...items,
      {
        item_code: defaultItem.item_code || '',
        item_name: defaultItem.item_name || '',
        qty: 1,
        uom: defaultItem.stock_uom || 'Nos',
        valuation_rate: defaultItem.valuation_rate || 100,
      },
    ]);
  };

  const handleItemSelect = (index, itemCode) => {
    const selected = stockItems.find((s) => s.item_code === itemCode);
    if (!selected) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      item_code: selected.item_code,
      item_name: selected.item_name,
      uom: selected.stock_uom,
      valuation_rate: selected.valuation_rate,
    };
    setItems(updated);
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...items];
    updated[index].qty = Number(qty) || 1;
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalValue = items.reduce((sum, itm) => sum + itm.qty * itm.valuation_rate, 0);
  const selectedProject = projects.find((p) => p.id === projectId) || projects[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = stockEntrySchema.safeParse({
      stock_entry_type: purpose,
      from_warehouse: purpose === 'Material Receipt' ? '' : fromWarehouse,
      to_warehouse: purpose === 'Material Issue' ? '' : toWarehouse,
      project: projectId,
      items: items.map((itm) => ({ ...itm, qty: Number(itm.qty) || 0 })),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0].message);
      return;
    }
    setFormError('');

    onSubmit({
      id: makeDocId('STE'),
      stock_entry_type: parsed.data.stock_entry_type,
      purpose,
      posting_date: toIsoDate(),
      from_warehouse: parsed.data.from_warehouse,
      to_warehouse: parsed.data.to_warehouse,
      project: selectedProject.id,
      projectName: selectedProject.name,
      total_outgoing_value: totalValue,
      docstatus: 1,
      items: parsed.data.items.map((itm) => ({ ...itm, amount: itm.qty * itm.valuation_rate })),
    });
    onClose();
  };

  return (
    <Modal
      title="Create Stock Entry Movement"
      subtitle="ERPNext Stock Module (DocType: Stock Entry)"
      icon={ArrowRightLeft}
      onClose={onClose}
      maxWidth="800px"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="purpose">
                Movement Purpose *
              </label>
              <select id="purpose" className="form-input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option value="Material Transfer">Material Transfer (Between Depots / Sites)</option>
                <option value="Material Issue">Material Issue (Consumed on Project Site)</option>
                <option value="Material Receipt">Material Receipt (Inward from Quarry / Atelier)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="projectId">
                Project Allocation *
              </label>
              <select id="projectId" className="form-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {purpose !== 'Material Receipt' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fromWarehouse">
                  Source Warehouse (From) *
                </label>
                <select id="fromWarehouse" className="form-input" value={fromWarehouse} onChange={(e) => setFromWarehouse(e.target.value)}>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.warehouse_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {purpose !== 'Material Issue' && (
              <div className="form-group">
                <label className="form-label" htmlFor="toWarehouse">
                  Target Warehouse (To) *
                </label>
                <select id="toWarehouse" className="form-input" value={toWarehouse} onChange={(e) => setToWarehouse(e.target.value)}>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.warehouse_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>
                Stock Items to Move
              </label>
              <button type="button" className="btn-secondary btn-sm" onClick={handleAddItem} style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Select Item from Master</th>
                    <th style={{ width: '15%' }}>Quantity</th>
                    <th style={{ width: '15%' }}>UOM</th>
                    <th style={{ width: '20%' }}>Valuation Cost</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.item_code}
                          onChange={(e) => handleItemSelect(idx, e.target.value)}
                        >
                          {stockItems.map((s) => (
                            <option key={s.item_code} value={s.item_code}>
                              {s.item_code} - {s.item_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.qty}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                        />
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.uom}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gold-bright)', fontWeight: '600' }}>
                          ${(item.qty * item.valuation_rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '6px', color: 'var(--status-danger)' }}
                            onClick={() => handleRemoveItem(idx)}
                            aria-label={`Remove item ${idx + 1}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '14px', background: 'var(--bg-secondary)', padding: '12px 18px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'flex-end', gap: '30px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Total Movement Valuation:{' '}
                <strong style={{ fontSize: '18px', color: 'var(--gold-bright)' }}>
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            style={{
              margin: '0 24px 12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(200,70,48,0.1)',
              border: '1px solid var(--status-danger)',
              color: 'var(--status-danger)',
              fontSize: '12.5px',
            }}
          >
            {formError}
          </div>
        )}

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Sparkles size={16} />
            <span>Post Stock Entry (DocStatus: Submitted)</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
