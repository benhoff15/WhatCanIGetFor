import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import Colors from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";

export default function SavedScreen() {
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
    <View style={styles.container}>
      <FlatList
        data={savedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tripCard}
            onPress={() => handleTripPress(item.id)}
          >
            <View style={styles.tripInfo}>
              <Text style={styles.tripType}>{item.type}</Text>
              <Text style={styles.tripTitle}>{item.title}</Text>
              <Text style={styles.tripLocation}>
                {item.location}
              </Text>
              <Text style={styles.tripPrice}>${item.price}</Text>
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
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripInfo: {
    flex: 1,
  },
  tripType: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  tripLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  removeButton: {
    justifyContent: "center",
    padding: 8,
  },
});