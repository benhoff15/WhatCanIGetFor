import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bookmark, MapPin } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import { trpc } from "@/lib/trpc";
import EmptyState from "@/components/EmptyState";

export default function ResultsScreen() {
  const router = useRouter();
  const { budget, adventureType, location } = useSearchStore();
  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();

  const { data: results = [], isLoading } = trpc.search.getAdventures.useQuery({
    budget,
    adventureType,
    location
  });

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (results.length === 0) {
    return <EmptyState
    title="No adventures found"
    message="Try changing your budget, location, or adventure type."
    icon="search"
  />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/adventure/${item.id}`)}
            onLongPress={() => {
              const isSaved = savedTrips.some((t) => t.id === item.id);
              isSaved ? removeTrip(item.id) : addTrip(item);
              Haptics.selectionAsync();
            }}
            style={styles.item}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>
              <MapPin size={16} /> {item.location}
            </Text>
            <Text style={styles.meta}>${item.price}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  item: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.grayLight
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  meta: {
    fontSize: 14,
    marginTop: 4
  },
  desc: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.gray
  }
});
