import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  useCurrentLocation: boolean;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleUseCurrentLocation: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      notifications: true,
      useCurrentLocation: true,
      
      toggleDarkMode: () => 
        set((state) => ({ darkMode: !state.darkMode })),
      
      toggleNotifications: () => 
        set((state) => ({ notifications: !state.notifications })),
      
      toggleUseCurrentLocation: () => 
        set((state) => ({ useCurrentLocation: !state.useCurrentLocation })),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);