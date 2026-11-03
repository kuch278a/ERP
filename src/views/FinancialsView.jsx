import React, { useState } from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Plus, 
  Printer, 
  BookOpen,
  Scale,
  FolderTree,
  FileCode,
  Search,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import InvoicesTab from './financials/InvoicesTab';
import GeneralLedgerTab from './financials/GeneralLedgerTab';
import ChartOfAccountsTab from './financials/ChartOfAccountsTab';
import JournalEntriesTab from './financials/JournalEntriesTab';
import BalanceSheetTab from './financials/BalanceSheetTab';
import ProfitLossTab from './financials/ProfitLossTab';
import TrialBalanceTab from './financials/TrialBalanceTab';

export default function FinancialsView({ 
  invoices, 
  onTogglePaid, 
  onOpenNewInvoice, 
  onOpenPrintInvoice, 
  projects: _projects = [],
  glEntries = [],
  journalEntries = [],
  chartOfAccounts = [],
  onOpenNewJournalEntry,
  onOpenDocTypeInspector
}) {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'gl' | 'coa' | 'jv' | 'balance_sheet' | 'pnl' | 'trial_balance'
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({ '1000': true, '1100': true, '1200': true, '2000': true, '2100': true, '3000': true, '4000': true, '5000': true });
  const [tbTypeFilter, setTbTypeFilter] = useState('All');
  const [statementPeriod, setStatementPeriod] = useState('FY 2026 - Present (Q4 Closing)');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const toggleNode = (accNum) => {
    setExpandedNodes(prev => ({
      ...prev,
      [accNum]: !prev[accNum]
    }));
  };

  // Helper to extract leaves recursively
  const getLeafAccounts = (nodes) => {
    let leaves = [];
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        leaves = leaves.concat(getLeafAccounts(node.children));
      } else {
        leaves.push(node);
      }
    });
    return leaves;
  };

  const leafAccounts = getLeafAccounts(chartOfAccounts);

  // Statement calculations from Chart of Accounts
  const assetRoot = chartOfAccounts.find(a => a.account_number === '1000' || a.root_type === 'Asset');
  const liabilityRoot = chartOfAccounts.find(a => a.account_number === '2000' || a.root_type === 'Liability');
  const equityRoot = chartOfAccounts.find(a => a.account_number === '3000' || a.root_type === 'Equity');
  const incomeRoot = chartOfAccounts.find(a => a.account_number === '4000' || a.root_type === 'Income');
  const expenseRoot = chartOfAccounts.find(a => a.account_number === '5000' || a.root_type === 'Expense');

  const totalAssets = assetRoot ? assetRoot.balance : 14820000;
  const totalLiabilities = liabilityRoot ? liabilityRoot.balance : 3180000;
  const totalEquity = equityRoot ? equityRoot.balance : 7500000;
  const totalIncome = incomeRoot ? incomeRoot.balance : 5460000;
  const totalExpenses = expenseRoot ? expenseRoot.balance : 1320000;
  const netProfit = totalIncome - totalExpenses;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity + netProfit;
  const isBalanceSheetBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) === 0;

  // Trial balance accounts & totals
  const trialBalanceRows = leafAccounts.map(leaf => {
    const isDebit = leaf.root_type === 'Asset' || leaf.root_type === 'Expense';
    return {
      ...leaf,
      debit: isDebit ? leaf.balance : 0,
      credit: !isDebit ? leaf.balance : 0
    };
  });

  const filteredTBRows = trialBalanceRows.filter(row => {
    const matchesFilter = tbTypeFilter === 'All' || row.root_type === tbTypeFilter;
    const matchesSearch = row.account_number.includes(searchQuery) ||
      row.account_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalTBDebit = trialBalanceRows.reduce((sum, r) => sum + r.debit, 0);
  const totalTBCredit = trialBalanceRows.reduce((sum, r) => sum + r.credit, 0);
  const tbDifference = totalTBDebit - totalTBCredit;

  // Drill down from statement or TB directly to GL
  const handleDrillDownToGL = (accNumber) => {
    setSearchQuery(accNumber);
    setActiveTab('gl');
  };

  // Filtered GL entries
  const filteredGLEntries = glEntries.filter(gle => {
    return gle.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gle.voucher_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gle.party && gle.party.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (gle.remarks && gle.remarks.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="content-body">
      {/* Header */}
      <div className="view-header">
        <div className="view-title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="view-pretitle">Ashara Atelier Commercials</span>
            <span className="badge badge-gold" style={{ fontSize: '10px' }}>ERPNext Accounts Module</span>
          </div>
          <h1 className="view-title">
            <span>Financials, General Ledger & Statements</span>
          </h1>
          <p className="view-desc">
            Complete ERPNext Accounts kernel featuring multi-tiered Chart of Accounts, General Ledger audit trails, balanced Journal Entries, interactive Balance Sheet, Profit & Loss, and Trial Balance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary" 
            onClick={() => onOpenDocTypeInspector('sales_invoice')}
            title="Inspect ERPNext Accounts DocTypes"
          >
            <FileCode size={16} />
            <span>DocType Schema</span>
          </button>
          {activeTab === 'jv' ? (
            <button className="btn-primary" onClick={onOpenNewJournalEntry}>
              <Scale size={16} />
              <span>Create Journal Entry</span>
            </button>
          ) : activeTab === 'balance_sheet' || activeTab === 'pnl' || activeTab === 'trial_balance' ? (
            <button className="btn-secondary" onClick={() => window.print()} title="Print Statement">
              <Printer size={16} />
              <span>Print Statement</span>
            </button>
          ) : (
            <button className="btn-primary" onClick={onOpenNewInvoice}>
              <Plus size={16} />
              <span>Generate Fee Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Total Contracted Fees</span>
            <Receipt size={18} style={{ color: 'var(--gold-bright)' }} />
          </div>
          <div className="metric-value">{formatCurrency(totalInvoiced)}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Across 4 Signature Commissions</span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Fees Realized / Collected</span>
            <CheckCircle2 size={18} style={{ color: 'var(--status-success)' }} />
          </div>
          <div className="metric-value" style={{ color: 'var(--status-success)' }}>{formatCurrency(totalCollected)}</div>
          <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>
            {totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0}% Collection Rate
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Net Operating Surplus (P&L)</span>
            <TrendingUp size={18} style={{ color: 'var(--gold-bright)' }} />
          </div>
          <div className="metric-value" style={{ color: 'var(--gold-bright)' }}>{formatCurrency(netProfit)}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>75.8% Operating Margin</span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Asset Base (Balance Sheet)</span>
            <ShieldCheck size={18} style={{ color: 'var(--status-info)' }} />
          </div>
          <div className="metric-value" style={{ color: 'var(--status-info)' }}>{formatCurrency(totalAssets)}</div>
          <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>Exact Balance (Assets = Liab + Eq)</span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pill-btn ${activeTab === 'invoices' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'invoices' ? '600' : '400',
              border: activeTab === 'invoices' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'invoices' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'invoices' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Receipt size={15} />
            <span>Sales Invoices ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gl')}
            className={`pill-btn ${activeTab === 'gl' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'gl' ? '600' : '400',
              border: activeTab === 'gl' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'gl' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'gl' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={15} />
            <span>General Ledger ({glEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coa')}
            className={`pill-btn ${activeTab === 'coa' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'coa' ? '600' : '400',
              border: activeTab === 'coa' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'coa' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'coa' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FolderTree size={15} />
            <span>Chart of Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab('jv')}
            className={`pill-btn ${activeTab === 'jv' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'jv' ? '600' : '400',
              border: activeTab === 'jv' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'jv' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'jv' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Scale size={15} />
            <span>Journal Vouchers ({journalEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('balance_sheet')}
            className={`pill-btn ${activeTab === 'balance_sheet' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'balance_sheet' ? '600' : '400',
              border: activeTab === 'balance_sheet' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'balance_sheet' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'balance_sheet' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={15} />
            <span>Balance Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('pnl')}
            className={`pill-btn ${activeTab === 'pnl' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'pnl' ? '600' : '400',
              border: activeTab === 'pnl' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'pnl' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'pnl' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={15} />
            <span>Profit & Loss</span>
          </button>

          <button
            onClick={() => setActiveTab('trial_balance')}
            className={`pill-btn ${activeTab === 'trial_balance' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'trial_balance' ? '600' : '400',
              border: activeTab === 'trial_balance' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'trial_balance' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'trial_balance' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={15} />
            <span>Trial Balance</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reference, account..."
              className="form-input"
              style={{ paddingLeft: '32px', paddingRight: '12px', fontSize: '12px', width: '200px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === 'invoices' && (
            <select
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px', width: 'auto' }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Overdue">Overdue Only</option>
            </select>
          )}

          {activeTab === 'trial_balance' && (
            <select
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px', width: 'auto' }}
              value={tbTypeFilter}
              onChange={e => setTbTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Asset">Assets</option>
              <option value="Liability">Liabilities</option>
              <option value="Equity">Equity</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          )}

          {(activeTab === 'balance_sheet' || activeTab === 'pnl') && (
            <select
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px', width: 'auto' }}
              value={statementPeriod}
              onChange={e => setStatementPeriod(e.target.value)}
            >
              <option value="FY 2026 - Present (Q4 Closing)">FY 2026 - Present (Q4 Closing)</option>
              <option value="FY 2025 Full Year">FY 2025 Full Year</option>
              <option value="FY 2024 Historical">FY 2024 Historical</option>
            </select>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'invoices' && (
        <InvoicesTab
          invoices={filteredInvoices}
          onOpenPrintInvoice={onOpenPrintInvoice}
          onTogglePaid={onTogglePaid}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'gl' && (
        <GeneralLedgerTab
          glEntries={filteredGLEntries}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'coa' && (
        <ChartOfAccountsTab
          chartOfAccounts={chartOfAccounts}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
          setExpandedNodes={setExpandedNodes}
          handleDrillDownToGL={handleDrillDownToGL}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'jv' && (
        <JournalEntriesTab
          journalEntries={journalEntries}
          onOpenNewJournalEntry={onOpenNewJournalEntry}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'balance_sheet' && (
        <BalanceSheetTab
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          totalEquity={totalEquity}
          netProfit={netProfit}
          totalLiabilitiesAndEquity={totalLiabilitiesAndEquity}
          isBalanceSheetBalanced={isBalanceSheetBalanced}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'pnl' && (
        <ProfitLossTab
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          statementPeriod={statementPeriod}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'trial_balance' && (
        <TrialBalanceTab
          trialBalanceRows={filteredTBRows}
          totalTBDebit={totalTBDebit}
          totalTBCredit={totalTBCredit}
          tbDifference={tbDifference}
          handleDrillDownToGL={handleDrillDownToGL}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}
