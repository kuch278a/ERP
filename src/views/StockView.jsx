import React, { useState } from 'react';
import { 
  Package, 
  Warehouse as WarehouseIcon, 
  ArrowRightLeft, 
  FileCode, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  History
} from 'lucide-react';
import StockBalanceTab from './stock/StockBalanceTab';
import StockLedgerTab from './stock/StockLedgerTab';
import WarehouseNodesTab from './stock/WarehouseNodesTab';
import MaterialTransfersTab from './stock/MaterialTransfersTab';

export default function StockView({ 
  stockItems, 
  warehouses, 
  stockEntries, 
  stockLedgerEntries = [],
  onOpenNewStockEntry, 
  onOpenDocTypeInspector 
}) {
  const [activeTab, setActiveTab] = useState('balance'); // 'balance' | 'ledger' | 'warehouses' | 'entries'
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('All');

  const totalInventoryValuation = stockItems.reduce((sum, itm) => sum + (itm.qty_on_hand * itm.valuation_rate), 0);
  const lowStockItems = stockItems.filter(itm => itm.qty_on_hand <= itm.reorder_level);
  const totalInTransitValuation = stockItems.reduce((sum, itm) => sum + (itm.qty_in_transit * itm.valuation_rate), 0);

  const filteredItems = stockItems.filter(itm => {
    const matchesSearch = itm.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itm.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itm.item_group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'All' || itm.default_warehouse === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const filteredLedgerEntries = stockLedgerEntries.filter(sle => {
    const matchesSearch = sle.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sle.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sle.voucher_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sle.batch_no && sle.batch_no.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesWarehouse = warehouseFilter === 'All' || sle.warehouse === warehouseFilter;
    const matchesType = voucherTypeFilter === 'All' || sle.voucher_type === voucherTypeFilter;
    return matchesSearch && matchesWarehouse && matchesType;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalInwardValue = stockLedgerEntries
    .filter(e => e.actual_qty > 0)
    .reduce((sum, e) => sum + Math.abs(e.stock_value_difference), 0);

  const totalOutwardValue = stockLedgerEntries
    .filter(e => e.actual_qty < 0)
    .reduce((sum, e) => sum + Math.abs(e.stock_value_difference), 0);

  return (
    <div className="content-body">
      {/* Header */}
      <div className="view-header">
        <div className="view-title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="view-pretitle">Ashara Atelier Inventory</span>
            <span className="badge badge-gold" style={{ fontSize: '10px' }}>ERPNext Stock Module</span>
          </div>
          <h1 className="view-title">
            <span>Stock Ledger, Warehousing & Material Movements</span>
          </h1>
          <p className="view-desc">
            ERPNext Stock Module integration tracking perpetual FIFO valuation rates, immutable Stock Ledger audits, warehouse bin balances across Central Logistics & On-Site Staging, and Material Transfer vouchers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary" 
            onClick={() => onOpenDocTypeInspector('item')}
            title="Inspect ERPNext Item & Stock Entry schemas"
          >
            <FileCode size={16} />
            <span>DocType Schema</span>
          </button>
          <button className="btn-primary" onClick={onOpenNewStockEntry}>
            <ArrowRightLeft size={16} />
            <span>New Stock Movement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Total Stock Valuation</span>
            <Package size={18} style={{ color: 'var(--gold-bright)' }} />
          </div>
          <div className="metric-value">{formatCurrency(totalInventoryValuation)}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FIFO & Moving Average Asset Base</span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">In-Transit Valuation</span>
            <TrendingUp size={18} style={{ color: 'var(--status-info)' }} />
          </div>
          <div className="metric-value" style={{ color: 'var(--status-info)' }}>{formatCurrency(totalInTransitValuation)}</div>
          <span style={{ fontSize: '11px', color: 'var(--status-info)' }}>En-route from Milan & Verona Hubs</span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Active Warehouses</span>
            <WarehouseIcon size={18} style={{ color: 'var(--status-success)' }} />
          </div>
          <div className="metric-value" style={{ color: 'var(--status-success)' }}>{warehouses.length} Nodes</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1 Central Depot, 1 Transit, 2 On-Site</span>
        </div>

        <div className="metric-card">
          <div className="metric-top-row">
            <span className="metric-label">Reorder Level Alerts</span>
            <AlertTriangle size={18} style={{ color: lowStockItems.length > 0 ? 'var(--status-danger)' : 'var(--status-success)' }} />
          </div>
          <div className="metric-value" style={{ color: lowStockItems.length > 0 ? 'var(--status-danger)' : 'var(--status-success)' }}>
            {lowStockItems.length} SKUs
          </div>
          <span style={{ fontSize: '11px', color: lowStockItems.length > 0 ? 'var(--status-danger)' : 'var(--status-success)' }}>
            {lowStockItems.length > 0 ? 'Below safety threshold' : 'Optimal buffer stock'}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('balance')}
            className={`pill-btn ${activeTab === 'balance' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'balance' ? '600' : '400',
              border: activeTab === 'balance' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'balance' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'balance' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Package size={15} />
            <span>Stock Balance & Bins ({stockItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`pill-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'ledger' ? '600' : '400',
              border: activeTab === 'ledger' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'ledger' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'ledger' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={15} />
            <span>Perpetual FIFO Ledger ({stockLedgerEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('warehouses')}
            className={`pill-btn ${activeTab === 'warehouses' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'warehouses' ? '600' : '400',
              border: activeTab === 'warehouses' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'warehouses' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'warehouses' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <WarehouseIcon size={15} />
            <span>Warehouse Nodes ({warehouses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('entries')}
            className={`pill-btn ${activeTab === 'entries' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              fontWeight: activeTab === 'entries' ? '600' : '400',
              border: activeTab === 'entries' ? '1px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
              background: activeTab === 'entries' ? 'var(--gold-glow)' : 'var(--bg-secondary)',
              color: activeTab === 'entries' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowRightLeft size={15} />
            <span>Material Transfers ({stockEntries.length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search SKU code, voucher..."
              className="form-input"
              style={{ paddingLeft: '32px', paddingRight: '12px', fontSize: '12px', width: '200px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {(activeTab === 'balance' || activeTab === 'ledger') && (
            <select
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px', width: 'auto' }}
              value={warehouseFilter}
              onChange={e => setWarehouseFilter(e.target.value)}
            >
              <option value="All">All Warehouses</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.warehouse_name}</option>
              ))}
            </select>
          )}

          {activeTab === 'ledger' && (
            <select
              className="form-input"
              style={{ fontSize: '12px', padding: '6px 10px', width: 'auto' }}
              value={voucherTypeFilter}
              onChange={e => setVoucherTypeFilter(e.target.value)}
            >
              <option value="All">All Voucher Types</option>
              <option value="Purchase Receipt">Purchase Receipts</option>
              <option value="Material Transfer">Material Transfers</option>
              <option value="Material Receipt">Material Receipts</option>
              <option value="Work Order Issue">Work Order Issues</option>
            </select>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'balance' && (
        <StockBalanceTab
          items={filteredItems}
          warehouses={warehouses}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'ledger' && (
        <StockLedgerTab
          entries={filteredLedgerEntries}
          warehouses={warehouses}
          totalInwardValue={totalInwardValue}
          totalOutwardValue={totalOutwardValue}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'warehouses' && (
        <WarehouseNodesTab
          warehouses={warehouses}
          stockItems={stockItems}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'entries' && (
        <MaterialTransfersTab
          stockEntries={stockEntries}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}
