import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useColors } from "@/constants/colors";

import welcomeImage from "../assets/onboarding-welcome.png";
import chooseVibeImage from "../assets/onboarding-choose-vibe.png";
import budgetImage from "../assets/onboarding-budget.png";
import matchesImage from "../assets/onboarding-matches.png";
import letsGoImage from "../assets/onboarding-lets-go.png";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Welcome to WhatCanIGetFor!",
    body: "Your journey to discovering personalized adventures begins here.",
    image: welcomeImage,
  },
  {
    title: "Pick Your Adventure Vibe",
    body: "Flights, hotels, restaurants, or unique experiences — it’s your call.",
    image: chooseVibeImage,
  },
  {
    title: "Customize Your Budget",
    body: "Set what you're comfortable spending and let us do the rest.",
    image: budgetImage,
  },
  {
    title: "Instant Results, Tailored for You",
    body: "We’ll match you with curated options in real time. It’s that easy.",
    image: matchesImage,
  },
  {
    title: "Let’s Get Started!",
    body: "You’re all set to begin your adventure. Tap below to continue.",
    image: letsGoImage,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const Colors = useColors();
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleNext = () => {
    if (index === slides.length - 1) {
      completeOnboarding();
      router.replace("/");
    } else {
      setIndex(index + 1);
    }
  };

  const slide = slides[index];

  return (
    <LinearGradient
      colors={["#eaf0ff", "#f8fbff"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={slide.image}
          style={{
            width: width * 0.35,
            height: width * 0.35,
            resizeMode: "contain",
            marginBottom: 8,
            alignSelf: "center",
          }}
        />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: Colors.text }]}>{slide.title}</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>{slide.body}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {index === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 2,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
