import { Stack } from "expo-router";
import { LightColors as Colors } from "@/constants/colors";

export default function AdventureLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    />
  );
}
