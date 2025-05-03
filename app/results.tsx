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
import { MapPin, Bookmark } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { LightColors as Colors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";

export default function ResultsScreen() {
  const router = useRouter();
  const { budget, adventureType, location } = useSearchStore();
  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();

  type Adventure = {
    id: string;
    type: string;
    title: string;
    location: string;
    price: number;
    description: string;
    date?: string | null;
    duration?: string | null;
    details: string;
  };

  const [results, setResults] = React.useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAdventures = async () => {
      setIsLoading(true);

      const trimmedPayload = {
        budget: Number(budget),
        adventureType: adventureType.trim().toLowerCase(),
        location: location.trim()
      };

      console.log("📦 Search store values:", { budget, adventureType, location });
      console.log("🔍 Sending payload:", trimmedPayload);

      try {
        const res = await fetch("http://localhost:3000/api/db/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trimmedPayload),
        });

        const json = await res.json();
        console.log("✅ Response from server:", json);

        setResults(json.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch adventures:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="No adventures found"
        message="Try changing your budget, location, or adventure type."
        icon="search"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSaved = savedTrips.some((t) => t.id === item.id);

          return (
            <TouchableOpacity
              onPress={() => router.push(`/adventure/${item.id}`)}
              onLongPress={() => {
                isSaved ? removeTrip(item.id) : addTrip(item);
                Haptics.selectionAsync();
              }}
              style={styles.item}
            >
              <View style={styles.headerRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Bookmark
                  size={20}
                  color={isSaved ? Colors.primary : Colors.gray}
                  fill={isSaved ? Colors.primary : "transparent"}
                />
              </View>
              <Text style={styles.meta}>
                <MapPin size={16} /> {item.location}
              </Text>
              <Text style={styles.meta}>${item.price}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
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
