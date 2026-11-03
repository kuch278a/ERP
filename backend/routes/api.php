<?php

use App\Http\Controllers\Api\V1\AccountsController;
use App\Http\Controllers\Api\V1\AssetsController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BuyingController;
use App\Http\Controllers\Api\V1\ClientsController;
use App\Http\Controllers\Api\V1\CrmController;
use App\Http\Controllers\Api\V1\DeskController;
use App\Http\Controllers\Api\V1\FfeController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\InvoicesController;
use App\Http\Controllers\Api\V1\ManufacturingController;
use App\Http\Controllers\Api\V1\ProjectsController;
use App\Http\Controllers\Api\V1\SnagsController;
use App\Http\Controllers\Api\V1\StockController;
use App\Http\Controllers\Api\V1\SupportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Ashara Atelier ERP - RESTful API Kernel (ERPNext v16 / AureusERP)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // 0. Public Heartbeat & Auth
    Route::get('/health', [HealthController::class, 'index']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        // Auth session
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // 1. Core Atelier Modules (PostgreSQL backed)
        Route::prefix('projects')->group(function () {
            Route::get('/', [ProjectsController::class, 'index']);
            Route::post('/', [ProjectsController::class, 'store']);
            Route::get('/{id}', [ProjectsController::class, 'show']);
            Route::put('/{id}', [ProjectsController::class, 'update']);
            Route::delete('/{id}', [ProjectsController::class, 'destroy']);
        });

        Route::prefix('ffe')->group(function () {
            Route::get('/', [FfeController::class, 'index']);
            Route::post('/', [FfeController::class, 'store']);
            Route::patch('/{id}/status', [FfeController::class, 'updateStatus']);
            Route::post('/{id}/toggle-sample', [FfeController::class, 'toggleSample']);
            Route::delete('/{id}', [FfeController::class, 'destroy']);
        });

        Route::prefix('snags')->group(function () {
            Route::get('/', [SnagsController::class, 'index']);
            Route::post('/', [SnagsController::class, 'store']);
            Route::patch('/{id}/status', [SnagsController::class, 'updateStatus']);
            Route::delete('/{id}', [SnagsController::class, 'destroy']);
        });

        Route::prefix('invoices')->group(function () {
            Route::get('/', [InvoicesController::class, 'index']);
            Route::post('/', [InvoicesController::class, 'store']);
            Route::post('/{id}/toggle-paid', [InvoicesController::class, 'togglePaid']);
            Route::delete('/{id}', [InvoicesController::class, 'destroy']);
        });

        Route::prefix('clients')->group(function () {
            Route::get('/', [ClientsController::class, 'index']);
            Route::post('/', [ClientsController::class, 'store']);
            Route::get('/{id}', [ClientsController::class, 'show']);
            Route::put('/{id}', [ClientsController::class, 'update']);
            Route::delete('/{id}', [ClientsController::class, 'destroy']);
        });

        // 2. Accounts & Financial Kernel
        Route::prefix('accounts')->group(function () {
            Route::get('/chart-of-accounts', [AccountsController::class, 'chartOfAccounts']);
            Route::get('/general-ledger', [AccountsController::class, 'generalLedger']);
            Route::post('/journal-entries', [AccountsController::class, 'postJournalEntry']);
            Route::get('/reports/balance-sheet', [AccountsController::class, 'balanceSheet']);
            Route::get('/reports/profit-and-loss', [AccountsController::class, 'profitAndLoss']);
            Route::get('/reports/trial-balance', [AccountsController::class, 'trialBalance']);
        });

        // 3. Buying & Procurement
        Route::prefix('buying')->group(function () {
            Route::get('/suppliers', [BuyingController::class, 'suppliers']);
            Route::get('/purchase-orders', [BuyingController::class, 'purchaseOrders']);
            Route::post('/purchase-orders', [BuyingController::class, 'storePurchaseOrder']);
        });

        // 4. Stock & Warehousing
        Route::prefix('stock')->group(function () {
            Route::get('/items', [StockController::class, 'items']);
            Route::get('/warehouses', [StockController::class, 'warehouses']);
            Route::get('/ledger', [StockController::class, 'ledger']);
            Route::post('/entries', [StockController::class, 'storeStockEntry']);
        });

        // 5. Manufacturing & Work Orders
        Route::prefix('manufacturing')->group(function () {
            Route::get('/boms', [ManufacturingController::class, 'boms']);
            Route::get('/work-orders', [ManufacturingController::class, 'workOrders']);
            Route::post('/work-orders', [ManufacturingController::class, 'storeWorkOrder']);
        });

        // 6. Fixed Assets Register
        Route::prefix('assets')->group(function () {
            Route::get('/', [AssetsController::class, 'index']);
            Route::post('/', [AssetsController::class, 'store']);
        });

        // 7. CRM & Tenders
        Route::prefix('crm')->group(function () {
            Route::get('/opportunities', [CrmController::class, 'opportunities']);
            Route::post('/opportunities', [CrmController::class, 'store']);
        });

        // 8. Support & Maintenance
        Route::prefix('support')->group(function () {
            Route::get('/issues', [SupportController::class, 'issues']);
            Route::post('/issues', [SupportController::class, 'store']);
        });

        // 9. DocType Metadata Registry (ERPNext v16 Specification)
        Route::prefix('desk')->group(function () {
            Route::get('/doctypes', [DeskController::class, 'doctypes']);
        });
    });
});
