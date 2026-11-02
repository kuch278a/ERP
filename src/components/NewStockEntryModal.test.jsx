import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewStockEntryModal from './NewStockEntryModal';
import { INITIAL_STOCK_ITEMS, INITIAL_WAREHOUSES } from '../data/erpnextSchemas';
import { INITIAL_PROJECTS } from '../data/mockData';

describe('NewStockEntryModal', () => {
  it('blocks a transfer where source equals target warehouse', async () => {
    const onSubmit = vi.fn();
    render(
      <NewStockEntryModal
        onClose={() => {}}
        onSubmit={onSubmit}
        stockItems={INITIAL_STOCK_ITEMS}
        warehouses={INITIAL_WAREHOUSES}
        projects={INITIAL_PROJECTS}
      />
    );

    fireEvent.change(screen.getByLabelText(/source warehouse/i), { target: { value: INITIAL_WAREHOUSES[0].id } });
    fireEvent.change(screen.getByLabelText(/target warehouse/i), { target: { value: INITIAL_WAREHOUSES[0].id } });
    fireEvent.click(screen.getByRole('button', { name: /post stock entry/i }));

    expect(await screen.findByText(/cannot be the same/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid stock entry with a generated id', async () => {
    const onSubmit = vi.fn();
    render(
      <NewStockEntryModal
        onClose={() => {}}
        onSubmit={onSubmit}
        stockItems={INITIAL_STOCK_ITEMS}
        warehouses={INITIAL_WAREHOUSES}
        projects={INITIAL_PROJECTS}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /post stock entry/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const entry = onSubmit.mock.calls[0][0];
    expect(entry.items.length).toBeGreaterThan(0);
    expect(entry.id).toMatch(/^STE-\d{4}-[A-Z0-9]{5}$/);
  });
});
