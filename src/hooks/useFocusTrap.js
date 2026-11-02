import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus inside a container while it is mounted and restores focus on
 * unmount (docs/PLAN.md §L4 accessibility). Attach the same ref to the dialog.
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {{ onEscape?: () => void }} [options]
 */
export function useFocusTrap(ref, { onEscape } = {}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const previous = document.activeElement;

    const getFocusable = () => Array.from(node.querySelectorAll(FOCUSABLE));
    const initial = getFocusable();
    (initial[0] || node).focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [ref, onEscape]);
}
