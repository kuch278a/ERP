import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewSupportIssueModal from './NewSupportIssueModal';
import { INITIAL_CLIENTS, INITIAL_PROJECTS } from '../data/mockData';

describe('NewSupportIssueModal', () => {
  it('blocks submit when the subject is missing', async () => {
    const onSubmit = vi.fn();
    render(<NewSupportIssueModal onClose={() => {}} onSubmit={onSubmit} clients={INITIAL_CLIENTS} projects={INITIAL_PROJECTS} />);

    fireEvent.click(screen.getByRole('button', { name: /log support ticket/i }));

    expect(await screen.findByText(/issue subject is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid support issue', async () => {
    const onSubmit = vi.fn();
    render(<NewSupportIssueModal onClose={() => {}} onSubmit={onSubmit} clients={INITIAL_CLIENTS} projects={INITIAL_PROJECTS} />);

    fireEvent.change(screen.getByLabelText(/issue subject/i), { target: { value: 'Drapery jam' } });
    fireEvent.click(screen.getByRole('button', { name: /log support ticket/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const issue = onSubmit.mock.calls[0][0];
    expect(issue.subject).toBe('Drapery jam');
    expect(issue.id).toMatch(/^ISS-\d{4}-[A-Z0-9]{5}$/);
  });
});
