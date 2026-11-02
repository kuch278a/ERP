import { useState, useEffect } from 'react';

/**
 * State mirrored to localStorage (docs/PLAN.md §L4). Replaces the repeated
 * useState + useEffect persistence pattern across the app.
 * @template T
 * @param {string} key
 * @param {T | (() => T)} initial
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorageState(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return typeof initial === 'function' ? initial() : initial;
      }
    }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
