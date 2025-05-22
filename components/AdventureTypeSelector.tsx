import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import {
  Plane,
  BedDouble,
  Utensils,
  MountainSnow,
  Compass,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";

const ADVENTURE_TYPES_DATA = [
  { id: "flight", name: "Flights", icon: Plane },
  { id: "hotel", name: "Stays", icon: BedDouble },
  { id: "food", name: "Food", icon: Utensils },
  { id: "activity", name: "Activities", icon: MountainSnow },
];

export default function AdventureTypeSelector() {
  const Colors = useColors();
  const { adventureType, setAdventureType } = useSearchStore();
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const scaleAnim = new Animated.Value(1);

  const handleSelect = (typeId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setAdventureType(typeId);

    // Animation for press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {ADVENTURE_TYPES_DATA.map((type) => {
        const isSelected = adventureType === type.id;
        const IconComponent = type.icon;

        const dynamicStyles = {
          borderColor: isSelected ? "transparent" : Colors.border,
          borderWidth: isSelected ? 0 : 1,
          shadowOpacity: isSelected ? 0.2 : 0.05,
          shadowRadius: isSelected ? 5 : 3,
          elevation: isSelected ? 4 : 1,
          transform: [{ scale: pressedButton === type.id ? scaleAnim : 1 }],
        };

        const textAndIconColor = isSelected ? "#fff" : Colors.text;

        return (
          <TouchableOpacity
            key={type.id}
            style={styles.buttonWrapper}
            onPress={() => handleSelect(type.id)}
            onPressIn={() => setPressedButton(type.id)}
            onPressOut={() => setPressedButton(null)}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.typeButtonOuter, dynamicStyles]}>
              <LinearGradient
                colors={
                  isSelected
                    ? [Colors.primary, Colors.secondary]
                    : [Colors.cardBackground, Colors.cardBackground]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
              >
                <View style={styles.buttonContent}>
                  <IconComponent
                    color={textAndIconColor}
                    size={20}
                    style={styles.icon}
                  />
                  <Text style={[styles.typeText, { color: textAndIconColor }]}>
                    {type.name}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
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
    width: "48%",
    marginBottom: 12,
  },
  typeButtonOuter: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  gradientBackground: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});