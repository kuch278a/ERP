import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewSnagModal from './NewSnagModal';
import { INITIAL_PROJECTS } from '../data/mockData';

describe('NewSnagModal', () => {
  it('blocks submit and shows errors when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<NewSnagModal onClose={() => {}} onSubmit={onSubmit} projects={INITIAL_PROJECTS} />);

    fireEvent.click(screen.getByRole('button', { name: /issue snag/i }));

    expect(await screen.findByText(/room \/ grid axis is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid snag with project metadata', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<NewSnagModal onClose={onClose} onSubmit={onSubmit} projects={INITIAL_PROJECTS} />);

    fireEvent.change(screen.getByLabelText(/specific room/i), { target: { value: 'Master Bath 2B' } });
    fireEvent.change(screen.getByLabelText(/defect observation/i), { target: { value: 'Joint variation' } });
    fireEvent.click(screen.getByRole('button', { name: /issue snag/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const snag = onSubmit.mock.calls[0][0];
    expect(snag.location).toBe('Master Bath 2B');
    expect(snag.projectName).toBe(INITIAL_PROJECTS[0].name);
    expect(snag.id).toMatch(/^SNG-\d{4}-[A-Z0-9]{5}$/);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
