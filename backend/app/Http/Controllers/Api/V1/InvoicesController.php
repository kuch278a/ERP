<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoicesController extends Controller
{
    public function index()
    {
        $invoices = Invoice::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'success',
            'data' => $invoices,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'projectId' => 'nullable|string',
            'projectName' => 'nullable|string',
            'clientName' => 'nullable|string',
            'milestone' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'issueDate' => 'nullable|date',
            'dueDate' => 'nullable|date',
            'status' => 'nullable|string',
            'taxRate' => 'nullable|numeric',
            'totalWithTax' => 'nullable|numeric',
            'paymentMethod' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $count = Invoice::count() + 100;
            $data['id'] = sprintf('INV-%s-%03d', date('Y'), $count);
        }

        if (! isset($data['taxRate'])) {
            $data['taxRate'] = 5.0;
        }

        if (! isset($data['totalWithTax'])) {
            $data['totalWithTax'] = round($data['amount'] * (1 + $data['taxRate'] / 100), 2);
        }

        $invoice = Invoice::create($data);

        return response()->json([
            'message' => 'Sales invoice created successfully',
            'data' => $invoice,
        ], 201);
    }

    public function togglePaid($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->status = $invoice->status === 'Paid' ? 'Pending' : 'Paid';
        $invoice->save();

        return response()->json([
            'message' => 'Invoice payment status updated',
            'data' => $invoice,
        ]);
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully',
        ]);
    }
}

