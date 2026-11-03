import React from 'react';

export default function GeneralLedgerTab({
  glEntries,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(197,160,89,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>General Ledger Audit Trail</h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ERPNext DocType: <code>GL Entry</code> • Immutable transactional postings</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-info" style={{ fontSize: '11px' }}>
            Double-Entry Verified: Σ Dr = Σ Cr
          </span>
        </div>
      </div>

      <div className="table-container" style={{ margin: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Posting Date</th>
              <th>Voucher #</th>
              <th>Account Head</th>
              <th>Party / Entity</th>
              <th>Project</th>
              <th style={{ textAlign: 'right' }}>Debit ($)</th>
              <th style={{ textAlign: 'right' }}>Credit ($)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {glEntries.map((gle) => (
              <tr key={gle.id}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{gle.posting_date}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gold-bright)', fontFamily: 'monospace', fontSize: '12px' }}>
                      {gle.voucher_no}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{gle.voucher_type}</span>
                  </div>
                </td>
                <td style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '12.5px' }}>
                  {gle.account}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {gle.party ? `${gle.party_type ? gle.party_type + ': ' : ''}${gle.party}` : '—'}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '11.5px', fontFamily: 'monospace' }}>
                  {gle.project || '—'}
                </td>
                <td style={{ textAlign: 'right', fontWeight: gle.debit > 0 ? '700' : '400', color: gle.debit > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {gle.debit > 0 ? formatCurrency(gle.debit) : '—'}
                </td>
                <td style={{ textAlign: 'right', fontWeight: gle.credit > 0 ? '700' : '400', color: gle.credit > 0 ? 'var(--gold-bright)' : 'var(--text-muted)' }}>
                  {gle.credit > 0 ? formatCurrency(gle.credit) : '—'}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '11.5px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {gle.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

