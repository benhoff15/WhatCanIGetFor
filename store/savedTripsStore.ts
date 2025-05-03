import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Adventure } from '@/types/adventure';

interface SavedTripsState {
  savedTrips: Adventure[];
  addTrip: (trip: Adventure) => void;
  removeTrip: (id: string) => void;
}

export const useSavedTripsStore = create<SavedTripsState>()(
  persist(
    (set, get) => ({
      savedTrips: [],
      addTrip: (trip) => {
        const current = get().savedTrips;
        set({ savedTrips: [...current, trip] });
      },
      removeTrip: (id) => {
        const current = get().savedTrips;
        set({ savedTrips: current.filter((t) => t.id !== id) });
      },
    }),
    {
      name: 'saved-trips-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
