import React from 'react';
import { Plus } from 'lucide-react';

export default function JournalEntriesTab({
  journalEntries,
  onOpenNewJournalEntry,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(197,160,89,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>Journal Entry Vouchers</h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ERPNext DocType: <code>Journal Entry</code> • Double-entry Dr = Cr records</span>
        </div>
        <button className="btn-primary btn-sm" onClick={onOpenNewJournalEntry}>
          <Plus size={14} />
          <span>New Journal Entry</span>
        </button>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {journalEntries.map(jv => (
          <div key={jv.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace', fontSize: '14px' }}>
                  {jv.id}
                </span>
                <span className="badge badge-info" style={{ fontSize: '11px' }}>{jv.voucher_type}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Date: {jv.posting_date}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>Ref: {jv.cheque_no}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>
                  {jv.status}
                </span>
                <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '14px' }}>
                  {formatCurrency(jv.total_debit)}
                </span>
              </div>
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{jv.user_remark}"
            </p>

            {/* Rows Table */}
            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>Account Head</th>
                    <th>Party</th>
                    <th style={{ textAlign: 'right' }}>Debit ($)</th>
                    <th style={{ textAlign: 'right' }}>Credit ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {jv.accounts?.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.account}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.party || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: row.debit > 0 ? '700' : '400', color: row.debit > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: row.credit > 0 ? '700' : '400', color: row.credit > 0 ? 'var(--gold-bright)' : 'var(--text-muted)' }}>
                        {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

