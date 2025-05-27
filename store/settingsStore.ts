import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../lib/i18n';
import * as Localization from 'expo-localization';

export interface NotificationPrefs {
  tripSuggestions: boolean;
  savedTripChanges: boolean;
  newFeatures: boolean;
  marketingEmails: boolean;
}

export interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  useLocation: boolean;
  currentLanguage: string;
  currentCoordinates: { latitude: number; longitude: number } | null;
  locationError: string | null;
  isFetchingLocation: boolean;
  notificationPrefs: NotificationPrefs;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleLocation: () => void;
  setLanguage: (lang: string) => void;
  setLocationData: (coords: { latitude: number; longitude: number } | null, error: string | null) => void;
  setIsFetchingLocation: (isFetching: boolean) => void;
  setNotificationPref: (prefKey: keyof NotificationPrefs, value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      notifications: true,
      useLocation: false,
      currentLanguage: Localization.locale.split('-')[0] || 'en',
      currentCoordinates: null,
      locationError: null,
      isFetchingLocation: false,
      notificationPrefs: {
        tripSuggestions: true,
        savedTripChanges: true,
        newFeatures: true,
        marketingEmails: false,
      },
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      toggleNotifications: () => set({ notifications: !get().notifications }),
      toggleLocation: () => set((state) => ({ useLocation: !state.useLocation })),
      setLanguage: (lang: string) => {
        set({ currentLanguage: lang });
        i18n.locale = lang;
      },
      setLocationData: (coords, error) => set({
        currentCoordinates: coords,
        locationError: error,
        isFetchingLocation: false,
        useLocation: !!coords && !error,
      }),
      setIsFetchingLocation: (isFetching) => set({ isFetchingLocation: isFetching }),
      setNotificationPref: (prefKey, value) => set((state) => ({
        notificationPrefs: {
          ...state.notificationPrefs,
          [prefKey]: value,
        },
      })),
    }),
    {
      name: 'settings-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        notifications: state.notifications,
        useLocation: state.useLocation,
        currentLanguage: state.currentLanguage,
        notificationPrefs: state.notificationPrefs,
        // Exclude: currentCoordinates, locationError, isFetchingLocation
      }),
    }
  )
);
