import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorageState } from './useLocalStorageState';

describe('useLocalStorageState', () => {
  beforeEach(() => localStorage.clear());

  it('uses the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('k1', { a: 1 }));
    expect(result.current[0]).toEqual({ a: 1 });
    expect(JSON.parse(localStorage.getItem('k1'))).toEqual({ a: 1 });
  });

  it('reads an existing stored value and persists updates', () => {
    localStorage.setItem('k2', JSON.stringify({ a: 2 }));
    const { result } = renderHook(() => useLocalStorageState('k2', { a: 0 }));
    expect(result.current[0]).toEqual({ a: 2 });

    act(() => result.current[1]({ a: 3 }));
    expect(JSON.parse(localStorage.getItem('k2'))).toEqual({ a: 3 });
  });

  it('falls back to the initial value when stored JSON is corrupt', () => {
    localStorage.setItem('k3', '{not json');
    const { result } = renderHook(() => useLocalStorageState('k3', { a: 9 }));
    expect(result.current[0]).toEqual({ a: 9 });
  });
});
