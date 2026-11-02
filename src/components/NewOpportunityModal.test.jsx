import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewOpportunityModal from './NewOpportunityModal';

describe('NewOpportunityModal', () => {
  it('blocks submit when the prospect is missing', async () => {
    const onSubmit = vi.fn();
    render(<NewOpportunityModal onClose={() => {}} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /create opportunity/i }));

    expect(await screen.findByText(/client \/ prospect is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid opportunity with a generated id', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<NewOpportunityModal onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/client \/ family office prospect/i), {
      target: { value: 'Al-Nahyan Family Office' },
    });
    fireEvent.change(screen.getByLabelText(/estimated deal value/i), { target: { value: '7500000' } });
    fireEvent.click(screen.getByRole('button', { name: /create opportunity/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const opp = onSubmit.mock.calls[0][0];
    expect(opp.party_name).toBe('Al-Nahyan Family Office');
    expect(opp.opportunity_amount).toBe(7500000);
    expect(opp.id).toMatch(/^CRM-OPP-\d{4}-[A-Z0-9]{5}$/);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
