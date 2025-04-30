import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MapPin, Calendar, Clock, Bookmark, ArrowLeft } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { Platform } from "react-native";

import Colors from "@/constants/colors";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import { getAdventureById } from "@/utils/mockApi";

export default function AdventureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savedTrips, addTrip, removeTrip } = useSavedTripsStore();
  
  // Get adventure details from mock API
  const adventure = getAdventureById(id);
  const isSaved = savedTrips.some(trip => trip.id === id);

  if (!adventure) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleSaveToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (isSaved) {
      removeTrip(adventure.id);
    } else {
      addTrip(adventure);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: adventure.title,
          headerShown: false,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isSaved && styles.savedButton]}
            onPress={handleSaveToggle}
          >
            <Bookmark 
              size={24} 
              color={isSaved ? Colors.primary : Colors.text}
              fill={isSaved ? Colors.primary : "transparent"}
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>{adventure.title}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.infoText}>{adventure.location}</Text>
              </View>
              
              {adventure.date && (
                <View style={styles.infoItem}>
                  <Calendar size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>{adventure.date}</Text>
                </View>
              )}
              
              {adventure.duration && (
                <View style={styles.infoItem}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={styles.infoText}>{adventure.duration}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>${adventure.price}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{adventure.description}</Text>
            </View>
            
            {adventure.details && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Details</Text>
                {adventure.details.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerPriceLabel}>Total Price</Text>
            <Text style={styles.footerPrice}>${adventure.price}</Text>
          </View>
          
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
  },
  savedButton: {
    backgroundColor: Colors.iconBackground,
  },
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
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  priceContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
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
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
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
  footerPriceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  bookButton: {
    backgroundColor: Colors.primary,
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