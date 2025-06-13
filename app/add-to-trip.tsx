import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Plus, Plane, BedDouble, Utensils, Compass } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/constants/colors';
import { useSavedTripsStore } from '@/store/savedTripsStore';
import CompactTripCard from '@/components/CompactTripCard';
import Toast from 'react-native-toast-message';

export default function AddToTripScreen() {
  const Colors = useColors();
  const { tripBlockId } = useLocalSearchParams<{ tripBlockId: string }>();
  const router = useRouter();
  const { 
    getSortedSavedTrips,
    getTripBlockById,
    addAdventureToTripBlock,
  } = useSavedTripsStore();

  const tripBlock = getTripBlockById(tripBlockId);
  const availableAdventures = getSortedSavedTrips().filter(
    (adventure) => !adventure.tripBlockId
  );

  if (!tripBlock) {
    router.replace('/saved');
    return null;
  }

  const handleAddAdventure = (adventureId: string) => {
    const adventure = availableAdventures.find((a) => a.id === adventureId);
    if (adventure) {
      addAdventureToTripBlock(tripBlockId, adventure);
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      Toast.show({
        type: 'success',
        text1: 'Adventure added to trip!',
        visibilityTime: 2000,
      });
    }
  };

  const getTripTypeIcon = (type: string, options?: { size?: number; color?: string; style?: object }) => {
    const defaultSize = 16;
    const defaultColor = Colors.textSecondary;
    const defaultStyle = {};

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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors.text }]}>
            Add to {tripBlock.name}
          </Text>
        </View>

        <FlatList
          data={availableAdventures}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <CompactTripCard
                item={item}
                Colors={Colors}
                onPressTrip={() => handleAddAdventure(item.id)}
                getTripTypeIcon={getTripTypeIcon}
                variant="saved"
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: Colors.primary }]}
                onPress={() => handleAddAdventure(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: Colors.textSecondary }]}>
                No available adventures to add
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 