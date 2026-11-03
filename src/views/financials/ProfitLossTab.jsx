import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ProfitLossTab({
  totalIncome,
  totalExpenses,
  netProfit,
  statementPeriod,
  formatCurrency,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Statement Header Card */}
      <div className="panel-card" style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-gold" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ashara Atelier Income Statement
            </span>
            <h2 style={{ margin: '6px 0 4px 0', fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
              Statement of Profit & Loss (P&L)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Period: {statementPeriod} • Architectural Design, Procurement Commissions & Direct Fulfillment Costs
            </p>
          </div>

          {/* Profit Margin Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(197, 160, 89, 0.1)',
            border: '1px solid var(--gold-bright)'
          }}>
            <TrendingUp size={22} style={{ color: 'var(--gold-bright)' }} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Net Operating Surplus
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
                {formatCurrency(netProfit)} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--status-success)' }}>(75.8% Margin)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed P&L Breakdown Table */}
      <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ margin: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Code & Particulars</th>
                <th>Classification</th>
                <th style={{ textAlign: 'right' }}>% of Revenue</th>
                <th style={{ textAlign: 'right' }}>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue Section */}
              <tr style={{ background: 'rgba(197,160,89,0.06)' }}>
                <td colSpan={3} style={{ fontWeight: '700', color: 'var(--gold-bright)', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.05em' }}>
                  1. Operating Income & Architectural Revenues
                </td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--gold-bright)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalIncome)}
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  4110 Architectural & BIM Design Fees
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>Master Commission Fees</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>61.8%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {formatCurrency(3372000)}
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  4120 FF&E Procurement Commission & Markup
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>Curation & Sourcing Markup</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>30.9%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {formatCurrency(1688000)}
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  4130 Site Supervision & Fit-Out Consultancy
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>On-site Inspection Retainers</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>7.3%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {formatCurrency(400000)}
                </td>
              </tr>

              {/* Subtotal Revenue */}
              <tr style={{ borderBottom: '2px solid var(--border-gold)' }}>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Total Gross Revenue (A)
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--gold-bright)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalIncome)}
                </td>
              </tr>

              {/* Expenses Section */}
              <tr style={{ background: 'rgba(231,76,60,0.04)' }}>
                <td colSpan={3} style={{ fontWeight: '700', color: 'var(--status-danger)', textTransform: 'uppercase', fontSize: '12.5px', letterSpacing: '0.05em' }}>
                  2. Operating Expenses & Direct Fulfillment
                </td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--status-danger)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalExpenses)}
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  5110 Cost of Goods Sold - Materials & Procurement
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>Artisan & Quarry Fulfillment</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>15.4%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--status-danger)' }}>
                  ({formatCurrency(840000)})
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  5120 Direct Subcontractor & Engineering Fees
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>Acoustic & MEP Consultants</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>5.7%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--status-danger)' }}>
                  ({formatCurrency(310000)})
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '28px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  5130 Atelier Operating & 3D Cloud Compute Costs
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>Render Cluster & Studio Licences</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>3.1%</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--status-danger)' }}>
                  ({formatCurrency(170000)})
                </td>
              </tr>

              {/* Subtotal Expenses */}
              <tr style={{ borderBottom: '2px solid var(--border-gold)' }}>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Total Operating Expenses (B)
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--status-danger)', fontSize: '14px', fontFamily: 'monospace' }}>
                  ({formatCurrency(totalExpenses)})
                </td>
              </tr>

              {/* Grand Total Net Profit */}
              <tr style={{ background: 'rgba(197,160,89,0.12)', borderTop: '2px double var(--gold-bright)' }}>
                <td colSpan={3} style={{ fontWeight: '800', color: 'var(--gold-bright)', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.05em' }}>
                  Net Operating Surplus / Earnings Before Tax (A - B)
                </td>
                <td style={{ textAlign: 'right', fontWeight: '900', color: 'var(--gold-bright)', fontSize: '18px', fontFamily: 'monospace' }}>
                  {formatCurrency(netProfit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

