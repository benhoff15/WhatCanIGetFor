import React, { createContext, useContext, useMemo } from "react";
import { Appearance } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";

const ThemeContext = createContext<"light" | "dark">("light");

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useSettingsStore();
  const colorScheme = useMemo(() => (darkMode ? "dark" : "light"), [darkMode]);

  return (
    <ThemeContext.Provider value={colorScheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);