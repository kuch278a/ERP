import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewFfeModal from './NewFfeModal';
import { INITIAL_PROJECTS } from '../data/mockData';

describe('NewFfeModal', () => {
  it('blocks submit when the item description is missing', async () => {
    const onSubmit = vi.fn();
    render(<NewFfeModal onClose={() => {}} onSubmit={onSubmit} projects={INITIAL_PROJECTS} />);

    fireEvent.click(screen.getByRole('button', { name: /save ff&e spec/i }));

    expect(await screen.findByText(/item description is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('computes the client price from unit cost and markup', async () => {
    const onSubmit = vi.fn();
    render(<NewFfeModal onClose={() => {}} onSubmit={onSubmit} projects={INITIAL_PROJECTS} />);

    fireEvent.change(screen.getByLabelText(/item description/i), { target: { value: 'Plinth Table' } });
    fireEvent.change(screen.getByLabelText(/trade unit cost/i), { target: { value: '2000' } });
    fireEvent.click(screen.getByRole('button', { name: /save ff&e spec/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const item = onSubmit.mock.calls[0][0];
    expect(item.name).toBe('Plinth Table');
    expect(item.clientPrice).toBe(2700);
    expect(item.projectName).toBe(INITIAL_PROJECTS[0].name);
    expect(item.id).toMatch(/^FFE-\d{4}-[A-Z0-9]{5}$/);
  });
});
