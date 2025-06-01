import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Adventure } from '@/types/adventure';

interface SavedTripsState {
  savedTrips: Adventure[];
  addTrip: (trip: Adventure) => void;
  removeTrip: (id: string) => void;
  updateTripNotes: (id: string, notes: string) => void;
  getSortedSavedTrips: () => Adventure[];
}

const timeOfDaySortPriority: Record<string, number> = {
  morning: 1,
  afternoon: 2,
  evening: 3,
};

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
      updateTripNotes: (id, notes) => {
        const current = get().savedTrips;
        set({
          savedTrips: current.map((trip) =>
            trip.id === id ? { ...trip, notes } : trip
          ),
        });
      },
      getSortedSavedTrips: () => {
        const current = get().savedTrips;
        return [...current].sort((a, b) => {
          if (a.date && b.date) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
          } else if (a.date) {
            return -1; // a has date, b doesn't, so a comes first
          } else if (b.date) {
            return 1; // b has date, a doesn't, so b comes first
          }

          // If dates are equal or both undefined, sort by timeOfDay
          const priorityA = a.timeOfDay ? timeOfDaySortPriority[a.timeOfDay.toLowerCase()] : Infinity;
          const priorityB = b.timeOfDay ? timeOfDaySortPriority[b.timeOfDay.toLowerCase()] : Infinity;

          if (priorityA < priorityB) return -1;
          if (priorityA > priorityB) return 1;

          return 0;
        });
      },
    }),
    {
      name: 'saved-trips-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
