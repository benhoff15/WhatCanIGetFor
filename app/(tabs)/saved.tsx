import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import { useColors } from "@/constants/colors"; // ✅ Themed colors
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";

export default function SavedScreen() {
  const Colors = useColors(); // ✅ Access themed palette
  const router = useRouter();
  const { savedTrips, removeTrip } = useSavedTripsStore();

  const handleRemove = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    removeTrip(id);
  };

  const handleTripPress = (id: string) => {
    router.push(`/trip/${id}`);
  };

  if (savedTrips.length === 0) {
    return (
      <EmptyState
        title="No saved adventures"
        message="Your saved adventures will appear here"
        icon="bookmark"
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <FlatList
        data={savedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tripCard, {
              backgroundColor: Colors.cardBackground,
              borderColor: Colors.border,
            }]}
            onPress={() => handleTripPress(item.id)}
          >
            <View style={styles.tripInfo}>
              <Text style={[styles.tripType, { color: Colors.primary }]}>
                {item.type}
              </Text>
              <Text style={[styles.tripTitle, { color: Colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.tripLocation, { color: Colors.textSecondary }]}>
                {item.location}
              </Text>
              <Text style={[styles.tripPrice, { color: Colors.text }]}>
                ${item.price}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  tripCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  tripInfo: {
    flex: 1,
  },
  tripType: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  tripLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  removeButton: {
    justifyContent: "center",
    padding: 8,
  },
});
