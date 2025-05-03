import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Search } from "lucide-react-native";
import * as Haptics from 'expo-haptics';

import { useColors } from "@/constants/colors";  // ✅ updated import
import { useSearchStore } from "@/store/searchStore";
import AdventureTypeSelector from "@/components/AdventureTypeSelector";
import LocationSelector from "@/components/LocationSelector";

export default function HomeScreen() {
  const router = useRouter();
  const Colors = useColors();  // ✅ use themed colors
  const { budget, setBudget, adventureType, location } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/results");
  };

  const isSearchEnabled = budget > 0 && adventureType && location;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors.text }]}>What could I get for...</Text>
        </View>
        
        <View style={[
          styles.budgetContainer, 
          { backgroundColor: Colors.cardBackground, borderColor: isFocused ? Colors.primary : Colors.border },
        ]}>
          <Text style={[styles.currencySymbol, { color: Colors.primary }]}>$</Text>
          <TextInput
            style={[styles.budgetInput, { color: Colors.text }]}
            placeholder="Enter your budget"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={budget > 0 ? budget.toString() : ""}
            onChangeText={(text) => setBudget(parseInt(text) || 0)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>I'm looking for</Text>
          <AdventureTypeSelector />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Location</Text>
          <LocationSelector />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, !isSearchEnabled && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!isSearchEnabled}
        >
          <LinearGradient
            colors={isSearchEnabled ? [Colors.primary, Colors.secondary] : [Colors.disabledLight, Colors.disabled]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Search size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Find Adventures</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 12,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
