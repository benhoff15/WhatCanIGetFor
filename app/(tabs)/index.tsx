import React, { useState, useEffect, useRef } from "react";
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
  Pressable,
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
  Plane,
  SlidersHorizontal,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { DateRange } from "react-date-range";
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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
  const budgetGlowAnim = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);
  const advancedToggleScale = useRef(new Animated.Value(1)).current;
  const advancedToggleRotate = useRef(new Animated.Value(0)).current;
  const [isAdvancedHovered, setIsAdvancedHovered] = useState(false);

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

  // Animation refs for hero section
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const subtitleOpacity = React.useRef(new Animated.Value(0)).current;
  const logoScale = React.useRef(new Animated.Value(0.9)).current;
  const planePosition = React.useRef(new Animated.Value(0)).current;
  const cloud1Position = React.useRef(new Animated.Value(0)).current;
  const cloud2Position = React.useRef(new Animated.Value(0)).current;
  const cloud3Position = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate hero elements on mount
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Start continuous animations
    const startContinuousAnimations = () => {
      // Plane animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(planePosition, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(planePosition, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Cloud animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(cloud1Position, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: true,
          }),
          Animated.timing(cloud1Position, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(cloud2Position, {
            toValue: 1,
            duration: 18000,
            useNativeDriver: true,
          }),
          Animated.timing(cloud2Position, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(cloud3Position, {
            toValue: 1,
            duration: 12000,
            useNativeDriver: true,
          }),
          Animated.timing(cloud3Position, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startContinuousAnimations();
  }, []);

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

  const handleAdvancedPressIn = () => {
    Animated.spring(advancedToggleScale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handleAdvancedPressOut = () => {
    Animated.spring(advancedToggleScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handleAdvancedToggle = () => {
    Animated.parallel([
      Animated.spring(advancedToggleScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }),
      Animated.spring(advancedToggleRotate, {
        toValue: showAdvanced ? 0 : 1,
        useNativeDriver: true,
        friction: 7,
      }),
    ]).start();
    setShowAdvanced((prev) => !prev);
  };

  const renderBudgetField = () => {
    const commonStyles = [
      componentStyles.budgetContainer,
      {
        backgroundColor: Colors.iconBackground,
        borderColor: isFocused ? Colors.primary : "rgba(255, 255, 255, 0.3)",
        shadowOpacity: isFocused ? 0.15 : 0.08,
        transform: [
          { scale: isFocused ? 1.03 : 1.0 },
          { scale: Animated.add(1, Animated.multiply(budgetGlowAnim, 0.03)) }
        ],
      },
    ];

    if (Platform.OS === 'web') {
      return (
        <Pressable
          style={commonStyles}
          onHoverIn={() => {
            setIsHovered(true);
            Animated.spring(budgetGlowAnim, {
              toValue: 1,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }}
          onHoverOut={() => {
            setIsHovered(false);
            Animated.spring(budgetGlowAnim, {
              toValue: 0,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }}
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
        </Pressable>
      );
    }

    return (
      <Animated.View style={commonStyles}>
        <Text style={[componentStyles.currencySymbol, { color: Colors.primary }]}>$</Text>
        <TextInput
          style={[componentStyles.budgetInput, { color: Colors.text }]}
          placeholder="Enter your budget"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
          value={budget > 0 ? budget.toString() : ""}
          onChangeText={(text) => setBudget(parseInt(text) || 0)}
          onFocus={() => {
            setIsFocused(true);
            Animated.spring(budgetGlowAnim, {
              toValue: 1,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }}
          onBlur={() => {
            setIsFocused(false);
            Animated.spring(budgetGlowAnim, {
              toValue: 0,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }}
        />
      </Animated.View>
    );
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
            colors={["rgba(0, 191, 255, 0.8)", "rgba(204, 204, 255, 0.8)"]}
            style={componentStyles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Animated Plane */}
            <Animated.View
              style={[
                componentStyles.planeContainer,
                {
                  transform: [
                    {
                      translateX: planePosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 350],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Plane size={24} color="rgba(255, 255, 255, 0.8)" />
            </Animated.View>

            {/* Cloud Overlay */}
            <View style={componentStyles.cloudOverlay}>
              <Animated.View
                style={[
                  componentStyles.cloud1,
                  {
                    transform: [
                      {
                        translateX: cloud1Position.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-200, 400],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  componentStyles.cloud2,
                  {
                    transform: [
                      {
                        translateX: cloud2Position.interpolate({
                          inputRange: [0, 1],
                          outputRange: [400, -200],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  componentStyles.cloud3,
                  {
                    transform: [
                      {
                        translateX: cloud3Position.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-150, 350],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            {/* Glassmorphism Logo Container */}
            <Animated.View 
              style={[
                componentStyles.logoContainer,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                }
              ]}
            >
              <Logo size={120} />
            </Animated.View>

            <Animated.Text 
              style={[
                componentStyles.heroTitle,
                { opacity: titleOpacity }
              ]}
            >
              What can I get for...
            </Animated.Text>
            <Animated.Text 
              style={[
                componentStyles.heroSubtitle,
                { opacity: subtitleOpacity }
              ]}
            >
              Explore unforgettable adventures based on your budget
            </Animated.Text>
          </LinearGradient>
        </View>

        {/* Budget Field */}
        {renderBudgetField()}
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
        <Pressable
          onPress={handleAdvancedToggle}
          onPressIn={handleAdvancedPressIn}
          onPressOut={handleAdvancedPressOut}
          onHoverIn={() => setIsAdvancedHovered(true)}
          onHoverOut={() => setIsAdvancedHovered(false)}
          style={({ pressed }) => [
            componentStyles.advancedSearchToggle,
            isAdvancedHovered && componentStyles.advancedSearchToggleHovered,
            pressed && componentStyles.advancedSearchTogglePressed,
          ]}
        >
          <Animated.View
            style={[
              componentStyles.advancedSearchToggleContent,
              {
                transform: [
                  { scale: advancedToggleScale },
                ],
              },
            ]}
          >
            <SlidersHorizontal size={20} color={Colors.primary} />
            <Text style={componentStyles.advancedSearchText}>
              {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
            </Text>
            <Animated.View
              style={{
                marginLeft: 6,
                transform: [
                  {
                    rotate: advancedToggleRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              }}
            >
              {showAdvanced ? (
                <ChevronUp size={18} color={Colors.primary} />
              ) : (
                <ChevronDown size={18} color={Colors.primary} />
              )}
            </Animated.View>
          </Animated.View>
        </Pressable>

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
            <View style={{ flexDirection: 'row', gap: 40 }}>
              {/* Time of Day Section */}
              <View style={{ flex: 1 }}>
                <Text style={componentStyles.advancedSectionHeadingRefined}>Time of Day</Text>
                <View style={componentStyles.chipColumnContainer}>
                  {TIME_OF_DAY_OPTIONS.map((option) => {
                    const isSelected = timeOfDay === option.id;
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          componentStyles.chipButton,
                          componentStyles.chipColumnItem,
                          isSelected && { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
                        ]}
                        onPress={() => setTimeOfDay(isSelected ? null : option.id)}
                        activeOpacity={0.8}
                      >
                        <IconComponent size={18} color={isSelected ? Colors.primary : Colors.textSecondary} style={{ marginRight: 8 }} />
                        <Text style={[componentStyles.chipText, isSelected && { color: Colors.primary }]}>{option.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              {/* Group Size Section */}
              <View style={{ flex: 1 }}>
                <Text style={componentStyles.advancedSectionHeadingRefined}>Group Size</Text>
                <View style={componentStyles.chipColumnContainer}>
                  {GROUP_SIZE_OPTIONS.map((option) => {
                    const isSelected = groupSize === option.id;
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          componentStyles.chipButton,
                          componentStyles.chipColumnItem,
                          isSelected && { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
                        ]}
                        onPress={() => setGroupSize(isSelected ? null : option.id)}
                        activeOpacity={0.8}
                      >
                        <IconComponent size={18} color={isSelected ? Colors.primary : Colors.textSecondary} style={{ marginRight: 8 }} />
                        <Text style={[componentStyles.chipText, isSelected && { color: Colors.primary }]}>{option.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            {/* Date Range Section */}
            <View style={{ marginTop: 24 }}>
              <Text style={componentStyles.advancedSectionHeading}>Date Range</Text>
              {Platform.OS === 'web' ? (
                <View style={componentStyles.dateCardWeb}>
                  <Text style={componentStyles.dateLabel}>Earliest Date</Text>
                  <Text style={componentStyles.dateLabel}>Latest Date</Text>
                  <DateRange
                    ranges={[{
                      startDate: startDate || new Date(),
                      endDate: endDate || new Date(),
                      key: 'selection',
                    }]}
                    onChange={(ranges: { selection: { startDate: Date; endDate: Date } }) => {
                      setStartDate(ranges.selection.startDate);
                      setEndDate(ranges.selection.endDate);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    direction="horizontal"
                    rangeColors={[Colors.primary]}
                    editableDateInputs={true}
                  />
                </View>
              ) : (
                <View style={componentStyles.dateCardMobile}>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={componentStyles.dateLabel}>Earliest Date</Text>
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setStartDate(selectedDate);
                      }}
                      style={{ backgroundColor: 'white', borderRadius: 12 }}
                    />
                  </View>
                  <View>
                    <Text style={componentStyles.dateLabel}>Latest Date</Text>
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setEndDate(selectedDate);
                      }}
                      style={{ backgroundColor: 'white', borderRadius: 12 }}
                    />
                  </View>
                </View>
              )}
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
    shadowColor: Colors.primary,
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
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  advancedSearchToggleHovered: {
    borderColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  advancedSearchTogglePressed: {
    transform: [{ scale: 0.98 }],
  },
  advancedSearchToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  advancedSearchText: {
    color: Colors.primary,
    fontWeight: '600',
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
    position: "relative",
  },
  planeContainer: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cloudOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  cloud1: {
    position: "absolute",
    width: 200,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
    top: "20%",
    left: 0,
    transform: [{ rotate: "-5deg" }],
  },
  cloud2: {
    position: "absolute",
    width: 180,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    top: "40%",
    right: 0,
    transform: [{ rotate: "10deg" }],
  },
  cloud3: {
    position: "absolute",
    width: 150,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    bottom: "30%",
    left: 0,
    transform: [{ rotate: "-8deg" }],
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    backdropFilter: "blur(10px)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 320,
    lineHeight: 22,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  advancedSectionHeading: {
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  advancedSectionHeadingRefined: {
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  chipColumnContainer: {
    flexDirection: 'column',
    gap: 14,
  },
  chipColumnItem: {
    width: '100%',
    marginBottom: 0,
  },
  dateLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    marginLeft: 2,
  },
  dateCardWeb: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: 18,
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dateCardMobile: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
});