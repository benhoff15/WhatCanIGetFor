import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Search, Bookmark } from "lucide-react-native";

import { useColors } from "@/constants/colors"; 

import { TouchableOpacity } from "react-native";

type EmptyStateProps = {
  title: string;
  message: string;
  icon: "search" | "bookmark";
  actionButtonLabel?: string;
  onActionButtonPress?: () => void;
};

export default function EmptyState({ title, message, icon, actionButtonLabel, onActionButtonPress }: EmptyStateProps) {
  const Colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: Colors.iconBackground }]}>
        {icon === "search" ? (
          <Search size={32} color={Colors.primary} />
        ) : (
          <Bookmark size={32} color={Colors.primary} />
        )}
      </View>
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: Colors.textSecondary }]}>{message}</Text>
      {actionButtonLabel && onActionButtonPress && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.primary }]} 
          onPress={onActionButtonPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionButtonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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