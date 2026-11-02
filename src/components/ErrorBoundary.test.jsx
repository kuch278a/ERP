import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function Boom() {
  throw new Error('kaboom');
}

describe('ErrorBoundary', () => {
  it('renders a fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText('kaboom')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>healthy</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });
});
