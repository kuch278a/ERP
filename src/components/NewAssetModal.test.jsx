import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewAssetModal from './NewAssetModal';

describe('NewAssetModal', () => {
  it('blocks submit and shows an error when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<NewAssetModal onClose={() => {}} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /capitalize asset/i }));

    expect(await screen.findByText(/asset name is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid asset with a generated id', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<NewAssetModal onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/asset name/i), { target: { value: 'Laser Scanner' } });
    fireEvent.change(screen.getByLabelText(/gross acquisition cost/i), { target: { value: '85000' } });
    fireEvent.click(screen.getByRole('button', { name: /capitalize asset/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const asset = onSubmit.mock.calls[0][0];
    expect(asset.asset_name).toBe('Laser Scanner');
    expect(asset.gross_purchase_amount).toBe(85000);
    expect(asset.id).toMatch(/^ASS-\d{4}-[A-Z0-9]{5}$/);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
