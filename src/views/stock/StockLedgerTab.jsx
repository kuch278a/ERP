import React from 'react';
import { ShieldCheck, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function StockLedgerTab({
  entries,
  warehouses,
  totalInwardValue,
  totalOutwardValue,
  formatCurrency,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Summary Strip */}
      <div className="panel-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197,160,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-bright)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>Perpetual Inventory Audit Trail (FIFO Valuation)</h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ERPNext DocType: <code>Stock Ledger Entry</code> • Real-time moving rate & quantity balances</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowDownLeft size={16} style={{ color: 'var(--status-success)' }} />
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inward Value</span>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--status-success)', fontFamily: 'monospace' }}>
                +{formatCurrency(totalInwardValue)}
              </div>
            </div>
          </div>
          <div style={{ height: '28px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={16} style={{ color: 'var(--status-danger)' }} />
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outward Value</span>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--status-danger)', fontFamily: 'monospace' }}>
                -{formatCurrency(totalOutwardValue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Ledger Table */}
      <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ margin: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Voucher Ref</th>
                <th>Item & SKU</th>
                <th>Warehouse Node</th>
                <th style={{ textAlign: 'right' }}>Qty Change</th>
                <th style={{ textAlign: 'right' }}>Inward Rate ($)</th>
                <th style={{ textAlign: 'right' }}>Balance Qty</th>
                <th style={{ textAlign: 'right' }}>Valuation Rate ($)</th>
                <th style={{ textAlign: 'right' }}>Balance Value ($)</th>
                <th>Batch / Project</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(sle => (
                <tr key={sle.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '12px' }}>{sle.posting_date}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{sle.posting_time}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace', fontSize: '12px' }}>
                        {sle.voucher_no}
                      </span>
                      <span className={`badge badge-${
                        sle.voucher_type === 'Purchase Receipt' ? 'success' :
                        sle.voucher_type === 'Material Transfer' ? 'info' :
                        sle.voucher_type === 'Work Order Issue' ? 'warning' : 'gold'
                      }`} style={{ fontSize: '10px', marginTop: '2px', width: 'fit-content' }}>
                        {sle.voucher_type}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '12.5px' }}>{sle.item_name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>{sle.item_code}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {warehouses.find(w => w.id === sle.warehouse)?.warehouse_name || sle.warehouse}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: sle.actual_qty > 0 ? 'var(--status-success)' : 'var(--status-danger)'
                    }}>
                      {sle.actual_qty > 0 ? `+${sle.actual_qty}` : sle.actual_qty}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {sle.incoming_rate > 0 ? formatCurrency(sle.incoming_rate) : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {sle.qty_after_transaction}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--gold-bright)' }}>
                    {formatCurrency(sle.valuation_rate)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                    {formatCurrency(sle.stock_value)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{sle.batch_no || 'Standard'}</span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{sle.project}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

