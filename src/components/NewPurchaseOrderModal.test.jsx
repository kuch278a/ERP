import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewPurchaseOrderModal from './NewPurchaseOrderModal';
import { INITIAL_SUPPLIERS, INITIAL_WAREHOUSES } from '../data/erpnextSchemas';
import { INITIAL_PROJECTS } from '../data/mockData';

const baseProps = (onSubmit, onClose) => ({
  onSubmit,
  onClose,
  suppliers: INITIAL_SUPPLIERS,
  projects: INITIAL_PROJECTS,
  warehouses: INITIAL_WAREHOUSES,
});

describe('NewPurchaseOrderModal', () => {
  it('blocks submit when an added line item is incomplete', async () => {
    const onSubmit = vi.fn();
    render(<NewPurchaseOrderModal {...baseProps(onSubmit, () => {})} />);

    fireEvent.click(screen.getByRole('button', { name: /add line item/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit purchase order/i }));

    expect(await screen.findByText(/item code is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid purchase order with totals', async () => {
    const onSubmit = vi.fn();
    render(<NewPurchaseOrderModal {...baseProps(onSubmit, () => {})} />);

    fireEvent.click(screen.getByRole('button', { name: /submit purchase order/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const po = onSubmit.mock.calls[0][0];
    expect(po.total).toBe(45 * 380);
    expect(po.total_qty).toBe(45);
    expect(po.id).toMatch(/^PO-\d{4}-[A-Z0-9]{5}$/);
  });
});
