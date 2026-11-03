import React from 'react';

export default function StockBalanceTab({
  items,
  warehouses,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="table-container" style={{ margin: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Code (SKU)</th>
              <th>Item Name & Atelier</th>
              <th>Category</th>
              <th>Default Staging</th>
              <th>On-Hand Qty</th>
              <th>Reserved (Project)</th>
              <th>In Transit</th>
              <th>Valuation Rate</th>
              <th>Total Asset Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map(itm => {
              const itemTotalValuation = itm.qty_on_hand * itm.valuation_rate;
              const isLow = itm.qty_on_hand <= itm.reorder_level;

              return (
                <tr key={itm.item_code}>
                  <td>
                    <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                      {itm.item_code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{itm.item_name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mfr: {itm.brand}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '11px' }}>
                      {itm.item_group}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {warehouses.find(w => w.id === itm.default_warehouse)?.warehouse_name || itm.default_warehouse}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '700', color: isLow ? 'var(--status-danger)' : 'var(--text-primary)', fontSize: '13px' }}>
                        {itm.qty_on_hand} {itm.stock_uom}
                      </span>
                      {isLow && (
                        <span className="badge badge-danger" style={{ fontSize: '10px', padding: '2px 4px' }}>
                          Reorder
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {itm.qty_reserved} {itm.stock_uom}
                  </td>
                  <td style={{ color: itm.qty_in_transit > 0 ? 'var(--status-info)' : 'var(--text-muted)' }}>
                    {itm.qty_in_transit > 0 ? `${itm.qty_in_transit} ${itm.stock_uom}` : '—'}
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {formatCurrency(itm.valuation_rate)}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                    {formatCurrency(itemTotalValuation)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

