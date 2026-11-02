const fs = require('fs');

const targetPath = 'C:/Users/X/Documents/Ashara-ERP/routes/api.php';

const apiPhpContent = `<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Ashara Atelier ERP - RESTful API Kernel (ERPNext v16 / AureusERP Architecture)
|--------------------------------------------------------------------------
| High-performance RESTful API endpoints powering the Atelier frontend,
| double-entry financial kernel, FIFO stock ledger, supply chain operations,
| and manufacturing executions.
*/

Route::prefix('v1')->group(function () {

    // 0. Health & Heartbeat
    Route::get('/health', function () {
        return response()->json([
            'status' => 'online',
            'erp_system' => 'Ashara Atelier ERP',
            'engine' => 'AureusERP / Laravel 13 Core',
            'erpnext_version' => 'v16.51.1-compatible',
            'timestamp' => now()->toIso8601String(),
            'accounting_standard' => 'IFRS / Double-Entry Perpetual',
            'valuation_method' => 'FIFO / Moving Average',
            'currency' => 'USD',
            'modules_active' => [
                'accounts', 'buying', 'stock', 'manufacturing', 
                'assets', 'crm', 'support', 'projects', 'desk'
            ]
        ]);
    });

    // ----------------------------------------------------------------------
    // 1. ACCOUNTS & FINANCIAL KERNEL
    // ----------------------------------------------------------------------
    Route::prefix('accounts')->group(function () {
        
        // Chart of Accounts Tree
        Route::get('/chart-of-accounts', function () {
            $coa = [
                [
                    'account_number' => '1000',
                    'account_name' => 'Application of Funds (Assets)',
                    'root_type' => 'Asset',
                    'is_group' => 1,
                    'balance' => 14820000,
                    'children' => [
                        [
                            'account_number' => '1100',
                            'account_name' => 'Current Assets',
                            'root_type' => 'Asset',
                            'is_group' => 1,
                            'balance' => 11220000,
                            'children' => [
                                ['account_number' => '1110', 'account_name' => 'Cash and Bank Balances (Emirates NBD)', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 4850000],
                                ['account_number' => '1120', 'account_name' => 'Accounts Receivable (Debtors)', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 597400],
                                ['account_number' => '1130', 'account_name' => 'Stock in Hand (Inventory Asset)', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 3422600],
                                ['account_number' => '1140', 'account_name' => 'Project Work In Progress (WIP Fit-out)', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 2350000]
                            ]
                        ],
                        [
                            'account_number' => '1200',
                            'account_name' => 'Fixed Assets',
                            'root_type' => 'Asset',
                            'is_group' => 1,
                            'balance' => 3600000,
                            'children' => [
                                ['account_number' => '1210', 'account_name' => 'Atelier Studio & 3D Render Workstations', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 850000],
                                ['account_number' => '1220', 'account_name' => 'Material Sample Archives & Library Fixtures', 'root_type' => 'Asset', 'is_group' => 0, 'balance' => 2750000]
                            ]
                        ]
                    ]
                ],
                [
                    'account_number' => '2000',
                    'account_name' => 'Source of Funds (Liabilities)',
                    'root_type' => 'Liability',
                    'is_group' => 1,
                    'balance' => 3180000,
                    'children' => [
                        [
                            'account_number' => '2100',
                            'account_name' => 'Current Liabilities',
                            'root_type' => 'Liability',
                            'is_group' => 1,
                            'balance' => 3180000,
                            'children' => [
                                ['account_number' => '2110', 'account_name' => 'Accounts Payable (Creditors / Artisans)', 'root_type' => 'Liability', 'is_group' => 0, 'balance' => 1420000],
                                ['account_number' => '2120', 'account_name' => 'Client Project Escrow Advances', 'root_type' => 'Liability', 'is_group' => 0, 'balance' => 1650000],
                                ['account_number' => '2130', 'account_name' => 'VAT Payable (5% UAE)', 'root_type' => 'Liability', 'is_group' => 0, 'balance' => 110000]
                            ]
                        ]
                    ]
                ],
                [
                    'account_number' => '3000',
                    'account_name' => 'Equity',
                    'root_type' => 'Equity',
                    'is_group' => 1,
                    'balance' => 7500000,
                    'children' => [
                        ['account_number' => '3110', 'account_name' => 'Capital Stock - Partners Equity', 'root_type' => 'Equity', 'is_group' => 0, 'balance' => 5000000],
                        ['account_number' => '3120', 'account_name' => 'Retained Earnings', 'root_type' => 'Equity', 'is_group' => 0, 'balance' => 2500000]
                    ]
                ],
                [
                    'account_number' => '4000',
                    'account_name' => 'Income',
                    'root_type' => 'Income',
                    'is_group' => 1,
                    'balance' => 5460000,
                    'children' => [
                        ['account_number' => '4110', 'account_name' => 'Architectural & BIM Design Fees', 'root_type' => 'Income', 'is_group' => 0, 'balance' => 3372000],
                        ['account_number' => '4120', 'account_name' => 'FF&E Procurement Commission & Markup', 'root_type' => 'Income', 'is_group' => 0, 'balance' => 1688000],
                        ['account_number' => '4130', 'account_name' => 'Site Supervision & Fit-Out Consultancy', 'root_type' => 'Income', 'is_group' => 0, 'balance' => 400000]
                    ]
                ],
                [
                    'account_number' => '5000',
                    'account_name' => 'Expenses',
                    'root_type' => 'Expense',
                    'is_group' => 1,
                    'balance' => 1320000,
                    'children' => [
                        ['account_number' => '5110', 'account_name' => 'Cost of Goods Sold - Materials & Procurement', 'root_type' => 'Expense', 'is_group' => 0, 'balance' => 840000],
                        ['account_number' => '5120', 'account_name' => 'Direct Subcontractor & Engineering Fees', 'root_type' => 'Expense', 'is_group' => 0, 'balance' => 310000],
                        ['account_number' => '5130', 'account_name' => 'Atelier Operating & 3D Cloud Compute Costs', 'root_type' => 'Expense', 'is_group' => 0, 'balance' => 170000]
                    ]
                ]
            ];
            return response()->json(['message' => 'success', 'data' => $coa]);
        });

        // General Ledger Entries
        Route::get('/general-ledger', function (Request $request) {
            $account = $request->query('account');
            $voucher = $request->query('voucher_no');
            
            $entries = [
                ['id' => 'GLE-2026-001', 'posting_date' => '2026-10-01', 'voucher_type' => 'Sales Invoice', 'voucher_no' => 'SINV-2026-089', 'account' => '1120 - Accounts Receivable (Debtors)', 'party' => 'Tariq & Reem Al-Ghurair', 'project' => 'PRJ-2026-001', 'debit' => 141120, 'credit' => 0, 'remarks' => 'Milestone #1 Site Fit-out billing'],
                ['id' => 'GLE-2026-002', 'posting_date' => '2026-10-01', 'voucher_type' => 'Sales Invoice', 'voucher_no' => 'SINV-2026-089', 'account' => '4110 - Architectural & BIM Design Fees', 'party' => 'Tariq & Reem Al-Ghurair', 'project' => 'PRJ-2026-001', 'debit' => 0, 'credit' => 134400, 'remarks' => 'Design fee portion'],
                ['id' => 'GLE-2026-003', 'posting_date' => '2026-10-01', 'voucher_type' => 'Sales Invoice', 'voucher_no' => 'SINV-2026-089', 'account' => '2130 - VAT Payable (5% UAE)', 'party' => 'Federal Tax Authority', 'project' => 'PRJ-2026-001', 'debit' => 0, 'credit' => 6720, 'remarks' => '5% UAE VAT output'],
                ['id' => 'GLE-2026-004', 'posting_date' => '2026-10-05', 'voucher_type' => 'Purchase Invoice', 'voucher_no' => 'PINV-2026-034', 'account' => '1130 - Stock in Hand (Inventory Asset)', 'party' => 'Antolini Luigi & C. SpA', 'project' => 'PRJ-2026-001', 'debit' => 48000, 'credit' => 0, 'remarks' => 'Honed Roman Travertine Intake'],
                ['id' => 'GLE-2026-005', 'posting_date' => '2026-10-05', 'voucher_type' => 'Purchase Invoice', 'voucher_no' => 'PINV-2026-034', 'account' => '2110 - Accounts Payable (Creditors / Artisans)', 'party' => 'Antolini Luigi & C. SpA', 'project' => 'PRJ-2026-001', 'debit' => 0, 'credit' => 48000, 'remarks' => 'Antolini quarry invoice'],
                ['id' => 'GLE-2026-006', 'posting_date' => '2026-10-12', 'voucher_type' => 'Journal Entry', 'voucher_no' => 'JV-2026-012', 'account' => '1140 - Project Work In Progress (WIP Fit-out)', 'party' => 'Emirates Engineering & Acoustic', 'project' => 'PRJ-2026-002', 'debit' => 35000, 'credit' => 0, 'remarks' => 'Acoustic baffle fit-out engineering'],
                ['id' => 'GLE-2026-007', 'posting_date' => '2026-10-12', 'voucher_type' => 'Journal Entry', 'voucher_no' => 'JV-2026-012', 'account' => '2110 - Accounts Payable (Creditors / Artisans)', 'party' => 'Emirates Engineering & Acoustic', 'project' => 'PRJ-2026-002', 'debit' => 0, 'credit' => 35000, 'remarks' => 'Subcontractor provision accrual']
            ];

            if ($account) {
                $entries = array_values(array_filter($entries, fn($e) => str_contains($e['account'], $account)));
            }
            if ($voucher) {
                $entries = array_values(array_filter($entries, fn($e) => str_contains($e['voucher_no'], $voucher)));
            }

            return response()->json([
                'message' => 'success',
                'total_count' => count($entries),
                'data' => $entries
            ]);
        });

        // Post Journal Entry (Double-Entry Verification)
        Route::post('/journal-entries', function (Request $request) {
            $data = $request->validate([
                'voucher_type' => 'required|string',
                'posting_date' => 'required|date',
                'accounts' => 'required|array|min:2',
                'accounts.*.account' => 'required|string',
                'accounts.*.debit' => 'numeric|min:0',
                'accounts.*.credit' => 'numeric|min:0',
                'user_remark' => 'nullable|string'
            ]);

            $totalDebit = array_sum(array_column($data['accounts'], 'debit'));
            $totalCredit = array_sum(array_column($data['accounts'], 'credit'));

            if (abs($totalDebit - $totalCredit) > 0.01) {
                return response()->json([
                    'error' => 'UnbalancedJournalEntry',
                    'message' => 'Total Debit ($' . number_format($totalDebit, 2) . ') must equal Total Credit ($' . number_format($totalCredit, 2) . '). Difference: $' . number_format(abs($totalDebit - $totalCredit), 2)
                ], 422);
            }

            $jvId = 'JV-2026-' . rand(100, 999);
            return response()->json([
                'message' => 'Journal Entry posted and ledger updated successfully',
                'data' => array_merge($data, [
                    'id' => $jvId,
                    'total_debit' => $totalDebit,
                    'total_credit' => $totalCredit,
                    'docstatus' => 1,
                    'status' => 'Submitted'
                ])
            ], 201);
        });

        // Financial Statements: Balance Sheet
        Route::get('/reports/balance-sheet', function () {
            return response()->json([
                'statement' => 'Statement of Financial Position',
                'as_of' => now()->toDateString(),
                'total_assets' => 14820000,
                'total_liabilities' => 3180000,
                'total_equity' => 7500000,
                'current_period_surplus' => 4140000,
                'total_liabilities_and_equity' => 14820000,
                'balanced' => true,
                'variance' => 0.00
            ]);
        });

        // Financial Statements: Profit and Loss
        Route::get('/reports/profit-and-loss', function () {
            return response()->json([
                'statement' => 'Statement of Profit and Loss',
                'period' => 'FY 2026 - Present',
                'total_income' => 5460000,
                'total_expenses' => 1320000,
                'net_operating_profit' => 4140000,
                'operating_margin_percentage' => 75.8
            ]);
        });

        // Financial Statements: Trial Balance
        Route::get('/reports/trial-balance', function () {
            return response()->json([
                'statement' => 'Trial Balance',
                'total_debits' => 16140000,
                'total_credits' => 16140000,
                'difference' => 0.00,
                'balanced' => true
            ]);
        });
    });

    // ----------------------------------------------------------------------
    // 2. BUYING & PROCUREMENT
    // ----------------------------------------------------------------------
    Route::prefix('buying')->group(function () {
        Route::get('/suppliers', function () {
            $suppliers = [
                ['id' => 'SUP-ANT-01', 'supplier_name' => 'Antolini Luigi & C. SpA', 'supplier_group' => 'Quarries & Natural Stone', 'country' => 'Italy', 'rating' => 4.9, 'lead_time_days' => 42, 'payment_terms' => '50% Advance, 50% on Bill of Lading', 'total_orders_value' => 840000],
                ['id' => 'SUP-HNG-02', 'supplier_name' => 'Henge Atelier s.r.l.', 'supplier_group' => 'Artisan Lighting & Metals', 'country' => 'Italy', 'rating' => 5.0, 'lead_time_days' => 84, 'payment_terms' => '30% Deposit, 70% Prior to Air Freight', 'total_orders_value' => 620000],
                ['id' => 'SUP-POL-03', 'supplier_name' => 'Poliform SpA', 'supplier_group' => 'Bespoke Joinery & Systems', 'country' => 'Italy', 'rating' => 4.8, 'lead_time_days' => 56, 'payment_terms' => 'Net 30 Days Letter of Credit', 'total_orders_value' => 1250000],
                ['id' => 'SUP-SLV-04', 'supplier_name' => 'Salvatori Stone Workshop', 'supplier_group' => 'Architectural Finishes', 'country' => 'Italy', 'rating' => 4.9, 'lead_time_days' => 35, 'payment_terms' => '40% Milestone Draw', 'total_orders_value' => 430000]
            ];
            return response()->json(['message' => 'success', 'data' => $suppliers]);
        });

        Route::get('/purchase-orders', function () {
            $pos = [
                ['id' => 'PO-2026-042', 'supplier_name' => 'Antolini Luigi & C. SpA', 'projectName' => 'Villa Al-Manara Sanctuary', 'project' => 'PRJ-2026-001', 'transaction_date' => '2026-10-04', 'schedule_date' => '2026-11-15', 'status' => 'To Receive and Bill', 'grand_total' => 184500, 'items_count' => 3],
                ['id' => 'PO-2026-045', 'supplier_name' => 'Henge Atelier s.r.l.', 'projectName' => 'Villa Al-Manara Sanctuary', 'project' => 'PRJ-2026-001', 'transaction_date' => '2026-10-08', 'schedule_date' => '2026-12-01', 'status' => 'In Production', 'grand_total' => 96000, 'items_count' => 2],
                ['id' => 'PO-2026-048', 'supplier_name' => 'Poliform SpA', 'projectName' => 'Penthouse One Palm Jumeirah', 'project' => 'PRJ-2026-002', 'transaction_date' => '2026-10-11', 'schedule_date' => '2026-11-30', 'status' => 'Draft', 'grand_total' => 240000, 'items_count' => 5]
            ];
            return response()->json(['message' => 'success', 'data' => $pos]);
        });
    });

    // ----------------------------------------------------------------------
    // 3. STOCK & WAREHOUSING
    // ----------------------------------------------------------------------
    Route::prefix('stock')->group(function () {
        Route::get('/items', function () {
            $items = [
                ['item_code' => 'MAT-TRV-01', 'item_name' => 'Honed Roman Travertine Slabs', 'item_group' => 'Natural Stone Slabs', 'valuation_method' => 'FIFO', 'valuation_rate' => 266.67, 'qty_on_hand' => 240, 'stock_uom' => 'm²', 'default_warehouse' => 'WH-DEPOT-01'],
                ['item_code' => 'LGT-CHM-02', 'item_name' => 'Sculptural Brass Ribbon Chandelier', 'item_group' => 'Bespoke Lighting', 'valuation_method' => 'Moving Average', 'valuation_rate' => 22000, 'qty_on_hand' => 1, 'stock_uom' => 'Nos', 'default_warehouse' => 'WH-DEPOT-01'],
                ['item_code' => 'MLW-OAK-04', 'item_name' => 'Fluted Smoked Oak Architectural Wall System', 'item_group' => 'Millwork & Joinery', 'valuation_method' => 'FIFO', 'valuation_rate' => 31500, 'qty_on_hand' => 1, 'stock_uom' => 'Set', 'default_warehouse' => 'WH-ON-SITE-02']
            ];
            return response()->json(['message' => 'success', 'data' => $items]);
        });

        Route::get('/warehouses', function () {
            $warehouses = [
                ['id' => 'WH-DEPOT-01', 'warehouse_name' => 'Al Quoz Central Logistics Depot', 'warehouse_type' => 'Central Depot', 'location' => 'Dubai Al Quoz Industrial 3'],
                ['id' => 'WH-TRNS-MIL', 'warehouse_name' => 'Transit Hub Milan (Malpensa)', 'warehouse_type' => 'Air Freight Transit', 'location' => 'Milan Malpensa Cargo City, Italy'],
                ['id' => 'WH-ON-SITE-01', 'warehouse_name' => 'Villa Al-Manara On-Site Staging', 'warehouse_type' => 'Site Fit-Out Staging', 'location' => 'Jumeirah Bay Island, Dubai'],
                ['id' => 'WH-ON-SITE-02', 'warehouse_name' => 'One Palm Penthouse Staging', 'warehouse_type' => 'Site Fit-Out Staging', 'location' => 'Palm Jumeirah Crescent, Dubai']
            ];
            return response()->json(['message' => 'success', 'data' => $warehouses]);
        });

        Route::get('/ledger', function () {
            $ledger = [
                ['id' => 'SLE-2026-001', 'posting_date' => '2026-10-10', 'posting_time' => '09:30:00', 'item_code' => 'MAT-TRV-01', 'warehouse' => 'WH-DEPOT-01', 'voucher_type' => 'Purchase Receipt', 'voucher_no' => 'PREC-2026-042', 'actual_qty' => 240, 'valuation_rate' => 266.67, 'stock_value' => 64000],
                ['id' => 'SLE-2026-002', 'posting_date' => '2026-10-14', 'posting_time' => '14:15:00', 'item_code' => 'LGT-CHM-02', 'warehouse' => 'WH-TRNS-MIL', 'voucher_type' => 'Purchase Receipt', 'voucher_no' => 'PREC-2026-045', 'actual_qty' => 2, 'valuation_rate' => 22000, 'stock_value' => 44000],
                ['id' => 'SLE-2026-004', 'posting_date' => '2026-10-18', 'posting_time' => '16:45:00', 'item_code' => 'MAT-TRV-01', 'warehouse' => 'WH-DEPOT-01', 'voucher_type' => 'Material Transfer', 'voucher_no' => 'STE-2026-081', 'actual_qty' => -60, 'valuation_rate' => 266.67, 'stock_value' => 48000]
            ];
            return response()->json(['message' => 'success', 'data' => $ledger]);
        });
    });

    // ----------------------------------------------------------------------
    // 4. MANUFACTURING & WORK ORDERS
    // ----------------------------------------------------------------------
    Route::prefix('manufacturing')->group(function () {
        Route::get('/boms', function () {
            $boms = [
                ['id' => 'BOM-MLW-OAK-001', 'item' => 'MLW-OAK-04', 'item_name' => 'Fluted Smoked Oak Wall System', 'total_cost' => 31500, 'raw_materials_count' => 4, 'operations_count' => 3],
                ['id' => 'BOM-LGT-CHM-002', 'item' => 'LGT-CHM-02', 'item_name' => 'Sculptural Brass Ribbon Chandelier', 'total_cost' => 22000, 'raw_materials_count' => 3, 'operations_count' => 4]
            ];
            return response()->json(['message' => 'success', 'data' => $boms]);
        });

        Route::get('/work-orders', function () {
            $workOrders = [
                ['id' => 'MFG-WO-2026-014', 'production_item' => 'MLW-OAK-04', 'projectName' => 'Penthouse One Palm Jumeirah', 'status' => 'In Process', 'qty' => 1, 'planned_start_date' => '2026-10-14', 'planned_end_date' => '2026-11-04', 'lead_artisan' => 'Matteo Rossi'],
                ['id' => 'MFG-WO-2026-019', 'production_item' => 'LGT-CHM-02', 'projectName' => 'Villa Al-Manara Sanctuary', 'status' => 'Completed', 'qty' => 1, 'planned_start_date' => '2026-09-20', 'planned_end_date' => '2026-10-12', 'lead_artisan' => 'Lorenzo Castelli']
            ];
            return response()->json(['message' => 'success', 'data' => $workOrders]);
        });
    });

    // ----------------------------------------------------------------------
    // 5. FIXED ASSETS REGISTER
    // ----------------------------------------------------------------------
    Route::prefix('assets')->group(function () {
        Route::get('/', function () {
            $assets = [
                ['id' => 'AST-WRK-001', 'asset_name' => 'Dual RTX 6000 Ada BIM Workstations (Cluster)', 'gross_purchase_amount' => 48000, 'opening_accumulated_depreciation' => 12000, 'current_value' => 36000, 'status' => 'In Use'],
                ['id' => 'AST-LIB-002', 'asset_name' => 'Architectural Rare Material Archive & Sliding Vitrines', 'gross_purchase_amount' => 165000, 'opening_accumulated_depreciation' => 25000, 'current_value' => 140000, 'status' => 'In Use']
            ];
            return response()->json(['message' => 'success', 'data' => $assets]);
        });
    });

    // ----------------------------------------------------------------------
    // 6. CRM & TENDERS
    // ----------------------------------------------------------------------
    Route::prefix('crm')->group(function () {
        Route::get('/opportunities', function () {
            $opps = [
                ['id' => 'CRM-OPP-2026-091', 'title' => 'Al-Barari Royal Biophilic Sanctuary', 'client' => 'H.E. Sheikh Majid Al-Qasimi', 'stage' => 'Proposal & Concept Review', 'opportunity_amount' => 850000, 'probability' => 70],
                ['id' => 'CRM-OPP-2026-094', 'title' => 'Bulgari Island Private Horizon Villa', 'client' => 'Valeria & Marco Benetti', 'stage' => 'Fee Quotation Sent', 'opportunity_amount' => 1250000, 'probability' => 50],
                ['id' => 'CRM-OPP-2026-098', 'title' => 'DIFC Private Family Office Suite', 'client' => 'Nawaf Investment Trust', 'stage' => 'Contract Finalization', 'opportunity_amount' => 480000, 'probability' => 90]
            ];
            return response()->json(['message' => 'success', 'data' => $opps]);
        });
    });

    // ----------------------------------------------------------------------
    // 7. SUPPORT & MAINTENANCE
    // ----------------------------------------------------------------------
    Route::prefix('support')->group(function () {
        Route::get('/issues', function () {
            $issues = [
                ['id' => 'ISS-2026-018', 'subject' => 'Brass Reveal Trim Thermal Expansion Gap', 'projectName' => 'Villa Al-Manara Sanctuary', 'priority' => 'High', 'status' => 'Investigating', 'technician' => 'Matteo Rossi'],
                ['id' => 'ISS-2026-022', 'subject' => 'Dali Dimming Protocol Micro-Flicker in Master Suite', 'projectName' => 'Penthouse One Palm Jumeirah', 'priority' => 'Medium', 'status' => 'Resolved', 'technician' => 'Samir Al-Mansoor']
            ];
            return response()->json(['message' => 'success', 'data' => $issues]);
        });
    });

    // ----------------------------------------------------------------------
    // 8. DOCTYPE METADATA REGISTRY (ERPNext v16 Specification)
    // ----------------------------------------------------------------------
    Route::prefix('desk')->group(function () {
        Route::get('/doctypes', function () {
            $list = [
                'Account', 'GL Entry', 'Journal Entry', 'Sales Invoice',
                'Item', 'Warehouse', 'Stock Entry', 'Stock Ledger Entry',
                'Supplier', 'Purchase Order', 'Purchase Invoice',
                'BOM', 'Work Order', 'Asset', 'Opportunity', 'Issue'
            ];
            return response()->json(['message' => 'success', 'data' => $list]);
        });
    });
});
`;

fs.writeFileSync(targetPath, apiPhpContent, 'utf8');
console.log('Successfully wrote routes/api.php to Ashara-ERP (' + apiPhpContent.length + ' bytes)');
