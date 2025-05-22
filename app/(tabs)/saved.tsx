import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image as RNImage, Animated } from "react-native";
import { useRouter } from "expo-router";
import {
  Trash2,
  Heart,
  Plane,
  BedDouble,
  Utensils,
  Compass,
  Image as ImageIcon,
  MapPin as LocationIcon,
  CalendarDays,
  Clock,
  Users,
} from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import { useColors } from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import EmptyState from "@/components/EmptyState";
import Toast from "react-native-toast-message";

interface SavedTripCardProps {
  item: any;
  componentStyles: any;
  Colors: any;
  onPressTrip: (id: string) => void;
  onRemoveTrip: (id: string) => void;
  getTripTypeIcon: (type: string) => JSX.Element | null;
  formatUTCDate: (isoDate: string) => string;
}

const SavedTripCard = (props: SavedTripCardProps) => {
  const { 
    item, 
    componentStyles, 
    Colors, 
    onPressTrip, 
    onRemoveTrip, 
    getTripTypeIcon, 
    formatUTCDate 
  } = props;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressInCard = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 7 }).start();
  };

  const handlePressOutCard = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[componentStyles.tripCard, { backgroundColor: Colors.cardBackground }]}
        onPress={() => onPressTrip(item.id)}
        onPressIn={handlePressInCard}
        onPressOut={handlePressOutCard}
        activeOpacity={0.9} 
      >
        <View style={componentStyles.thumbnailPlaceholder}>
          <ImageIcon size={48} color={Colors.textSecondary} />
        </View>

        <View style={componentStyles.infoContainer}>
          <Text style={componentStyles.cardTitle}>{item.title}</Text>
          
          <View style={componentStyles.iconTextContainer}>
            {getTripTypeIcon(item.type)}
            <Text style={componentStyles.cardSubtitle}>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}</Text>
          </View>

          {item.location && (
            <View style={componentStyles.iconTextContainer}>
              <LocationIcon size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
              <Text style={componentStyles.cardSubtitle}>{item.location}</Text>
            </View>
          )}

          {item.date && (
            <View style={componentStyles.iconTextContainer}>
               <CalendarDays size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
              <Text style={componentStyles.cardSubtitle}>{formatUTCDate(item.date)}</Text>
            </View>
          )}
          
          {item.timeOfDay && (
             <View style={componentStyles.iconTextContainer}>
              <Clock size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
              <Text style={componentStyles.cardSubtitle}>
                {item.timeOfDay.charAt(0).toUpperCase() + item.timeOfDay.slice(1)}
              </Text>
            </View>
          )}

          {item.groupSize && (
            <View style={componentStyles.iconTextContainer}>
              <Users size={16} color={Colors.textSecondary} style={componentStyles.subtitleIcon} />
              <Text style={componentStyles.cardSubtitle}>{item.groupSize}</Text>
            </View>
          )}
        </View>
        
        <View style={componentStyles.priceActionsContainer}>
          <Text style={componentStyles.cardPrice}>${item.price}</Text>
          <View style={componentStyles.cardActions}>
            <TouchableOpacity style={componentStyles.actionButton}>
              <Heart size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={componentStyles.actionButton}
              onPress={(e) => { 
                e.stopPropagation(); 
                onRemoveTrip(item.id);
              }}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SavedScreen() {
  const Colors = useColors();
  const componentStyles = styles(Colors);
  const router = useRouter();
  const { savedTrips, removeTrip } = useSavedTripsStore();

  const getTripTypeIcon = (type: string) => {
    const iconSize = 16;
    const iconColor = Colors.textSecondary;
    switch (type?.toLowerCase()) {
      case "flight":
        return <Plane size={iconSize} color={iconColor} style={componentStyles.subtitleIcon} />;
      case "hotel":
      case "stay":
        return <BedDouble size={iconSize} color={iconColor} style={componentStyles.subtitleIcon} />;
      case "food":
      case "restaurant":
        return <Utensils size={iconSize} color={iconColor} style={componentStyles.subtitleIcon} />;
      case "activity":
      default:
        return <Compass size={iconSize} color={iconColor} style={componentStyles.subtitleIcon} />;
    }
  };

  const handleRemove = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    removeTrip(id);
    Toast.show({
      type: "info",
      text1: "Removed from saved adventures",
    });
  };

  const formatUTCDate = (isoDate: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
      }).format(new Date(isoDate));

      
  const handleTripPress = (id: string) => {
    router.push(`/trip/${id}`);
  };

  if (savedTrips.length === 0) {
    return (
      <EmptyState
        title="No saved adventures"
        message="Your saved adventures will appear here"
        icon="bookmark"
        actionButtonLabel="Go Explore"
        onActionButtonPress={() => router.push("/")}
      />
    );
  }

  return (
    <View style={[componentStyles.container, { backgroundColor: Colors.background }]}>
      <View style={componentStyles.headerContainer}>
        <Text style={componentStyles.headerIcon}>🧳</Text>
        <Text style={componentStyles.headerTitle}>Your Adventures</Text>
        <Text style={componentStyles.headerSubtitle}>
          Trips you’ve bookmarked for inspiration or action.
        </Text>
      </View>

      <FlatList
        data={savedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={componentStyles.listContent}
        renderItem={({ item }) => (
          <SavedTripCard
            item={item}
            componentStyles={componentStyles}
            Colors={Colors}
            onPressTrip={handleTripPress}
            onRemoveTrip={handleRemove}
            getTripTypeIcon={getTripTypeIcon}
            formatUTCDate={formatUTCDate}
          />
        )}
      />
    </View>
  );
}

const styles = (Colors: any) => StyleSheet.create({ 
  container: {
    flex: 1,
  },
  headerContainer: { 
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerIcon: { 
    fontSize: 32,
    marginBottom: 8,
  },
  headerTitle: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSubtitle: { 
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: '80%',
  },
  listContent: {
    paddingHorizontal: 16, 
    paddingBottom: 16, 
  },
  tripCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailPlaceholder: {
    height: 100,
    backgroundColor: Colors.iconBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtitleIcon: {
    marginRight: 6,
  },
  priceActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
    padding: 6,
  },
});