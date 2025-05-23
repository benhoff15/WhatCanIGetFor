import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, Bookmark, Plane, BedDouble, Utensils, Compass } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";
import ResultCard from "@/components/ResultCard";
import CompactTripCard from "@/components/CompactTripCard";
import { LayoutGrid, List } from "lucide-react-native";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";

import type { Adventure } from '@/types/adventure';

export default function ResultsScreen() {
  const router = useRouter();
  const Colors = useColors();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const {
    budget,
    adventureType,
    location,
    timeOfDay,
    groupSize,
    startDate,
    endDate,
  } = useSearchStore();

  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();
  const [isCompactMode, setIsCompactMode] = React.useState(false);

  const trimmedPayload = {
    budget: Number(budget),
    adventureType: adventureType.trim().toLowerCase(),
    location: location.trim(),
    timeOfDay,
    groupSize,
    startDate,
    endDate,
  };

  const { data, isLoading, error } = trpc.search.getAdventures.useQuery(trimmedPayload);

  const handleAdventurePress = (id: string) => {
    router.push(`/adventure/${id}`);
  };

  const toggleSave = (adventure: Adventure) => {
    const alreadySaved = savedTrips.some((trip) => trip.id === adventure.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (alreadySaved) {
      removeTrip(adventure.id);
    } else {
      addTrip(adventure);
    }
  };

  const formatUTCDate = (isoDate: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(isoDate));

  const getCategoryTagColor = (type: string): string => {
    const typeLower = type?.toLowerCase();
    switch (typeLower) {
      case 'activity': return Colors.activityTagBackground || '#E6E0F8';
      case 'food':
      case 'restaurant': return Colors.foodTagBackground || '#FDEBD0';
      case 'hotel':
      case 'stay': return Colors.hotelTagBackground || '#D6EFED';
      case 'flight': return Colors.flightTagBackground || '#D6EAF8';
      default: return Colors.iconBackground;
    }
  };

  const getTripTypeIcon = (type: string, options?: { size?: number; color?: string; style?: object }) => {
    const defaultSize = 16;
    const defaultColor = Colors.textSecondary;

    const iconSize = options?.size ?? defaultSize;
    const iconColor = options?.color ?? defaultColor;
    const iconStyle = options?.style ?? {}; 


    switch (type?.toLowerCase()) {
      case "flight":
        return <Plane size={iconSize} color={iconColor} style={iconStyle} />;
      case "hotel":
      case "stay":
        return <BedDouble size={iconSize} color={iconColor} style={iconStyle} />;
      case "food":
      case "restaurant":
        return <Utensils size={iconSize} color={iconColor} style={iconStyle} />;
      case "activity":
      default:
        return <Compass size={iconSize} color={iconColor} style={iconStyle} />;
    }
  };


  const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    headerContainer: {
    },
    headerGradient: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'android' ? 40 : 30,
      paddingBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'center',
    },
    filterBannerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: Colors.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    filterPill: {
      backgroundColor: Colors.iconBackground,
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterPillText: {
      color: Colors.textSecondary,
      fontSize: 12,
    },
    ambientShapeResults1: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: Colors.primary + '0D',
      top: -50,
      left: -80,
      zIndex: -1,
      transform: [{ rotate: '30deg' }],
    },
    ambientShapeResults2: {
      position: 'absolute',
      width: 250,
      height: 180,
      borderRadius: 90,
      backgroundColor: Colors.secondary + '0A',
      bottom: -60,
      right: -100,
      zIndex: -1,
      transform: [{ rotate: '-20deg' }],
    },
    ambientShapeResults3: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 30,
      backgroundColor: Colors.iconBackground + '1A',
      top: '30%',
      right: -40,
      zIndex: -1,
      transform: [{ rotate: '45deg' }],
    },
    compactToggleButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
    },
    compactCardWrapper: {
      paddingHorizontal: 16,
      paddingBottom: 12,
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
        title="No matches found"
        icon="search"
        message="Try adjusting your filters"
      />
    );
  }

return (
  <View style={{ flex: 1, backgroundColor: Colors.background }}>
    <View style={styles.ambientShapeResults1} />
    <View style={styles.ambientShapeResults2} />
    <View style={styles.ambientShapeResults3} />

    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Results for You</Text>
        <Text style={styles.headerSubtitle}>Trips matching your budget and vibe</Text>

        <TouchableOpacity
          style={[styles.compactToggleButton, { position: 'absolute', top: 16, right: 16 }]}
          onPress={() => setIsCompactMode((prev) => !prev)}
          accessibilityLabel={isCompactMode ? "Switch to normal view" : "Switch to compact view"}
        >
          {isCompactMode ? (
            <LayoutGrid size={24} color="#fff" />
          ) : (
            <List size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>

    <View style={styles.filterBannerContainer}>
      {budget && Number(budget) > 0 && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Budget $${Number(budget)}`}>
          <Text style={styles.filterPillText}>💵 Budget: ${Number(budget)}</Text>
        </View>
      )}
      {adventureType && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Type ${adventureType}`}>
          <Text style={styles.filterPillText}>🏷️ Type: {adventureType.charAt(0).toUpperCase() + adventureType.slice(1)}</Text>
        </View>
      )}
      {location && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Location ${location}`}>
          <Text style={styles.filterPillText}>📍 Location: {location}</Text>
        </View>
      )}
      {timeOfDay && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Time of day ${timeOfDay}`}>
          <Text style={styles.filterPillText}>🕒 Time: {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</Text>
        </View>
      )}
      {groupSize && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Group size ${groupSize}`}>
          <Text style={styles.filterPillText}>👥 Group: {groupSize}</Text>
        </View>
      )}
      {startDate && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: Start date ${formatUTCDate(startDate)}`}>
          <Text style={styles.filterPillText}>🗓️ From: {formatUTCDate(startDate)}</Text>
        </View>
      )}
      {endDate && (
        <View style={styles.filterPill} accessible={true} accessibilityLabel={`Filter applied: End date ${formatUTCDate(endDate)}`}>
          <Text style={styles.filterPillText}>🗓️ To: {formatUTCDate(endDate)}</Text>
        </View>
      )}
    </View>

    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      renderItem={({ item, index }) => {
        const isSaved = savedTrips.some((trip) => trip.id === item.id);

        if (isCompactMode) {
          return (
            <View style={styles.compactCardWrapper}>
              <CompactTripCard
                item={item}
                Colors={Colors}
                onPressTrip={handleAdventurePress}
                onRemoveTrip={() => toggleSave(item)}
                getTripTypeIcon={getTripTypeIcon}
              />
            </View>
          );
        }

        return (
          <ResultCard
            item={item}
            index={index}
            Colors={Colors}
            onPressItem={handleAdventurePress}
            onSaveItem={toggleSave}
            isSaved={isSaved}
            getTripTypeIcon={getTripTypeIcon}
            formatUTCDate={formatUTCDate}
            getCategoryTagColor={getCategoryTagColor}
          />
        );
      }}
    />
  </View>
);
}