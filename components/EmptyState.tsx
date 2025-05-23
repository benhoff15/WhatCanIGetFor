import React, { useEffect, useRef } from 'react'; // Added useEffect, useRef
import { StyleSheet, Text, View, Animated, TouchableOpacity as RNTouchableOpacity } from "react-native"; // Added Animated, renamed TouchableOpacity to avoid conflict
import { Search, Bookmark } from "lucide-react-native";

import { useColors } from "@/constants/colors"; 

import { TouchableOpacity } from "react-native"; // This was from previous step, RNTouchableOpacity is for clarity if needed

type EmptyStateProps = {
  title: string;
  message: string;
  icon: "search" | "bookmark";
  actionButtonLabel?: string;
  onActionButtonPress?: () => void;
};

export default function EmptyState({ title, message, icon, actionButtonLabel, onActionButtonPress }: EmptyStateProps) {
  const Colors = useColors();
  const componentStyles = getComponentStyles(Colors); 

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        componentStyles.container, 
        { 
          backgroundColor: Colors.background,
          opacity: opacity,
          transform: [{ scale: scale }],
        }
      ]}
    >
      <View style={componentStyles.iconContainer}> 
        {icon === "search" ? (
          <Search size={64} color={Colors.primary} /> 
        ) : (
          <Bookmark size={64} color={Colors.primary} /> 
        )}
      </View>
      <Text style={[componentStyles.title, { color: Colors.text }]}>{title}</Text>
      <Text style={[componentStyles.message, { color: Colors.textSecondary }]}>{message}</Text>
      {actionButtonLabel && onActionButtonPress && (
        <TouchableOpacity // Using the imported TouchableOpacity
          style={[componentStyles.actionButton, { backgroundColor: Colors.primary }]} 
          onPress={onActionButtonPress}
          activeOpacity={0.8}
        >
          <Text style={componentStyles.actionButtonText}>{actionButtonLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const getComponentStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: { // Updated styles
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: Colors.iconBackground, // Moved from inline
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24, 
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});