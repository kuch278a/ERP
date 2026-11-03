import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function BalanceSheetTab({
  totalAssets,
  totalLiabilities,
  totalEquity,
  netProfit,
  totalLiabilitiesAndEquity,
  isBalanceSheetBalanced,
  formatCurrency,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Statement Header Card */}
      <div className="panel-card" style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-gold" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ashara Atelier Financial Statement
            </span>
            <h2 style={{ margin: '6px 0 4px 0', fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
              Statement of Financial Position (Balance Sheet)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              As of October 23, 2026 • Reporting Currency: USD ($) • Accounting Standard: IFRS / Dual-Entry Ledger
            </p>
          </div>

          {/* Equilibrium Check Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            background: isBalanceSheetBalanced ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
            border: isBalanceSheetBalanced ? '1px solid var(--status-success)' : '1px solid var(--status-danger)'
          }}>
            <ShieldCheck size={20} style={{ color: isBalanceSheetBalanced ? 'var(--status-success)' : 'var(--status-danger)' }} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Fundamental Accounting Equation
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: isBalanceSheetBalanced ? 'var(--status-success)' : 'var(--status-danger)' }}>
                Assets = Liabilities + Equity (Balanced)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Assets vs Liabilities & Equity Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Column 1: Assets */}
        <div className="panel-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(197,160,89,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Assets (Application of Funds)
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class 1000 Accounts</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
              {formatCurrency(totalAssets)}
            </span>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
            {/* Current Assets (1100) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>Current Assets</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace' }}>
                  {formatCurrency(11220000)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1110 Cash & Bank Balances (Emirates NBD)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(4850000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1120 Accounts Receivable (Debtors)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(597400)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1130 Stock in Hand (Inventory Asset)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(3422600)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1140 Project Work In Progress (WIP Fit-out)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(2350000)}</span>
                </div>
              </div>
            </div>

            {/* Fixed Assets (1200) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>Fixed & Studio Assets</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace' }}>
                  {formatCurrency(3600000)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1210 Atelier Studio & 3D Render Workstations</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(850000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>1220 Material Sample Archives & Library Fixtures</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(2750000)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Assets Summary Footer */}
          <div style={{ padding: '16px 20px', background: 'rgba(197,160,89,0.08)', borderTop: '2px double var(--gold-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '13.5px' }}>
              Total Assets
            </span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
              {formatCurrency(totalAssets)}
            </span>
          </div>
        </div>

        {/* Column 2: Liabilities & Equity */}
        <div className="panel-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(197,160,89,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Liabilities & Atelier Equity
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class 2000 & 3000 Accounts</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
              {formatCurrency(totalLiabilitiesAndEquity)}
            </span>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
            {/* Current Liabilities (2100) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>Current Liabilities</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalLiabilities)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>2110 Accounts Payable (Creditors / Artisans)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(1420000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>2120 Client Project Escrow Advances</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(1650000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>2130 VAT Payable (5% UAE)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(110000)}</span>
                </div>
              </div>
            </div>

            {/* Partners Equity (3000) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px' }}>Partners Equity & Reserves</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace' }}>
                  {formatCurrency(totalEquity)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>3110 Capital Stock - Partners Equity</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(5000000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>3120 Retained Earnings (Historical)</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatCurrency(2500000)}</span>
                </div>
              </div>
            </div>

            {/* Current Period Surplus (P&L Transfer) */}
            <div style={{ background: 'rgba(197,160,89,0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--gold-bright)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '13px' }}>
                    Current Period Profit & Loss (Surplus)
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Net Income transferred from P&L statement
                  </div>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '14px', fontFamily: 'monospace' }}>
                  +{formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Total Liabilities & Equity Summary Footer */}
          <div style={{ padding: '16px 20px', background: 'rgba(197,160,89,0.08)', borderTop: '2px double var(--gold-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '13.5px' }}>
              Total Liabilities & Equity
            </span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--gold-bright)', fontFamily: 'monospace' }}>
              {formatCurrency(totalLiabilitiesAndEquity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

