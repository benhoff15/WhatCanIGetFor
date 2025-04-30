import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Search, Bookmark } from "lucide-react-native";

import Colors from "@/constants/colors";

type EmptyStateProps = {
  title: string;
  message: string;
  icon: "search" | "bookmark";
};

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon === "search" ? (
          <Search size={32} color={Colors.primary} />
        ) : (
          <Bookmark size={32} color={Colors.primary} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
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
    backgroundColor: Colors.iconBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});