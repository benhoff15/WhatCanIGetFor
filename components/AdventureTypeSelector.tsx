import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plane, Hotel, Utensils, Compass } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { ADVENTURE_TYPES } from "@/constants/adventureTypes";

export default function AdventureTypeSelector() {
  const Colors = useColors(); // 🌓 Dynamic theme colors
  const { adventureType, setAdventureType } = useSearchStore();

  const handleSelect = (type: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setAdventureType(type);
  };

  const getIcon = (type: string, isSelected: boolean) => {
    const color = isSelected ? "#fff" : Colors.textSecondary;
    const size = 24;

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
            style={[
              styles.typeButton,
              {
                backgroundColor: isSelected ? Colors.primary : Colors.cardBackground,
                borderColor: isSelected ? Colors.primary : Colors.border,
              },
            ]}
            onPress={() => handleSelect(type)}
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
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  typeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
