import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function ChartOfAccountsTab({
  chartOfAccounts,
  expandedNodes,
  toggleNode,
  setExpandedNodes,
  handleDrillDownToGL,
  formatCurrency,
}) {
  return (
    <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(197,160,89,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>Standard Chart of Accounts (COA) Hierarchy</h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ERPNext DocType: <code>Account</code> • Multi-tiered recursive financial tree</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => setExpandedNodes({ '1000': true, '1100': true, '1200': true, '2000': true, '2100': true, '3000': true, '4000': true, '5000': true })}
          >
            Expand All
          </button>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => setExpandedNodes({})}
          >
            Collapse All
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chartOfAccounts.map(rootNode => {
          const isExpanded = expandedNodes[rootNode.account_number];
          return (
            <div key={rootNode.account_number} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
              {/* Root Node Header */}
              <div 
                onClick={() => toggleNode(rootNode.account_number)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {rootNode.children ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div style={{ width: '16px' }} />}
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--gold-bright)', fontSize: '13px' }}>
                    {rootNode.account_number}
                  </span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>
                    {rootNode.account_name}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '10.5px' }}>
                    {rootNode.root_type}
                  </span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--gold-bright)', fontSize: '14px' }}>
                  {formatCurrency(rootNode.balance)}
                </span>
              </div>

              {/* Level 2 Children */}
              {isExpanded && rootNode.children && (
                <div style={{ paddingLeft: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px dashed var(--border-subtle)', marginLeft: '8px' }}>
                  {rootNode.children.map(subGroup => {
                    const isSubExpanded = expandedNodes[subGroup.account_number];
                    return (
                      <div key={subGroup.account_number} style={{ marginTop: '4px' }}>
                        <div 
                          onClick={() => toggleNode(subGroup.account_number)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.015)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {subGroup.children ? (isSubExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{ width: '14px' }} />}
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '12px' }}>
                              {subGroup.account_number}
                            </span>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>
                              {subGroup.account_name}
                            </span>
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
                            {formatCurrency(subGroup.balance)}
                          </span>
                        </div>

                        {/* Leaf Accounts */}
                        {isSubExpanded && subGroup.children && (
                          <div style={{ paddingLeft: '32px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {subGroup.children.map(leaf => (
                              <div key={leaf.account_number} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderLeft: '2px solid var(--border-gold)', marginLeft: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '11.5px' }}>
                                    {leaf.account_number}
                                  </span>
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                                    {leaf.account_name}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ color: 'var(--text-primary)', fontSize: '12.5px', fontFamily: 'monospace' }}>
                                    {formatCurrency(leaf.balance)}
                                  </span>
                                  <button 
                                    onClick={() => handleDrillDownToGL(leaf.account_number)}
                                    style={{ background: 'none', border: 'none', color: 'var(--gold-bright)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
                                  >
                                    GL
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

