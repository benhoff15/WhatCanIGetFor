import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Adventure, TripBlock } from '@/types/adventure';

interface SavedTripsState {
  savedTrips: Adventure[];
  tripBlocks: TripBlock[];
  addTrip: (trip: Adventure) => void;
  removeTrip: (id: string) => void;
  updateTripNotes: (id: string, notes: string) => void;
  getSortedSavedTrips: () => Adventure[];
  // Trip Block functions
  createTripBlock: (tripBlock: Omit<TripBlock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTripBlock: (id: string, updates: Partial<TripBlock>) => void;
  deleteTripBlock: (id: string) => void;
  addAdventureToTripBlock: (tripBlockId: string, adventure: Adventure) => void;
  removeAdventureFromTripBlock: (tripBlockId: string, adventureId: string) => void;
  getTripBlockById: (id: string) => TripBlock | undefined;
  getAdventuresByTripBlock: (tripBlockId: string) => Adventure[];
  updateTripBlockNotes: (id: string, notes: string) => void;
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
      tripBlocks: [],
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
      // Trip Block functions
      createTripBlock: (tripBlock) => {
        const newTripBlock: TripBlock = {
          ...tripBlock,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          adventures: [],
        };
        set((state) => ({
          tripBlocks: [...state.tripBlocks, newTripBlock],
        }));
      },
      updateTripBlock: (id, updates) => {
        set((state) => ({
          tripBlocks: state.tripBlocks.map((block) =>
            block.id === id
              ? { ...block, ...updates, updatedAt: new Date().toISOString() }
              : block
          ),
        }));
      },
      deleteTripBlock: (id) => {
        set((state) => ({
          tripBlocks: state.tripBlocks.filter((block) => block.id !== id),
          savedTrips: state.savedTrips.map((trip) =>
            trip.tripBlockId === id ? { ...trip, tripBlockId: null } : trip
          ),
        }));
      },
      addAdventureToTripBlock: (tripBlockId, adventure) => {
        set((state) => ({
          savedTrips: state.savedTrips.map((trip) =>
            trip.id === adventure.id ? { ...trip, tripBlockId } : trip
          ),
          tripBlocks: state.tripBlocks.map((block) =>
            block.id === tripBlockId
              ? {
                  ...block,
                  adventures: [...block.adventures, adventure],
                  updatedAt: new Date().toISOString(),
                }
              : block
          ),
        }));
      },
      removeAdventureFromTripBlock: (tripBlockId, adventureId) => {
        set((state) => ({
          savedTrips: state.savedTrips.map((trip) =>
            trip.id === adventureId ? { ...trip, tripBlockId: null } : trip
          ),
          tripBlocks: state.tripBlocks.map((block) =>
            block.id === tripBlockId
              ? {
                  ...block,
                  adventures: block.adventures.filter((a) => a.id !== adventureId),
                  updatedAt: new Date().toISOString(),
                }
              : block
          ),
        }));
      },
      getTripBlockById: (id) => {
        return get().tripBlocks.find((block) => block.id === id);
      },
      getAdventuresByTripBlock: (tripBlockId) => {
        return get().savedTrips.filter((trip) => trip.tripBlockId === tripBlockId);
      },
      updateTripBlockNotes: (id, notes) => {
        set((state) => ({
          tripBlocks: state.tripBlocks.map((block) =>
            block.id === id
              ? { ...block, notes, updatedAt: new Date().toISOString() }
              : block
          ),
        }));
      },
    }),
    {
      name: 'saved-trips-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
