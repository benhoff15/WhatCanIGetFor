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
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Clock,
  User,
  Users,
} from "lucide-react-native";
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
  const componentStyles = styles(Colors);
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

  // Data for filter chips
  const TIME_OF_DAY_OPTIONS = [
    { id: "morning", label: "Morning", icon: Sun },
    { id: "afternoon", label: "Afternoon", icon: Sun },
    { id: "evening", label: "Evening", icon: Moon },
    { id: "flexible", label: "Flexible", icon: Clock },
  ];

  const GROUP_SIZE_OPTIONS = [
    { id: "solo", label: "Solo", icon: User },
    { id: "couple", label: "Couple", icon: Users },
    { id: "small_group", label: "Small Group", icon: Users },
    { id: "large_group", label: "Large Group", icon: Users },
  ];

  // Animation states
  const advancedFiltersOpacity = React.useRef(new Animated.Value(0)).current;
  const advancedFiltersHeight = React.useRef(new Animated.Value(0)).current;
  const searchButtonScale = React.useRef(new Animated.Value(1)).current; 

  React.useEffect(() => {
    if (showAdvanced) {
      Animated.parallel([
        Animated.timing(advancedFiltersOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(advancedFiltersHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(advancedFiltersOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(advancedFiltersHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [showAdvanced, advancedFiltersOpacity, advancedFiltersHeight]);

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

  // Handlers for search button animation
  const handlePressInSearch = () => {
    if (!isSearchEnabled) return;
    Animated.spring(searchButtonScale, {
      toValue: 1.05,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handlePressOutSearch = () => {
    if (!isSearchEnabled) return;
    Animated.spring(searchButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={[componentStyles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={componentStyles.scrollView}
        contentContainerStyle={componentStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={componentStyles.heroSection}>
          <LinearGradient
            colors={["#00BFFF", "#CCCCFF"]}
            style={componentStyles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={componentStyles.floatingShape1} />
            <View style={componentStyles.floatingShape2} />
            <View style={componentStyles.floatingShape3} />
            <Logo size={120} />
            <Text style={componentStyles.heroTitle}>What can I get for...</Text>
            <Text style={componentStyles.heroSubtitle}>
              Explore unforgettable adventures based on your budget
            </Text>
          </LinearGradient>
        </View>

        {/* Budget Field */}
        <View
          style={[
            componentStyles.budgetContainer,
            {
              backgroundColor: Colors.iconBackground, 
              borderColor: isFocused ? Colors.primary : "rgba(255, 255, 255, 0.3)",
              shadowOpacity: isFocused ? 0.15 : 0.08,
              transform: [{ scale: isFocused ? 1.03 : 1.0 }],
            },
          ]}
        >
          <Text style={[componentStyles.currencySymbol, { color: Colors.primary }]}>$</Text>
          <TextInput
            style={[componentStyles.budgetInput, { color: Colors.text }]}
            placeholder="Enter your budget"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={budget > 0 ? budget.toString() : ""}
            onChangeText={(text) => setBudget(parseInt(text) || 0)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        <Text style={[componentStyles.tooltipText, { color: Colors.textSecondary }]}>
          Set your budget and unlock your adventure.
        </Text>

        {/* Adventure Type */}
        <View style={componentStyles.sectionContainer}>
          <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>I'm looking for</Text>
          <AdventureTypeSelector />
        </View>

        {/* Location */}
        <View style={componentStyles.sectionContainer}>
          <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>Location</Text>
          <LocationSelector />
        </View>

        {/* Advanced Filters Toggle */}
        <TouchableOpacity
          onPress={() => setShowAdvanced((prev) => !prev)}
          style={componentStyles.advancedSearchToggle}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={componentStyles.advancedSearchText}>
              {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
            </Text>
            {showAdvanced ? (
              <ChevronUp size={18} color={Colors.primary} style={{ marginLeft: 6 }} />
            ) : (
              <ChevronDown size={18} color={Colors.primary} style={{ marginLeft: 6 }} />
            )}
          </View>
        </TouchableOpacity>

        {/* Advanced Filters Container - Animated */}
        {showAdvanced && (
        <Animated.View
          style={{
            opacity: advancedFiltersOpacity,
            maxHeight: advancedFiltersHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000],
            }),
            overflow: "hidden",
            marginTop: 16,
          }}
        >
            <View style={{ gap: 16 }}>
              {/* Time of Day */}
              <View>
                <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>Time of Day</Text>
                <View style={componentStyles.chipContainer}>
                  {TIME_OF_DAY_OPTIONS.map((option) => {
                    const isSelected = timeOfDay === option.id;
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => setTimeOfDay(isSelected ? null : option.id)}
                        style={[
                          componentStyles.chipButton,
                          {
                            backgroundColor: isSelected ? Colors.primary : Colors.iconBackground,
                            borderColor: isSelected ? Colors.primary : Colors.border,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: isSelected ? 2 : 1 },
                            shadowOpacity: isSelected ? 0.12 : 0.05,
                            shadowRadius: isSelected ? 3 : 2,
                            elevation: isSelected ? 3 : 1,
                          },
                        ]}
                      >
                        <IconComponent
                          size={16}
                          color={isSelected ? "#fff" : Colors.textSecondary}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={[componentStyles.chipText, { color: isSelected ? "#fff" : Colors.textSecondary }]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Group Size */}
              <View>
                <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>Group Size</Text>
                <View style={componentStyles.chipContainer}>
                  {GROUP_SIZE_OPTIONS.map((option) => {
                    const isSelected = groupSize === option.id;
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => setGroupSize(isSelected ? null : option.id)}
                        style={[
                          componentStyles.chipButton,
                          {
                            backgroundColor: isSelected ? Colors.primary : Colors.iconBackground,
                            borderColor: isSelected ? Colors.primary : Colors.border,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: isSelected ? 2 : 1 },
                            shadowOpacity: isSelected ? 0.12 : 0.05,
                            shadowRadius: isSelected ? 3 : 2,
                            elevation: isSelected ? 3 : 1,
                          },
                        ]}
                      >
                        <IconComponent
                          size={16}
                          color={isSelected ? "#fff" : Colors.textSecondary}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={[componentStyles.chipText, { color: isSelected ? "#fff" : Colors.textSecondary }]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Date Range */}
            <View>
              <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>Date Range: Earliest to Latest</Text>

              <Text style={{ color: Colors.textSecondary, marginBottom: 4 }}>Earliest Date</Text>
              <TextInput
                style={{
                  paddingVertical: 12, 
                  paddingHorizontal: 16, 
                  borderRadius: 12, 
                  backgroundColor: Colors.iconBackground,
                  color: Colors.text,
                  borderWidth: 1, 
                  borderColor: Colors.border, 
                  marginBottom: 8,
                }}
                placeholderTextColor={Colors.textSecondary} 
                value={startDateInput}
                onChangeText={(text) => {
                  setStartDateInput(text);
                  const isoDateRegex = /^\\d{4}-\\d{2}-\\d{2}$/;
                  if (isoDateRegex.test(text)) {
                    const parsed = new Date(text);
                    if (!isNaN(parsed.getTime())) setStartDate(parsed);
                  } else {
                    setStartDate(null);
                  }
                }}
                placeholder="📅 YYYY-MM-DD"
                inputMode="text"
                keyboardType="numbers-and-punctuation"
              />

              <Text style={{ color: Colors.textSecondary, marginBottom: 4 }}>Latest Date</Text>
              <TextInput
                style={{
                  paddingVertical: 12, 
                  paddingHorizontal: 16, 
                  borderRadius: 12, 
                  backgroundColor: Colors.iconBackground,
                  color: Colors.text,
                  borderWidth: 1, 
                  borderColor: Colors.border, 
                }}
                placeholderTextColor={Colors.textSecondary} 
                value={endDateInput}
                onChangeText={(text) => {
                  setEndDateInput(text);
                  const isoDateRegex = /^\\d{4}-\\d{2}-\\d{2}$/;
                  if (isoDateRegex.test(text)) {
                    const parsed = new Date(text);
                    if (!isNaN(parsed.getTime())) setEndDate(parsed);
                  } else {
                    setEndDate(null);
                  }
                }}
                placeholder="📅 YYYY-MM-DD"
                inputMode="text"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        </Animated.View>
        )}

        {/* Search Button */}
        <TouchableOpacity
          style={[
            componentStyles.searchButton,
            !isSearchEnabled && componentStyles.searchButtonDisabled,
            isSearchEnabled && componentStyles.searchButtonEnabledShadow,
          ]}
          onPress={handleSearch}
          disabled={!isSearchEnabled}
          onPressIn={handlePressInSearch}
          onPressOut={handlePressOutSearch}
          activeOpacity={isSearchEnabled ? 0.8 : 1}
        >
          <Animated.View style={{ transform: [{ scale: searchButtonScale }], borderRadius: 16, overflow: 'hidden' }}>
            <LinearGradient
              colors={
                isSearchEnabled
                  ? [Colors.primary, Colors.secondary]
                  : [Colors.disabledLight, Colors.disabled]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={componentStyles.gradient}
            >
              <Search size={20} color="#fff" />
              <Text style={componentStyles.searchButtonText}>Find Adventures</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
        <Text style={componentStyles.searchButtonMicrocopy}>
          See what adventures match your vibe!
        </Text>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={[componentStyles.sectionTitle, { color: Colors.text }]}>Recent Searches</Text>
            {recentSearches.map((s) => (
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

const styles = (Colors: any) => StyleSheet.create({
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
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: "600",
    marginRight: 8,
    alignSelf: "center",
  },
  budgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
  },
  tooltipText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  advancedSearchToggle: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 4,
  },
  advancedSearchText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
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
    borderRadius: 16,
    overflow: "visible",
    marginTop: 20,
  },
  searchButtonEnabledShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchButtonMicrocopy: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
  heroSection: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroGradient: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 320,
    lineHeight: 22,
    opacity: 0.9,
  },
  floatingShape1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    top: 20,
    left: 20,
    transform: [{ rotate: "15deg" }],
  },
  floatingShape2: {
    position: "absolute",
    width: 150,
    height: 80,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    bottom: 30,
    right: 10,
    transform: [{ rotate: "-10deg" }],
  },
  floatingShape3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    top: 70,
    right: 50,
    transform: [{ rotate: "25deg" }],
  },
});