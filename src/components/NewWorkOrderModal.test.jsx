import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewWorkOrderModal from './NewWorkOrderModal';
import { INITIAL_BOMS } from '../data/erpnextSchemas';
import { INITIAL_PROJECTS } from '../data/mockData';

describe('NewWorkOrderModal', () => {
  it('submits the default work order derived from the selected BOM', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <NewWorkOrderModal
        onClose={onClose}
        onSubmit={onSubmit}
        boms={INITIAL_BOMS}
        projects={INITIAL_PROJECTS}
        warehouses={[]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /launch work order/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const wo = onSubmit.mock.calls[0][0];
    expect(wo.production_item).toBe(INITIAL_BOMS[0].item);
    expect(wo.bom_no).toBe(INITIAL_BOMS[0].id);
    expect(wo.id).toMatch(/^MFG-WO-\d{4}-[A-Z0-9]{5}$/);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
