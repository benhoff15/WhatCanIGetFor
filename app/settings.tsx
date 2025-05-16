import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { trpc } from "@/lib/trpc";

export default function SettingsScreen() {
  const { data: user, isLoading, error } = trpc.user.me.useQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Logged in as:</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    fontSize: 18,
    marginTop: 8,
  },
});
