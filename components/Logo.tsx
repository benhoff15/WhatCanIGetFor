import React, { useMemo } from "react";
import { Image, View, StyleSheet } from "react-native";
import { useColors } from "@/constants/colors";

export default function Logo({ size = 64 }: { size?: number }) {
  const Colors = useColors();

  const logoSource = useMemo(() => {
    return Colors.background === "#FFFFFF"
      ? require("@/assets/logo-dark.png") // shown on light mode
      : require("@/assets/logo-light.png"); // shown on dark mode
  }, [Colors.background]);

  return (
    <Image
      source={logoSource}
      style={{ width: size, height: size, resizeMode: "contain" }}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
});
