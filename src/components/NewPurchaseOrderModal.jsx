import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { z } from 'zod';
import Modal from './ui/Modal';
import { makeDocId, toIsoDate } from '../lib/format';

const poSchema = z.object({
  supplier: z.string().min(1, 'Select a supplier'),
  project: z.string().min(1, 'Select a project'),
  schedule_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  set_warehouse: z.string().min(1),
  items: z
    .array(
      z.object({
        item_code: z.string().trim().min(1, 'Item code is required'),
        item_name: z.string().trim().min(1, 'Description is required'),
        qty: z.number().positive('Quantity must be at least 1'),
        uom: z.string().min(1),
        rate: z.number().nonnegative(),
        warehouse: z.string().min(1),
      })
    )
    .min(1, 'Add at least one line item.'),
});

export default function NewPurchaseOrderModal({ onClose, onSubmit, suppliers, projects, warehouses }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'WH-DEPOT-01');
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [currency] = useState('USD');
  const [items, setItems] = useState([
    {
      item_code: 'MAT-TRV-02',
      item_name: 'Calacatta Michelangelo Vein-Matched Marble',
      qty: 45,
      uom: 'm²',
      rate: 380,
      warehouse: warehouses[0]?.id || 'WH-DEPOT-01',
    },
  ]);
  const [formError, setFormError] = useState('');

  const selectedSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
  const selectedProject = projects.find((p) => p.id === projectId) || projects[0];

  const handleAddItem = () => {
    setItems([...items, { item_code: '', item_name: '', qty: 1, uom: 'Nos', rate: 0, warehouse: warehouseId }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = poSchema.safeParse({
      supplier: supplierId,
      project: projectId,
      schedule_date: scheduleDate,
      set_warehouse: warehouseId,
      items: items.map((item) => ({
        ...item,
        qty: Number(item.qty) || 0,
        rate: Number(item.rate) || 0,
      })),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0].message);
      return;
    }
    setFormError('');

    onSubmit({
      id: makeDocId('PO'),
      naming_series: 'PO-2026-',
      supplier: selectedSupplier.id,
      supplier_name: selectedSupplier.supplier_name,
      project: selectedProject.id,
      projectName: selectedProject.name,
      transaction_date: toIsoDate(),
      schedule_date: parsed.data.schedule_date,
      set_warehouse: parsed.data.set_warehouse,
      status: 'To Receive and Bill',
      docstatus: 1,
      currency,
      total_qty: totalQty,
      total: totalAmount,
      items: parsed.data.items.map((item) => ({ ...item, amount: item.qty * item.rate })),
    });
    onClose();
  };

  return (
    <Modal title="New Purchase Order" subtitle="ERPNext Buying Module (DocType: Purchase Order)" icon={ShoppingBag} onClose={onClose} maxWidth="820px">
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="supplierId">
                Supplier / Atelier *
              </label>
              <select id="supplierId" className="form-input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.supplier_name} ({s.country} • {s.supplier_group})
                  </option>
                ))}
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
            <div className="form-group">
              <label className="form-label" htmlFor="scheduleDate">
                Required By (Site Delivery Date) *
              </label>
              <input id="scheduleDate" type="date" className="form-input" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="warehouseId">
                Destination Warehouse / Staging *
              </label>
              <select id="warehouseId" className="form-input" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.warehouse_name} ({w.warehouse_type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>
                Purchase Order Items (Child Table: Purchase Order Item)
              </label>
              <button type="button" className="btn-secondary btn-sm" onClick={handleAddItem} style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                <Plus size={14} />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Item Code</th>
                    <th style={{ width: '38%' }}>Description / Name</th>
                    <th style={{ width: '12%' }}>Qty</th>
                    <th style={{ width: '10%' }}>UOM</th>
                    <th style={{ width: '14%' }}>Unit Rate ($)</th>
                    <th style={{ width: '4%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.item_code}
                          onChange={(e) => handleItemChange(idx, 'item_code', e.target.value)}
                          placeholder="e.g. MAT-TRV-02"
                          aria-label={`Item code ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.item_name}
                          onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                          placeholder="Specification description"
                          aria-label={`Description ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          aria-label={`Quantity ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.uom}
                          onChange={(e) => handleItemChange(idx, 'uom', e.target.value)}
                          aria-label={`Unit of measure ${idx + 1}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          aria-label={`Unit rate ${idx + 1}`}
                        />
                      </td>
                      <td>
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '6px', color: 'var(--status-danger)' }}
                            onClick={() => handleRemoveItem(idx)}
                            aria-label={`Delete line item ${idx + 1}`}
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
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Total Units: <strong style={{ color: 'var(--text-primary)' }}>{totalQty}</strong>
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Total Valuation:{' '}
                <strong style={{ fontSize: '18px', color: 'var(--gold-bright)' }}>
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            <span>Submit Purchase Order (PO)</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
