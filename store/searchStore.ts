import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchState {
  budget: number;
  adventureType: string;
  location: string;
  setBudget: (budget: number) => void;
  setAdventureType: (type: string) => void;
  setLocation: (location: string) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      budget: 0,
      adventureType: "",
      location: "",
      
      setBudget: (budget) => set({ budget }),
      setAdventureType: (adventureType) => set({ adventureType }),
      setLocation: (location) => set({ location }),
      resetSearch: () => set({ budget: 0, adventureType: "", location: "" }),
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);