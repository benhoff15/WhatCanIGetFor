import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Pressable,
} from "react-native";
import {
  Plane,
  BedDouble,
  Utensils,
  MountainSnow,
  Compass,
  Check,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";

const ADVENTURE_TYPES_DATA = [
  { id: "flight", name: "Flights", icon: Plane },
  { id: "hotel", name: "Hotels", icon: BedDouble },
  { id: "food", name: "Food", icon: Utensils },
  { id: "activity", name: "Activities", icon: MountainSnow },
];

export default function AdventureTypeSelector() {
  const Colors = useColors();
  const { adventureType, setAdventureType } = useSearchStore();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Animation refs for each button
  const scaleAnims = useRef(
    ADVENTURE_TYPES_DATA.map(() => new Animated.Value(1))
  ).current;
  const checkmarkOpacities = useRef(
    ADVENTURE_TYPES_DATA.map(() => new Animated.Value(0))
  ).current;
  const glowOpacities = useRef(
    ADVENTURE_TYPES_DATA.map(() => new Animated.Value(0))
  ).current;

  const handleSelect = (typeId: string, index: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setAdventureType(typeId);

    // Animate checkmark
    Animated.sequence([
      Animated.timing(checkmarkOpacities[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkOpacities[index], {
        toValue: 0,
        duration: 200,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate glow
    Animated.sequence([
      Animated.timing(glowOpacities[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacities[index], {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {ADVENTURE_TYPES_DATA.map((type, index) => {
        const isSelected = adventureType === type.id;
        const IconComponent = type.icon;

        if (Platform.OS === 'web') {
          return (
            <Pressable
              key={type.id}
              style={styles.buttonWrapper}
              onPress={() => handleSelect(type.id, index)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              onHoverIn={() => setHoveredButton(type.id)}
              onHoverOut={() => setHoveredButton(null)}
            >
              <Animated.View
                style={[
                  styles.typeButtonOuter,
                  {
                    transform: [{ scale: scaleAnims[index] }],
                  },
                ]}
              >
                {/* Glow effect */}
                <Animated.View
                  style={[
                    styles.glowEffect,
                    {
                      opacity: glowOpacities[index],
                      backgroundColor: isSelected ? Colors.primary : 'transparent',
                    },
                  ]}
                />

                <LinearGradient
                  colors={
                    isSelected
                      ? [Colors.primary, Colors.secondary]
                      : [Colors.cardBackground, Colors.cardBackground]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.gradientBackground,
                    hoveredButton === type.id && !isSelected && styles.hoveredBackground,
                  ]}
                >
                  <View style={styles.buttonContent}>
                    <IconComponent
                      color={isSelected ? "#fff" : Colors.text}
                      size={24}
                      style={styles.icon}
                    />
                    <Text
                      style={[
                        styles.typeText,
                        { color: isSelected ? "#fff" : Colors.text },
                      ]}
                    >
                      {type.name}
                    </Text>
                  </View>

                  {/* Checkmark overlay */}
                  <Animated.View
                    style={[
                      styles.checkmarkOverlay,
                      { opacity: checkmarkOpacities[index] },
                    ]}
                  >
                    <Check size={24} color="#fff" />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
            </Pressable>
          );
        }

        return (
          <TouchableOpacity
            key={type.id}
            style={styles.buttonWrapper}
            onPress={() => handleSelect(type.id, index)}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.typeButtonOuter,
                {
                  transform: [{ scale: scaleAnims[index] }],
                },
              ]}
            >
              {/* Glow effect */}
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    opacity: glowOpacities[index],
                    backgroundColor: isSelected ? Colors.primary : 'transparent',
                  },
                ]}
              />

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
                    color={isSelected ? "#fff" : Colors.text}
                    size={24}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      { color: isSelected ? "#fff" : Colors.text },
                    ]}
                  >
                    {type.name}
                  </Text>
                </View>

                {/* Checkmark overlay */}
                <Animated.View
                  style={[
                    styles.checkmarkOverlay,
                    { opacity: checkmarkOpacities[index] },
                  ]}
                >
                  <Check size={24} color="#fff" />
                </Animated.View>
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
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    zIndex: 0,
  },
  gradientBackground: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  hoveredBackground: {
    borderColor: 'rgba(0, 191, 255, 0.3)',
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 191, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});