import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Adventure } from "@/types/adventure";

interface SavedTripsState {
  savedTrips: Adventure[];
  addTrip: (trip: Adventure) => void;
  removeTrip: (id: string) => void;
  clearTrips: () => void;
}

export const useSavedTripsStore = create<SavedTripsState>()(
  persist(
    (set) => ({
      savedTrips: [],
      
      addTrip: (trip) => 
        set((state) => ({
          savedTrips: [...state.savedTrips, trip],
        })),
      
      removeTrip: (id) => 
        set((state) => ({
          savedTrips: state.savedTrips.filter((trip) => trip.id !== id),
        })),
      
      clearTrips: () => set({ savedTrips: [] }),
    }),
    {
      name: "saved-trips-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);