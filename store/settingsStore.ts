import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  useLocation: boolean;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleLocation: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      notifications: true,
      useLocation: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      toggleNotifications: () => set({ notifications: !get().notifications }),
      toggleLocation: () => set({ useLocation: !get().useLocation }),
    }),
    {
      name: 'settings-store',
    }
  )
);
