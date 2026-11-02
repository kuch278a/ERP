import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewInvoiceModal from './NewInvoiceModal';
import { INITIAL_PROJECTS } from '../data/mockData';

describe('NewInvoiceModal', () => {
  it('submits a valid invoice with 5% VAT applied', async () => {
    const onSubmit = vi.fn();
    render(<NewInvoiceModal onClose={() => {}} onSubmit={onSubmit} projects={INITIAL_PROJECTS} />);

    fireEvent.change(screen.getByLabelText(/milestone fee draw/i), { target: { value: '100000' } });
    fireEvent.click(screen.getByRole('button', { name: /issue tax invoice/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const inv = onSubmit.mock.calls[0][0];
    expect(inv.amount).toBe(100000);
    expect(inv.taxRate).toBe(5);
    expect(inv.totalWithTax).toBe(105000);
    expect(inv.id).toMatch(/^INV-\d{4}-[A-Z0-9]{5}$/);
  });
});
