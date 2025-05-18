import React, { createContext, useContext } from "react";
import { useSettingsStore } from "@/store/settingsStore";

const ThemeContext = createContext<"light" | "dark">("light");

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const darkMode = useSettingsStore((state) => state.darkMode);

  return (
    <ThemeContext.Provider value={darkMode ? "dark" : "light"}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
