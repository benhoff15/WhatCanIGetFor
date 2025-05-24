import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share // Added Share
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { MapPin, Calendar, Clock, Bookmark, Share2 } from "lucide-react-native"; // Added Share2
import { Users, AlarmClock } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSearchStore } from "@/store/searchStore";

import { useColors } from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import type { Adventure } from "@/types/adventure";
import Toast from "react-native-toast-message";
// Removed useNavigation

export default function AdventureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Removed router
  const Colors = useColors();
  const styles = createStyles(Colors);
  // Removed navigation
  const { addRecentSearch } = useSearchStore();
  
  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();

  const [adventure, setAdventure] = useState<Adventure | null>(null);

  const baseUrl =
    Constants?.expoConfig?.extra?.RORK_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const res = await fetch(`${baseUrl}/adventure/${id}`); // ✅ Updated
        const json = await res.json();
        console.log("Loaded adventure:", json.adventure);
        setAdventure(json.adventure || null);
      } catch (err) {
        console.error("Failed to load adventure:", err);
        setAdventure(null);
      }
    };

    fetchAdventure();
  }, [id, baseUrl]);

  const isSaved = savedTrips.some((trip) => trip.id === id);

  const handleSaveToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (adventure) {
      if (isSaved) {
        removeTrip(adventure.id);
        Toast.show({ type: "info", text1: "Removed from saved" });
      } else {
        addTrip(adventure);
        Toast.show({ type: "success", text1: "Saved adventure" });
      }
    }
  };

  const formatUTCDate = (isoDate: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(isoDate));

  // Removed handleBack

  if (!adventure) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

const handleBookNow = () => {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (adventure?.bookingUrl) {
    addRecentSearch({
      id: adventure.id,
      title: adventure.title,
      location: adventure.location,
      price: adventure.price,
      adventureType: adventure.type || "", // Fallback in case type is missing
    });

    Linking.openURL(adventure.bookingUrl);
  } else {
    Toast.show({
      type: "info",
      text1: "No booking link available",
    });
  }
};

  const handleShare = async () => {
    if (!adventure) return;
    try {
      await Share.share({
        message: `${adventure.title}: ${adventure.description.substring(0, 150)}... Read more here: ${adventure.bookingUrl || ''}`,
        title: adventure.title,
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message });
    }
  };

  // handleViewMap function removed

  return (
    <>
      <Stack.Screen
        options={{
          title: adventure.title,
          headerTransparent: true,
          headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
        }}
      />

      <View style={styles.container}>
        {/* Removed old header View */}
        {/* Removed separator line View */}

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Add a paddingTop to content to account for transparent header */}
            <View style={{ paddingTop: Constants.statusBarHeight + 56 }} /> 
            {adventure.imageUrl && (
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: adventure.imageUrl }}
                  style={styles.heroImageActual}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                  style={styles.fadeOverlay}
                />
              </View>
            )}

            <Text style={[styles.title, { fontSize: 26, textTransform: "capitalize" }]}>
              {adventure.title}
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.infoText}>{adventure.location}</Text>
              </View>

              {adventure.date && (
                <View style={styles.infoItem}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    {formatUTCDate(adventure.date)}
                  </Text>
                </View>
              )}

              {adventure.duration && (
                <View style={styles.infoItem}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>{adventure.duration}</Text>
                </View>
              )}

              {adventure.timeOfDay && (
                <View style={styles.infoItem}>
                  <AlarmClock size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    {adventure.timeOfDay.charAt(0).toUpperCase() + adventure.timeOfDay.slice(1)}
                  </Text>
                  </View>
                )}

              {adventure.groupSize && (
                <View style={styles.infoItem}>
                  <Users size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>{adventure.groupSize}</Text>
                </View>
              )}

            </View>

            <View style={styles.sectionDivider} />
            {/* Price container removed from here */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{adventure.description}</Text>
            </View>

            {adventure.details && (
              <>
                <View style={styles.sectionDivider} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Details</Text>
                <Text style={styles.detailText}>
                  {Array.isArray(adventure.details)
                    ? adventure.details.join(", ")
                    : adventure.details}
                </Text>
              </View>
            </>
          )}

            {/* New Location Section */}
            <View style={styles.sectionDivider} />  
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <MapPin size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>

              {adventure?.address ? (
                <Text style={styles.locationText}>{adventure.address}</Text>
              ) : (
                <Text style={styles.fallbackText}>Location address not available</Text>
              )}
              {adventure?.latitude != null && adventure?.longitude != null ? (
                <View style={styles.mapContainer}>
                  <iframe
                    title="Map"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${adventure.latitude},${adventure.longitude}&hl=en&z=14&output=embed`}
                  />
                </View>
              ) : (
                <Text style={styles.fallbackText}>Map preview unavailable</Text>
              )}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.floatingSaveButton}
          onPress={handleSaveToggle}
        >
          <Bookmark
            size={26} 
            color={isSaved ? Colors.primary : Colors.text} 
            fill={isSaved ? Colors.primary : "transparent"}
          />
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>${adventure.price}</Text>
          </View>
          <View style={styles.footerActionsRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Share2 size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const createStyles = (Colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Removed header, backButton, saveButton, savedButton styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  heroImageContainer: {
    width: "100%",
    height: 400,
    alignSelf: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: Colors.cardBackground,
  },
  heroImageActual: {
    width: "100%",
    height: "100%",
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
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
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  // priceContainer, priceLabel, price styles removed
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 28,
    color: Colors.textSecondary,
    textAlign: 'justify',
  },
  floatingSaveButton: {
    position: 'absolute',
    top: Constants.statusBarHeight + 12,
    right: 20,
    backgroundColor: Colors.cardBackground, 
    padding: 10,
    borderRadius: 28, 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4.5,
    zIndex: 1, 
  },
  detailText: {
    fontSize: 16,
    lineHeight: 28,
    color: Colors.textSecondary,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  viewMapButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMapButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  pricePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pricePillText: {
    color: Colors.text, 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  footerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  // footerPriceLabel, footerPrice styles removed
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 12,
  },
  fallbackText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});