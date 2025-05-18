import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Bookmark } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";
import { useNavigation } from "expo-router";
import { useEffect } from "react";


type Adventure = {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  description: string;
  date?: string | null;
  duration?: string | null;
  details: string[];
};

export default function ResultsScreen() {
  const router = useRouter();
  const Colors = useColors();
  const navigation = useNavigation();

useEffect(() => {
  navigation.setOptions({
    headerStyle: { backgroundColor: Colors.background },
    headerTintColor: Colors.text,
    headerShadowVisible: true,
  });
}, [navigation, Colors]);
  const { budget, adventureType, location } = useSearchStore();
  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();

  const trimmedPayload = {
    budget: Number(budget),
    adventureType: adventureType.trim().toLowerCase(),
    location: location.trim(),
  };

  const { data, isLoading, error } = trpc.search.getAdventures.useQuery(trimmedPayload);

  const toggleSave = (adventure: Adventure) => {
    const alreadySaved = savedTrips.some((trip) => trip.id === adventure.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (alreadySaved) {
      removeTrip(adventure.id);
    } else {
      addTrip(adventure);
    }
  };

  const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: Colors.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
      position: "relative",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: Colors.text,
    },
    meta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    metaText: {
      color: Colors.textSecondary,
    },
    bookmark: {
      position: "absolute",
      top: 16,
      right: 16,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <EmptyState
        title="No adventures found"
        icon="search"
        message="Try changing your budget, location, or adventure type."
      />
    );
  }

return (
  <View style={{ flex: 1, backgroundColor: Colors.background }}>
    <View style={{ height: 1, backgroundColor: Colors.border }} />
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const isSaved = savedTrips.some((trip) => trip.id === item.id);
        return (
          <TouchableOpacity
            onPress={() => router.push(`/adventure/${item.id}`)}
            onLongPress={() => toggleSave(item)}
            style={styles.card}
          >
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.meta}>
              <MapPin size={16} color={Colors.gray} />
              <Text style={styles.metaText}>{item.location}</Text>
              <Text style={styles.metaText}>${item.price}</Text>
            </View>
            <View style={styles.bookmark}>
              <Bookmark
                size={20}
                color={isSaved ? Colors.primary : Colors.gray}
                fill={isSaved ? Colors.primary : "none"}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);
}
