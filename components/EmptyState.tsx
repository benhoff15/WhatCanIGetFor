import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Search, Bookmark } from "lucide-react-native";

import { useColors } from "@/constants/colors";

type EmptyStateProps = {
  title: string;
  message: string;
  icon: "search" | "bookmark";
};

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  const Colors = useColors(); // 🌓 Access theme-based colors

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: Colors.iconBackground }]}>
        {icon === "search" ? (
          <Search size={32} color={Colors.primary} />
        ) : (
          <Bookmark size={32} color={Colors.primary} />
        )}
      </View>
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: Colors.textSecondary }]}>{message}</Text>
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
});
