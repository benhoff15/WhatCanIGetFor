import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AdventureSummary {
  id: string;
  title: string;
  location: string;
  price: number;
  adventureType: string;
  budget?: number;
}

interface SearchParams {
  budget: number;
  adventureType: string;
  location: string;
  timeOfDay?: string | null;
  groupSize?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

interface SearchState extends SearchParams {
  timeOfDay: string | null;
  groupSize: string | null;
  startDate: string | null;
  endDate: string | null;

  setBudget: (budget: number) => void;
  setAdventureType: (type: string) => void;
  setLocation: (location: string) => void;
  setTimeOfDay: (value: string | null) => void;
  setGroupSize: (value: string | null) => void;
  setStartDate: (value: string | null) => void;
  setEndDate: (value: string | null) => void;

  resetSearch: () => void;

  recentSearches: AdventureSummary[];
  addRecentSearch: (adventure: AdventureSummary) => void;
  restoreSearch: (filters: SearchParams) => void;
  removeRecentSearch: (id: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      budget: 0,
      adventureType: "",
      location: "",
      timeOfDay: null,
      groupSize: null,
      startDate: null,
      endDate: null,
      recentSearches: [],

      setBudget: (budget: number) => set({ budget }),
      setAdventureType: (adventureType: string) => set({ adventureType }),
      setLocation: (location: string) => set({ location }),
      setTimeOfDay: (timeOfDay: string | null) => set({ timeOfDay }),
      setGroupSize: (groupSize: string | null) => set({ groupSize }),
      setStartDate: (startDate: string | null) => set({ startDate }),
      setEndDate: (endDate: string | null) => set({ endDate }),

      resetSearch: () =>
        set({
          budget: 0,
          adventureType: "",
          location: "",
          timeOfDay: null,
          groupSize: null,
          startDate: null,
          endDate: null,
        }),

      addRecentSearch: (adventure: AdventureSummary) => {
        const current = get().recentSearches;
        const newList = [
          adventure,
          ...current.filter((a) => a.id !== adventure.id),
        ].slice(0, 5);
        set({ recentSearches: newList });
      },

      removeRecentSearch: (id: string) => {
        const current = get().recentSearches;
        const filtered = current.filter((a) => a.id !== id);
        set({ recentSearches: filtered });
      },

      restoreSearch: (filters: SearchParams) => {
        set({
          budget: filters.budget,
          adventureType: filters.adventureType,
          location: filters.location,
          timeOfDay: filters.timeOfDay ?? null,
          groupSize: filters.groupSize ?? null,
          startDate: filters.startDate ?? null,
          endDate: filters.endDate ?? null,
        });
      },
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
