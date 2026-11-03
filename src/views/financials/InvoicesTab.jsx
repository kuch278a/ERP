import React from 'react';
import { Printer } from 'lucide-react';

export default function InvoicesTab({
  invoices,
  onOpenPrintInvoice,
  onTogglePaid,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="table-container" style={{ margin: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Project & Client</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th style={{ textAlign: 'right' }}>Amount ($)</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                    {inv.id}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{inv.projectName}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inv.clientName}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{inv.issueDate}</td>
                <td style={{ color: inv.status === 'Overdue' ? 'var(--status-danger)' : 'var(--text-secondary)' }}>
                  {inv.dueDate}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {formatCurrency(inv.amount)}
                </td>
                <td>
                  <span className={`badge badge-${
                    inv.status === 'Paid' ? 'success' :
                    inv.status === 'Pending' ? 'warning' : 'danger'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onOpenPrintInvoice(inv)}
                      className="btn-secondary btn-sm"
                      title="Print / Export Invoice Voucher"
                    >
                      <Printer size={14} />
                      <span>Voucher</span>
                    </button>
                    <button
                      onClick={() => onTogglePaid(inv.id)}
                      className={`btn-sm ${inv.status === 'Paid' ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {inv.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

