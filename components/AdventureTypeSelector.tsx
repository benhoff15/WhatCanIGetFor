import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plane, Hotel, Utensils, Compass } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { ADVENTURE_TYPES } from "@/constants/adventureTypes";

export default function AdventureTypeSelector() {
  const Colors = useColors();
  const { adventureType, setAdventureType } = useSearchStore();

  const handleSelect = (type: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    setAdventureType(type);
  };

  const getIcon = (type: string, isSelected: boolean) => {
    const color = isSelected ? "#fff" : Colors.textSecondary;
    const size = 20;

    switch (type) {
      case "Flight":
        return <Plane size={size} color={color} />;
      case "Hotel":
        return <Hotel size={size} color={color} />;
      case "Restaurant":
        return <Utensils size={size} color={color} />;
      case "Activity":
        return <Compass size={size} color={color} />;
      default:
        return <Compass size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {ADVENTURE_TYPES.map((type) => {
        const isSelected = adventureType === type;

        return (
          <TouchableOpacity
            key={type}
            style={styles.buttonWrapper}
            onPress={() => handleSelect(type)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={
                isSelected
                  ? [Colors.primary, Colors.secondary]
                  : [Colors.cardBackground, Colors.cardBackground]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.typeButton,
                {
                  borderColor: isSelected ? Colors.primary : Colors.border,
                  shadowOpacity: isSelected ? 0.15 : 0.05,
                  elevation: isSelected ? 3 : 1,
                },
              ]}
            >
              {getIcon(type, isSelected)}
              <Text
                style={[
                  styles.typeText,
                  { color: isSelected ? "#fff" : Colors.text },
                ]}
              >
                {type}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonWrapper: {
    flexBasis: "48%",
  },
  typeButton: {
    borderRadius: 14,
    paddingVertical: 12, // reduced from 16
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    backgroundColor: "transparent",
  },
  typeText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
