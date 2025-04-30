import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plane, Hotel, Utensils, Compass } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import Colors from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { ADVENTURE_TYPES } from "@/constants/adventureTypes";

export default function AdventureTypeSelector() {
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
              isSelected && styles.selectedTypeButton,
            ]}
            onPress={() => handleSelect(type)}
          >
            {getIcon(type, isSelected)}
            <Text
              style={[
                styles.typeText,
                isSelected && styles.selectedTypeText,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTypeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  selectedTypeText: {
    color: "#fff",
  },
});