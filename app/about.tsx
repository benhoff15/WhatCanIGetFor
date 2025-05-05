import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useColors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import Logo from "@/components/Logo";

export default function AboutScreen() {
  const Colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "About App",
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });
  }, [navigation, Colors]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.logoWrapper}>
        <Logo size={64} />
        <Text style={[styles.tagline, { color: Colors.textSecondary }]}>
          Built for discovery
          </Text>
        </View>

        <Text style={[styles.title, { color: Colors.text }]}>WhatCanIGetFor</Text>

      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        WhatCanIGetFor is your curated adventure finder. Whether you're
        exploring your hometown or planning a getaway, we help you discover
        experiences tailored to your location and budget.
      </Text>

      <Text style={[styles.sectionTitle, { color: Colors.text }]}>
        Features
      </Text>
      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        - 🌍 Discover unique adventures filtered by price and proximity{"\n"}
        - 🔖 Save your favorite trips and revisit them anytime{"\n"}
        - 🎯 Personalized results based on your location{"\n"}
        - 🌓 Light and dark mode support{"\n"}
        - ⚙️ Simple, intuitive design focused on usability
      </Text>

      <Text style={[styles.sectionTitle, { color: Colors.text }]}>
        Version
      </Text>
      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        You are currently using version 1.0.0. Future updates will include more
        filtering options, AI-driven suggestions, and account syncing.
      </Text>

      <Text style={[styles.sectionTitle, { color: Colors.text }]}>
        Built With
      </Text>
      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        - Expo + React Native for cross-platform development{"\n"}
        - Zustand for fast and simple state management{"\n"}
        - Prisma + Vercel for backend API and data access{"\n"}
        - Tailored UI with full dark/light theming
      </Text>

      <Text style={[styles.sectionTitle, { color: Colors.text }]}>
        Contact
      </Text>
      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        Have feedback or ideas? Reach out at support@whatcanigetfor.com or
        follow us on social media @whatcanigetfor.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
