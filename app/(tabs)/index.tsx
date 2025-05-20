import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Search } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useColors } from "@/constants/colors";
import { useSearchStore } from "@/store/searchStore";
import AdventureTypeSelector from "@/components/AdventureTypeSelector";
import LocationSelector from "@/components/LocationSelector";
import Logo from "@/components/Logo";
import { Trash2 } from "lucide-react-native";
import Toast from "react-native-toast-message";


export default function HomeScreen() {
  const router = useRouter();
  const Colors = useColors();
  const {
    budget,
    setBudget,
    adventureType,
    location,
    restoreSearch,
    recentSearches,
    removeRecentSearch,
  } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  const handleSearch = () => {
    const store = useSearchStore.getState();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    store.setTimeOfDay(timeOfDay);
    store.setGroupSize(groupSize);
    store.setStartDate(startDate ? startDate.toISOString() : null);
    store.setEndDate(endDate ? endDate.toISOString() : null);
    
    router.push("/results");
  };

  const handleRestore = (search: typeof recentSearches[0]) => {
    useSearchStore.getState().setBudget(search.price);

    restoreSearch({
      adventureType: search.adventureType,
      location: search.location,
      budget: search.price,
    });

    router.push("/results");

  };

  const handleRemoveRecent = (id: string) => {
    removeRecentSearch(id);
    Toast.show({
      type: "info",
      text1: "Removed from recent searches",
    });
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
        <View style={styles.logoWrapper}>
          <Logo size={150} />
        </View>

        <Text
          style={{
            maxWidth: 280,
            fontSize: 14,
            color: Colors.textSecondary,
            textAlign: "center",
            lineHeight: 20,
            marginTop: 4,
            marginBottom: 4,
            alignSelf: "center",
          }}
        >
          Discover curated adventures that fit your budget
        </Text>

        <Text style={[styles.title, { color: Colors.text }]}>What could I get for...</Text>

        <View
          style={{
            height: 1,
            backgroundColor: Colors.border,
            marginBottom: 20,
            width: "80%",
            alignSelf: "center",
          }}
        />

        <View
          style={[
            styles.budgetContainer,
            {
              backgroundColor: Colors.cardBackground,
              borderColor: isFocused ? Colors.primary : Colors.border,
            },
          ]}
        >
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
          
        <TouchableOpacity onPress={() => setShowAdvanced((prev) => !prev)} style={{ marginTop: 4, alignItems: "center" }}>
          <Text style={{ color: Colors.primary, fontWeight: "600" }}>
            {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={{ marginTop: 16, gap: 16 }}>
            {/* Time of Day Filter */}
            <View>
              <Text style={[styles.sectionTitle, { color: Colors.text }]}>Time of Day</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {["Morning", "Afternoon", "Evening", "Flexible"].map((label) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() =>
                      setTimeOfDay(timeOfDay === label ? null : label)
                    }
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: timeOfDay === label ? Colors.primary : Colors.grayLight,
                    }}
                  >
                    <Text style={{ color: timeOfDay === label ? "white" : Colors.text }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Group Size Filter */}
            <View>
              <Text style={[styles.sectionTitle, { color: Colors.text }]}>Group Size</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {["Solo", "Couple", "Small Group", "Large Group"].map((label) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() =>
                      setGroupSize(groupSize === label ? null : label)
                    }
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: groupSize === label ? Colors.primary : Colors.grayLight,
                    }}
                  >
                    <Text style={{ color: groupSize === label ? "white" : Colors.text }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View>
              <Text style={[styles.sectionTitle, { color: Colors.text }]}>Date Range: Earliest to Latest</Text>

              <Text style={{ color: Colors.textSecondary, marginBottom: 4 }}>Earliest Date</Text>
              <TextInput
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: Colors.iconBackground,
                  color: Colors.text,
                  marginBottom: 8,
                }}
                value={startDateInput}
                onChangeText={(text) => {
                  setStartDateInput(text);
                  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  if (isoDateRegex.test(text)) {
                    const parsed = new Date(text);
                  if (!isNaN(parsed.getTime())) { 
                    setStartDate(parsed);
                  }
                } else {
                  setStartDate(null);
                }
              }}
              placeholder="YYYY-MM-DD"
              inputMode="text"
              keyboardType="numbers-and-punctuation"
              />

              <Text style={{ color: Colors.textSecondary, marginBottom: 4 }}>Latest Date</Text>
              <TextInput
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: Colors.iconBackground,
                  color: Colors.text,
                }}
                value={endDateInput}
                onChangeText={(text) => {
                  setEndDateInput(text);
                  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  if (isoDateRegex.test(text)) {
                    const parsed = new Date(text);
                  if (!isNaN(parsed.getTime())) {
                    setEndDate(parsed);
                  }
                } else {
                  setEndDate(null);
                }
              }}
              placeholder="YYYY-MM-DD"
              inputMode="text"
              keyboardType="numbers-and-punctuation"
              />

              </View>
            </View>
          )}

        <TouchableOpacity
          style={[styles.searchButton, !isSearchEnabled && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!isSearchEnabled}
        >
          <LinearGradient
            colors={
              isSearchEnabled
                ? [Colors.primary, Colors.secondary]
                : [Colors.disabledLight, Colors.disabled]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Search size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Find Adventures</Text>
          </LinearGradient>
        </TouchableOpacity>

        {recentSearches.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Recent Searches</Text>
            {recentSearches.map((s, i) => (
              <View
                key={s.id}
                style={{
                  backgroundColor: Colors.iconBackground,
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => handleRestore(s)} style={{ flex: 1 }}>
                  <Text style={{ color: Colors.text }}>
                    {s.title} — {s.location} — ${s.price}
                  </Text>
                </TouchableOpacity>
            
                <TouchableOpacity
                  onPress={() => handleRemoveRecent(s.id)}
                  style={{ padding: 8 }}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 16,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 6,
    alignSelf: "flex-end",
    marginBottom: 2,
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
