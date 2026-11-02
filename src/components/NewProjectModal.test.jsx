import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewProjectModal from './NewProjectModal';
import { INITIAL_CLIENTS } from '../data/mockData';

describe('NewProjectModal', () => {
  it('blocks submit when the title is missing', async () => {
    const onSubmit = vi.fn();
    render(<NewProjectModal onClose={() => {}} onSubmit={onSubmit} clients={INITIAL_CLIENTS} />);

    fireEvent.click(screen.getByRole('button', { name: /initialize project/i }));

    expect(await screen.findByText(/project title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid project with phases and room schedule', async () => {
    const onSubmit = vi.fn();
    render(<NewProjectModal onClose={() => {}} onSubmit={onSubmit} clients={INITIAL_CLIENTS} />);

    fireEvent.change(screen.getByLabelText(/project title/i), { target: { value: 'Elysium Estate' } });
    fireEvent.click(screen.getByRole('button', { name: /initialize project/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const prj = onSubmit.mock.calls[0][0];
    expect(prj.name).toBe('Elysium Estate');
    expect(prj.phases).toHaveLength(6);
    expect(prj.roomSchedule.length).toBeGreaterThan(0);
    expect(prj.id).toMatch(/^PRJ-\d{4}-[A-Z0-9]{5}$/);
  });
});
