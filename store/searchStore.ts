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
}

interface SearchState extends SearchParams {
  setBudget: (budget: number) => void;
  setAdventureType: (type: string) => void;
  setLocation: (location: string) => void;
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
      recentSearches: [],

      setBudget: (budget: number) => set({ budget }),
      setAdventureType: (adventureType: string) => set({ adventureType }),
      setLocation: (location: string) => set({ location }),
      resetSearch: () => set({ budget: 0, adventureType: "", location: "" }),

      addRecentSearch: (adventure: AdventureSummary) => {
        const current = get().recentSearches;
        const newList = [
          adventure,
          ...current.filter((a) => a.id !== adventure.id)
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
        });
      },
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
