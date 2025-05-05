import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { MapPin, X, Search } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import { useSettingsStore } from "@/store/settingsStore";
import { POPULAR_LOCATIONS } from "@/constants/locations";

export default function LocationSelector() {
  const Colors = useColors();
  const { location, setLocation } = useSearchStore();
  const { useLocation } = useSettingsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredLocations = searchQuery
    ? POPULAR_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_LOCATIONS;

  const handleSelectLocation = (selectedLocation: string) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setLocation(selectedLocation);
    setModalVisible(false);
  };

  const handleUseCurrentLocation = async () => {
    if (Platform.OS === "web") {
      setLocation("Current Location");
      setModalVisible(false);
      return;
    }

    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const { city, region } = geocode[0];
        const locationName =
          city && region ? `${city}, ${region}` : "Current Location";
        setLocation(locationName);
      } else {
        setLocation("Current Location");
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setLocation("Current Location");
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocation = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setLocation("");
  };

  return (
    <View style={styles(Colors).container}>
      {location ? (
        <View style={styles(Colors).selectedLocation}>
          <View style={styles(Colors).locationContent}>
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles(Colors).locationText}>{location}</Text>
          </View>
          <TouchableOpacity
            style={styles(Colors).clearButton}
            onPress={handleClearLocation}
          >
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles(Colors).selectButton}
          onPress={() => setModalVisible(true)}
        >
          <MapPin size={18} color={Colors.primary} />
          <Text style={styles(Colors).selectButtonText}>Select a location</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(Colors).modalContainer}>
          <View style={styles(Colors).modalContent}>
            <View style={styles(Colors).modalHeader}>
              <Text style={styles(Colors).modalTitle}>Select Location</Text>
              <TouchableOpacity
                style={styles(Colors).closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles(Colors).searchContainer}>
              <Search size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles(Colors).searchInput}
                placeholder="Search locations"
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {useLocation && (
              <TouchableOpacity
                style={styles(Colors).currentLocationButton}
                onPress={handleUseCurrentLocation}
                disabled={loading}
              >
                <MapPin size={18} color={Colors.primary} />
                <Text style={styles(Colors).currentLocationText}>
                  {loading ? "Getting location..." : "Use current location"}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles(Colors).sectionTitle}>Popular Locations</Text>

            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles(Colors).locationItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <MapPin size={16} color={Colors.textSecondary} />
                  <Text style={styles(Colors).locationItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles(Colors).emptyText}>No locations found</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (Colors: any) =>
  StyleSheet.create({
    container: { width: "100%" },
    selectedLocation: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    locationContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    locationText: {
      fontSize: 16,
      color: Colors.text,
      marginLeft: 8,
    },
    clearButton: { padding: 4 },
    selectButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    selectButtonText: {
      fontSize: 16,
      color: Colors.textSecondary,
      marginLeft: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors.text,
    },
    closeButton: { padding: 4 },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: Colors.text,
      marginLeft: 8,
    },
    currentLocationButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    currentLocationText: {
      fontSize: 16,
      color: Colors.text,
      marginLeft: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.textSecondary,
      marginBottom: 12,
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    locationItemText: {
      fontSize: 16,
      color: Colors.text,
      marginLeft: 8,
    },
    emptyText: {
      fontSize: 16,
      color: Colors.textSecondary,
      textAlign: "center",
      marginTop: 20,
    },
  });
