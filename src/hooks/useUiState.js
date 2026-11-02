import { useState, useEffect } from 'react';

/**
 * UI-only state for the app shell (theme, sidebar, search, notifications).
 * See docs/PLAN.md §L4 decomposition.
 */
export function useUiState() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ashara_theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'ERPNext Full Suite Ready',
      message: 'All 12 ERPNext modules (Accounts, Buying, Stock, Manufacturing, Assets, CRM, Support) active.',
      type: 'info',
    },
    {
      id: 2,
      title: 'Critical Site Snag',
      message: 'SNG-102: Dali dimming driver buzzing in Villa Al-Manara cove ceiling.',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Fabrication Milestone',
      message: 'MFG-WO-2026-005: Chandelier cold bending finished at Al-Quoz forge.',
      type: 'info',
    },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ashara_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleDismissNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return {
    theme,
    sidebarCollapsed,
    setSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    notifications,
    setNotifications,
    toggleTheme,
    handleDismissNotification,
  };
}
