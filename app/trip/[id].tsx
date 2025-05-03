import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  MapPin,
  Calendar,
  Clock,
  Trash2,
  ArrowLeft,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useColors } from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import type { Adventure } from "@/types/adventure";

export default function SavedTripDetailScreen() {
  const Colors = useColors(); // 🔥 Themed colors
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savedTrips, removeTrip } = useSavedTripsStore();

  const trip = savedTrips.find((trip) => trip.id === id) as Adventure | undefined;

  if (!trip) {
    router.replace("/saved");
    return null;
  }

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    removeTrip(trip.id);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: trip.title,
          headerShown: false,
        }}
      />

      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.iconButton, { backgroundColor: Colors.cardBackground }]}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: Colors.cardBackground }]}
            onPress={handleDelete}
          >
            <Trash2 size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: Colors.text }]}>{trip.title}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={[styles.infoText, { color: Colors.textSecondary }]}>{trip.location}</Text>
              </View>

              {trip.date && (
                <View style={styles.infoItem}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={[styles.infoText, { color: Colors.textSecondary }]}>{trip.date}</Text>
                </View>
              )}

              {trip.duration && (
                <View style={styles.infoItem}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={[styles.infoText, { color: Colors.textSecondary }]}>{trip.duration}</Text>
                </View>
              )}
            </View>

            <View style={[styles.priceContainer, {
              backgroundColor: Colors.cardBackground,
              borderColor: Colors.border,
            }]}>
              <Text style={[styles.priceLabel, { color: Colors.textSecondary }]}>Price</Text>
              <Text style={[styles.price, { color: Colors.text }]}>${trip.price}</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: Colors.text }]}>Description</Text>
              <Text style={[styles.description, { color: Colors.textSecondary }]}>
                {trip.description}
              </Text>
            </View>

            {trip.details && Array.isArray(trip.details) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>Details</Text>
                {trip.details.map((detail: string, index: number) => (
                  <View key={index} style={styles.detailItem}>
                    <View style={[styles.bulletPoint, { backgroundColor: Colors.primary }]} />
                    <Text style={[styles.detailText, { color: Colors.textSecondary }]}>{detail}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        }]}>
          <View>
            <Text style={[styles.footerPriceLabel, { color: Colors.textSecondary }]}>Total Price</Text>
            <Text style={[styles.footerPrice, { color: Colors.text }]}>${trip.price}</Text>
          </View>

          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: Colors.primary }]}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: { flex: 1 },
  content: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  footerPriceLabel: {
    fontSize: 14,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: "700",
  },
  bookButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
