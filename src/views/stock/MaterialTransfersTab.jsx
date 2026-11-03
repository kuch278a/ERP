import React from 'react';

export default function MaterialTransfersTab({
  stockEntries,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="table-container" style={{ margin: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher ID</th>
              <th>Entry Purpose</th>
              <th>Posting Date</th>
              <th>Source Depot (From)</th>
              <th>Destination (To)</th>
              <th>Project Commission</th>
              <th>Transferred Items</th>
              <th>Total Valuation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map(ste => (
              <tr key={ste.id}>
                <td>
                  <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                    {ste.id}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: '11px' }}>
                    {ste.purpose}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{ste.posting_date}</td>
                <td style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                  {ste.from_warehouse || <span style={{ color: 'var(--text-muted)' }}>Direct Supplier Intake</span>}
                </td>
                <td style={{ color: 'var(--gold-bright)', fontSize: '12px', fontWeight: '600' }}>
                  {ste.to_warehouse || <span style={{ color: 'var(--text-muted)' }}>Project Site Consumption</span>}
                </td>
                <td>
                  <div style={{ color: 'var(--text-primary)' }}>{ste.projectName}</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ste.project}</span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {ste.items?.length || 1} lines
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {ste.items?.map(i => `${i.qty} ${i.uom} ${i.item_code}`).join(', ')}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '13.5px' }}>
                    {formatCurrency(ste.total_outgoing_value)}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success" style={{ fontSize: '11px' }}>
                    Submitted (DocStatus: 1)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

