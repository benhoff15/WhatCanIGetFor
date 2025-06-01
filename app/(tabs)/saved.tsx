import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image as RNImage, Animated, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
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
  List,
  LayoutGrid,
  MessageSquare,
} from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import { useColors } from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import type { Adventure } from "@/types/adventure";
import EmptyState from "@/components/EmptyState";
import CompactTripCard from "@/components/CompactTripCard";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

interface SavedTripCardProps {
  item: Adventure;
  componentStyles: any;
  Colors: any;
  onPressTrip: (id: string) => void;
  onRemoveTrip: (id: string) => void;
  getTripTypeIcon: (type: string, options?: { size?: number; color?: string; style?: object }) => JSX.Element | null;
  formatUTCDate: (isoDate: string) => string;
  getCategoryTagColor: (type: string) => string;
}

const SavedTripCard = (props: SavedTripCardProps) => {
  const { 
    item, 
    componentStyles, 
    Colors, 
    onPressTrip, 
    onRemoveTrip, 
    getTripTypeIcon, 
    formatUTCDate,
    getCategoryTagColor 
  } = props;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const borderOpacityAnim = React.useRef(new Animated.Value(0)).current;
  const heartScaleAnim = React.useRef(new Animated.Value(1)).current;
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [isCardHovered, setIsCardHovered] = React.useState(false);
  const [isNotesVisible, setIsNotesVisible] = React.useState(false);
  const [currentNotes, setCurrentNotes] = React.useState(item.notes || '');

  const { updateTripNotes } = useSavedTripsStore();

  React.useEffect(() => {
    if (isNotesVisible) {
      setCurrentNotes(item.notes || '');
    }
  }, [isNotesVisible, item.notes]);

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') {
      setIsCardHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsCardHovered(false);
    }
  };

  const handlePressInCard = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 7 }),
      Animated.timing(borderOpacityAnim, { toValue: 1, duration: 150, useNativeDriver: false })
    ]).start();
  };

  const handlePressOutCard = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7 }),
      Animated.timing(borderOpacityAnim, { toValue: 0, duration: 300, useNativeDriver: false })
    ]).start();
  };

  const handleToggleFavorite = () => {
    setIsFavorited(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    Animated.sequence([
      Animated.timing(heartScaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  return (
    <View style={componentStyles.cardWrapperForBorder}>
      <Animated.View style={[componentStyles.gradientBorder, { opacity: borderOpacityAnim }]}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={componentStyles.gradientFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          { transform: [{ scale: scaleAnim }] },
          ...(Platform.OS === "web" && isCardHovered ? [componentStyles.cardHoverScale] : []),
        ]}
      >
        <View
          {...(Platform.OS === "web"
            ? {
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
            }
          : {})}
        >
          <TouchableOpacity
            style={[
              componentStyles.tripCard,
              { backgroundColor: Colors.cardBackground },
              ...(Platform.OS === "web" && isCardHovered
                ? [componentStyles.cardHoverElevated]
                : []),
              ]}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                onPressTrip(item.id);
              }}
              onPressIn={handlePressInCard}
              onPressOut={handlePressOutCard}
              activeOpacity={0.9}
            >
              <View style={componentStyles.thumbnailPlaceholder}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: componentStyles.thumbnailPlaceholder.borderRadius,
                    }}
                    resizeMode="cover"
                  />
                  ) : (
                    <>
                      <LinearGradient
                        colors={[Colors.background, Colors.iconBackground]}
                        style={[
                          StyleSheet.absoluteFill,
                          { borderRadius: componentStyles.thumbnailPlaceholder.borderRadius },
                        ]}
                      />
                      {getTripTypeIcon(item.type, { size: 56, color: Colors.textSecondary + '77' })}
                    </>
                  )}
                </View>

              <View style={componentStyles.infoContainer}>
                <Text style={componentStyles.cardTitle}>{item.title}</Text>

                <View style={componentStyles.chipClusterContainer}>
                  <View
                    style={[
                      componentStyles.detailChip,
                      { backgroundColor: getCategoryTagColor(item.type) },
                    ]}
                  >
                    <View style={componentStyles.iconTextContainer}>
                      {getTripTypeIcon(item.type)}
                    <Text style={componentStyles.cardSubtitle}>
                      {item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}
                    </Text>
                  </View>
                </View>

                {item.location && (
                  <View style={componentStyles.detailChip}>
                    <View style={componentStyles.iconTextContainer}>
                      <LocationIcon
                        size={16}
                        color={Colors.textSecondary}
                        style={componentStyles.subtitleIcon}
                      />
                      <Text style={componentStyles.cardSubtitle}>{item.location}</Text>
                    </View>
                  </View>
                )}

                {item.date && (
                  <View style={componentStyles.detailChip}>
                    <View style={componentStyles.iconTextContainer}>
                      <CalendarDays
                        size={16}
                        color={Colors.textSecondary}
                        style={componentStyles.subtitleIcon}
                      />
                      <Text style={componentStyles.cardSubtitle}>{formatUTCDate(item.date)}</Text>
                    </View>
                  </View>
                )}

                {item.timeOfDay && (
                  <View style={componentStyles.detailChip}>
                    <View style={componentStyles.iconTextContainer}>
                      <Clock
                        size={16}
                        color={Colors.textSecondary}
                        style={componentStyles.subtitleIcon}
                      />
                      <Text style={componentStyles.cardSubtitle}>
                        {item.timeOfDay.charAt(0).toUpperCase() + item.timeOfDay.slice(1)}
                      </Text>
                    </View>
                  </View>
                )}

                {item.groupSize && (
                  <View style={componentStyles.detailChip}>
                    <View style={componentStyles.iconTextContainer}>
                      <Users
                        size={16}
                        color={Colors.textSecondary}
                        style={componentStyles.subtitleIcon}
                      />
                      <Text style={componentStyles.cardSubtitle}>{item.groupSize}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={componentStyles.notesToggleButton}
              onPress={() => {
                const newVisibility = !isNotesVisible;
                setIsNotesVisible(newVisibility);
                if (!newVisibility) {
                  setCurrentNotes(item.notes || '');
                }
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MessageSquare size={18} color={Colors.textSecondary} />
              <Text style={componentStyles.notesToggleButtonText}>
                {isNotesVisible ? "Hide Notes" : (item.notes ? "View/Edit Note" : "Add Note")}
              </Text>
            </TouchableOpacity>

            {isNotesVisible && (
              <View style={componentStyles.notesInputContainer}>
                <TextInput
                  style={componentStyles.notesInput}
                  multiline
                  placeholder="Type your notes here..."
                  placeholderTextColor={Colors.textSecondary}
                  value={currentNotes}
                  onChangeText={setCurrentNotes}
                  textAlignVertical="top"
                />
                <View style={componentStyles.notesActionsContainer}>
                  <TouchableOpacity
                    style={[componentStyles.noteActionButton, componentStyles.cancelNoteButton]} 
                    onPress={() => {
                      setCurrentNotes(item.notes || '');
                      setIsNotesVisible(false);
                    }}
                  >
                    <Text style={[componentStyles.noteActionButtonText, componentStyles.cancelNoteButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[componentStyles.noteActionButton, componentStyles.saveNoteButton]}
                    onPress={() => {
                      updateTripNotes(item.id, currentNotes);
                      setIsNotesVisible(false);
                      Toast.show({
                        type: 'success',
                        text1: 'Note Saved!',
                        visibilityTime: 2000,
                      });
                    }}
                  >
                    <Text style={[componentStyles.noteActionButtonText, componentStyles.saveNoteButtonText]}>Save Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={componentStyles.priceActionsContainer}>
              <Text style={componentStyles.cardPrice}>${item.price}</Text>
              <View style={componentStyles.cardActions}>
                <TouchableOpacity
                  style={componentStyles.actionButton}
                  onPress={handleToggleFavorite}
                  accessibilityLabel={
                    isFavorited ? `Unfavorite ${item.title}` : `Favorite ${item.title}`
                  }
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                    <Heart
                      size={20}
                      color={
                        Platform.OS === "web" && isCardHovered ? "#FF69B4" : Colors.primary
                      }
                      fill={
                        isFavorited
                          ? Platform.OS === "web" && isCardHovered
                            ? "#FF69B4"
                            : Colors.primary
                          : "none"
                      }
                    />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={componentStyles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemoveTrip(item.id);
                  }}
                  accessibilityLabel={`Delete ${item.title}`}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
export default function SavedScreen() {
  const Colors = useColors();
  const componentStyles = styles(Colors);
  const router = useRouter();
  const { removeTrip, addTrip, getSortedSavedTrips } = useSavedTripsStore();
  const sortedTrips = getSortedSavedTrips(); 
  const [lastRemovedTrip, setLastRemovedTrip] = React.useState<Adventure | null>(null);
  const [isCompactMode, setIsCompactMode] = React.useState(false);

  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const headerTranslateY = React.useRef(new Animated.Value(-40)).current;
  const emojiFloatY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerTranslateY, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiFloatY, { toValue: -6, duration: 1200, useNativeDriver: true, delay: 500 }),
        Animated.timing(emojiFloatY, { toValue: 6, duration: 1200, useNativeDriver: true }),
        Animated.timing(emojiFloatY, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

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
    const defaultStyle = componentStyles.subtitleIcon;

    const iconSize = options?.size ?? defaultSize;
    const iconColor = options?.color ?? defaultColor;
    const iconStyle = options?.style ?? defaultStyle;


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

  const handleUndoRemove = () => {
    if (lastRemovedTrip) {
      addTrip(lastRemovedTrip);
      setLastRemovedTrip(null);
      Toast.show({
        type: 'success',
        text1: 'Trip restored!',
        visibilityTime: 2000,
      });
    }
  };

  const handleRemove = (id: string) => {
    const tripToRemove = sortedTrips.find((trip: Adventure) => trip.id === id);
    if (tripToRemove) {
      setLastRemovedTrip(tripToRemove);
      removeTrip(id);

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      Toast.show({
        type: 'success', 
        text1: 'Removed from saved adventures',
        text2: 'Tap here to undo.', 
        onPress: handleUndoRemove,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const formatUTCDate = (isoDate: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
      }).format(new Date(isoDate));

  type ListItem = Adventure | { type: 'header'; title: string; id: string };

  const groupAdventuresByDate = (adventures: Adventure[]): ListItem[] => {
    if (!adventures || adventures.length === 0) {
      return [];
    }

    const grouped: ListItem[] = [];
    let currentDate: string | null | undefined = null;
    
    adventures.forEach((adventure) => {
      const adventureDate = adventure.date ? formatUTCDate(adventure.date) : "No Date";
      if (adventureDate !== currentDate) {
        currentDate = adventureDate;
        grouped.push({
          type: 'header',
          title: currentDate,
          id: `header-${currentDate}`,
        });
      }
      grouped.push(adventure);
    });
    return grouped;
  };

  const displayData = groupAdventuresByDate(sortedTrips);
      
  const handleTripPress = (id: string) => {
    router.push(`/trip/${id}`);
  };

  if (sortedTrips.length === 0) {
    return (
      <EmptyState
        title="No saved adventures"
        message="Your saved adventures will appear here"
        icon="bookmark"
        actionButtonLabel="Go Explore"
        onActionButtonPress={() => {
          if (Platform.OS !== 'web') Haptics.selectionAsync();
          router.push("/");
        }}
      />
    );
  }

  return (
    <View style={[componentStyles.container, { backgroundColor: Colors.background }]}>
      <View style={componentStyles.headerContainer}>
        <View style={componentStyles.ambientShape1} />
        <View style={componentStyles.ambientShape2} />
        <View style={componentStyles.ambientShape3} />
        <Animated.View 
          style={[
            componentStyles.titleBadge, 
            { 
              opacity: headerOpacity, 
              transform: [{ translateY: headerTranslateY }] 
            }
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]} 
            style={componentStyles.gradientWrapper}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={{ transform: [{ translateY: emojiFloatY }] }}>
              <Text style={componentStyles.headerIcon}>🧳</Text>
            </Animated.View>
            <Text style={componentStyles.headerTitle}>Your Adventures</Text>
            <Text style={componentStyles.headerSubtitle}>
              Trips you’ve bookmarked for inspiration or action.
            </Text>
          </LinearGradient>
        </Animated.View>

        <TouchableOpacity
          style={componentStyles.toggleButton}
          onPress={() => setIsCompactMode(prev => !prev)}
          accessibilityLabel={isCompactMode ? "Switch to normal view" : "Switch to compact view"}
        >
          {isCompactMode ? (
            <LayoutGrid size={24} color={Colors.text} />
          ) : (
            <List size={24} color={Colors.text} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={componentStyles.listContent}
        renderItem={({ item }) => {
          const adventureItem = item as Adventure;
          const headerItem = item as { type: 'header'; title: string };

          if (headerItem.type === 'header') {
            return (
              <View style={componentStyles.dateHeaderContainer}>
                <Text style={componentStyles.dateHeaderText}>{headerItem.title}</Text>
              </View>
            );
          }
          if (isCompactMode) {
            return (
              <CompactTripCard
                item={adventureItem}
                Colors={Colors}
                onPressTrip={handleTripPress}
                onRemoveTrip={handleRemove}
                getTripTypeIcon={getTripTypeIcon}
                variant="saved"
              />
            );
          } else {
            return (
              <SavedTripCard
                item={adventureItem}
                componentStyles={componentStyles}
                Colors={Colors}
                onPressTrip={handleTripPress}
                onRemoveTrip={handleRemove}
                getTripTypeIcon={getTripTypeIcon}
                formatUTCDate={formatUTCDate}
                getCategoryTagColor={getCategoryTagColor}
              />
            );
          }
        }}
      />
    </View>
  );
}

const styles = (Colors: any) => StyleSheet.create({ 
  dateHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.uiAccent,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 24, 
    alignItems: 'center',
    position: 'relative', 
    overflow: 'hidden', 
    marginBottom: 10, 
  },
  titleBadge: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: '90%', 
    maxWidth: 360, 
    backgroundColor: 'transparent',
  },
  gradientWrapper: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  headerIcon: { 
    fontSize: 36,
    marginBottom: 10,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    maxWidth: '90%',
  },
  ambientShape1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -20,
    left: -30,
    transform: [{ rotate: '15deg' }],
    zIndex: -1,
  },
  ambientShape2: {
    position: 'absolute',
    width: 150,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -20,
    right: -40,
    transform: [{ rotate: '-10deg' }],
    zIndex: -1,
  },
  ambientShape3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    top: 10,
    right: -20,
    transform: [{ rotate: '25deg' }],
    zIndex: -1,
  },
  listContent: {
    paddingHorizontal: 16, 
    paddingBottom: 16, 
  },
  cardWrapperForBorder: { 
    borderRadius: 18, 
    marginBottom: 16, 
    position: 'relative', 
  },
  gradientBorder: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18, 
    padding: 2, 
  },
  gradientFill: { 
    flex: 1,
    borderRadius: 16, 
  },
  tripCard: { 
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000", 
    shadowOffset: { width: 2, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 4, 
  },
  cardHoverScale: { 
    transform: [{ scale: 1.02 }],
  },
  cardHoverElevated: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  thumbnailPlaceholder: { 
    height: 200,
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  infoContainer: { 
  },
  cardTitle: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  cardSubtitle: { 
    fontSize: 14,
    color: Colors.textSecondary,
  },
  iconTextContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleIcon: { 
    marginRight: 6,
  },
  chipClusterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  priceActionsContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
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
  toggleButton: {
    alignSelf: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: Colors.iconBackground,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  notesToggleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  notesInputContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  notesInput: {
    height: 100,
    borderColor: Colors.uiAccent,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.inputBackground,
    marginBottom: 8, 
  },
  notesActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  noteActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  saveNoteButton: {
    backgroundColor: Colors.primary,
  },
  cancelNoteButton: {
    backgroundColor: Colors.iconBackground,
  },
  noteActionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveNoteButtonText: {
    color: '#fff',
  },
  cancelNoteButtonText: {
    color: Colors.textSecondary,
  }
});