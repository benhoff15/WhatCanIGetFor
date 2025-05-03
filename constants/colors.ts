const LightColors = {
  primary: "#5D8BF4",
  secondary: "#7B9EFF",
  background: "#FFFFFF",
  cardBackground: "#F8F9FA",
  iconBackground: "#EDF2FF",
  border: "#E9ECEF",
  text: "#212529",
  textSecondary: "#6C757D",
  gray: "#9CA3AF",
  grayLight: "#F1F3F5",
  success: "#40C057",
  error: "#FA5252",
  warning: "#FD7E14",
  switchTrack: "#DEE2E6",
  switchThumb: "#FFFFFF",
  disabled: "#ADB5BD",
  disabledLight: "#CED4DA",
};

const DarkColors = {
  primary: "#5D8BF4",
  secondary: "#7B9EFF",
  background: "#121212",
  cardBackground: "#1E1E1E",
  iconBackground: "#2C2C2E",
  border: "#2C2C2E",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  gray: "#888",
  grayLight: "#2C2C2E",
  success: "#40C057",
  error: "#FA5252",
  warning: "#FD7E14",
  switchTrack: "#555",
  switchThumb: "#FFF",
  disabled: "#555",
  disabledLight: "#666",
};

import { useTheme } from "@/providers/theme";

export const useColors = () => {
  const theme = useTheme();
  return theme === "dark" ? DarkColors : LightColors;
};