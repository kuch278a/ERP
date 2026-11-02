import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewJournalEntryModal from './NewJournalEntryModal';
import { INITIAL_CLIENTS } from '../data/mockData';

describe('NewJournalEntryModal', () => {
  it('submits a balanced journal entry', async () => {
    const onSubmit = vi.fn();
    render(<NewJournalEntryModal onClose={() => {}} onSubmit={onSubmit} clients={INITIAL_CLIENTS} />);

    fireEvent.change(screen.getByLabelText(/user remark/i), { target: { value: 'Owner capital injection' } });
    fireEvent.click(screen.getByRole('button', { name: /post journal entry/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const jv = onSubmit.mock.calls[0][0];
    expect(jv.accounts).toHaveLength(2);
    expect(jv.total_debit).toBe(jv.total_credit);
    expect(jv.id).toMatch(/^JV-\d{4}-[A-Z0-9]{5}$/);
  });

  it('disables submit while the entry is unbalanced', () => {
    render(<NewJournalEntryModal onClose={() => {}} onSubmit={vi.fn()} clients={INITIAL_CLIENTS} />);

    const numberInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(numberInputs[0], { target: { value: '40000' } });

    expect(screen.getByRole('button', { name: /post journal entry/i })).toBeDisabled();
  });
});
