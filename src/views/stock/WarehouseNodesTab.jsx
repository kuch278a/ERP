import React from 'react';
import { Warehouse as WarehouseIcon, MapPin } from 'lucide-react';

export default function WarehouseNodesTab({
  warehouses,
  stockItems,
  formatCurrency,
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {warehouses.map(w => {
        const itemsInWarehouse = stockItems.filter(i => i.default_warehouse === w.id);
        const warehouseValuation = itemsInWarehouse.reduce((acc, i) => acc + (i.qty_on_hand * i.valuation_rate), 0);

        return (
          <div key={w.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-bright)' }}>
                  <WarehouseIcon size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>{w.warehouse_name}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{w.id}</span>
                </div>
              </div>
              <span className="badge badge-info" style={{ fontSize: '11px' }}>
                {w.warehouse_type}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <MapPin size={14} style={{ color: 'var(--gold-bright)' }} />
              <span>{w.location}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Managed SKUs</span>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
                  {itemsInWarehouse.length} items
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Valuation</span>
                <div style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {formatCurrency(warehouseValuation)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

