import React from 'react';

export default function TrialBalanceTab({
  trialBalanceRows,
  totalTBDebit,
  totalTBCredit,
  tbDifference,
  handleDrillDownToGL,
  formatCurrency,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Summary Strip */}
      <div className="panel-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>Trial Balance Verification</h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Sum of All Leaf Accounts • Debit & Credit Balance Equilibrium</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Debits</span>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {formatCurrency(totalTBDebit)}
            </div>
          </div>
          <div style={{ height: '30px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Credits</span>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
              {formatCurrency(totalTBCredit)}
            </div>
          </div>
          <div style={{ height: '30px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Difference</span>
            <div style={{ fontSize: '15px', fontWeight: '700', color: tbDifference === 0 ? 'var(--status-success)' : 'var(--status-danger)', fontFamily: 'monospace' }}>
              {formatCurrency(tbDifference)} {tbDifference === 0 ? '✓' : '⚠️'}
            </div>
          </div>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ margin: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Debit ($)</th>
                <th style={{ textAlign: 'right' }}>Credit ($)</th>
                <th style={{ textAlign: 'center' }}>Audit</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceRows.map(row => (
                <tr key={row.account_number}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--gold-bright)' }}>
                      {row.account_number}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    {row.account_name}
                  </td>
                  <td>
                    <span className={`badge badge-${
                      row.root_type === 'Asset' ? 'info' :
                      row.root_type === 'Liability' ? 'warning' :
                      row.root_type === 'Equity' ? 'gold' :
                      row.root_type === 'Income' ? 'success' : 'danger'
                    }`} style={{ fontSize: '10.5px' }}>
                      {row.root_type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: row.debit > 0 ? '700' : '400', color: row.debit > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: row.credit > 0 ? '700' : '400', color: row.credit > 0 ? 'var(--gold-bright)' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleDrillDownToGL(row.account_number)}
                      className="btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="View General Ledger Postings for this account"
                    >
                      View GL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(197,160,89,0.08)', borderTop: '2px double var(--gold-bright)' }}>
                <td colSpan={3} style={{ fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Grand Totals
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalTBDebit)}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--gold-bright)', fontSize: '15px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalTBCredit)}
                </td>
                <td style={{ textAlign: 'center', color: 'var(--status-success)', fontWeight: '700', fontSize: '12px' }}>
                  Balanced
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

