import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import NewClientModal from './NewClientModal';

describe('NewClientModal', () => {
  it('blocks submit when client name is empty', async () => {
    const onSubmit = vi.fn();
    render(<NewClientModal onClose={() => {}} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));

    await waitFor(() => {
      expect(screen.getByText(/Client name is required/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid client', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<NewClientModal onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Client Name \/ Entity/i), {
      target: { value: 'His Excellency Mohammed Al-Falasi' },
    });
    fireEvent.change(screen.getByLabelText(/Primary Location \/ City/i), {
      target: { value: 'Abu Dhabi, UAE' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Complete Onboarding/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'His Excellency Mohammed Al-Falasi',
          city: 'Abu Dhabi, UAE',
          type: 'Private Residential (VIP)',
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});

