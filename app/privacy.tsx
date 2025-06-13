import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useColors } from "@/constants/colors";

export default function PrivacyPolicyScreen() {
  const Colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Privacy Policy",
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });
  }, [navigation, Colors]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
        <Text style={[styles.title, { color: Colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          Effective Date: May 31, 2025
        </Text>

        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          At WhatCanIGetFor, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>1. Information We Collect</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may collect the following types of information:{"\n\n"}
          Personal Details: Your name and email address, when you sign up or contact support.{"\n\n"}
          Location Data: Your selected or current location to provide relevant search results.{"\n\n"}
          Preferences: Filters such as budget, time of day, group size, and saved adventures.{"\n\n"}
          Device Data: Technical information like device type and operating system for performance monitoring.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>2. How We Use Your Information</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          Your information is used to:{"\n\n"}
          • Provide personalized adventure recommendations based on your preferences and location.{"\n\n"}
          • Enable key features like saving adventures, generating itineraries, and syncing preferences.{"\n\n"}
          • Communicate with you regarding your account, support requests, or important updates.{"\n\n"}
          • Analyze aggregated data to improve app performance, usability, and user experience.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>3. Data Sharing</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We do not sell or rent your personal information to third parties.{"\n\n"}
          We may share minimal necessary data only with trusted service providers (e.g., for email delivery or analytics) under strict confidentiality agreements. These providers are only given access to what they need and may not use it for any other purpose.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>4. Your Rights</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          You have full control over your data. At any time, you may:{"\n\n"}
          • Request a copy of the data we have about you.{"\n\n"}
          • Ask us to modify or correct your data.{"\n\n"}
          • Delete your account and personal information.{"\n\n"}
          To exercise these rights, contact us at support@whatcanigetfor.com.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>5. Data Security</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We take your security seriously.{"\n\n"}
          • All communication between your device and our servers is encrypted using industry-standard protocols (e.g., HTTPS).{"\n\n"}
          • Data is securely stored and access is limited to authorized personnel only.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>6. Cookies & Tracking Technologies</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may use cookies or similar technologies for:{"\n\n"}
          • Session management and feature performance.{"\n\n"}
          • Anonymous analytics to understand how users interact with the app.{"\n\n"}
          You can adjust cookie or location permissions in your device or browser settings.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>7. Updates to This Policy</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          This policy may be updated to reflect changes to our practices or for legal reasons. If any material changes are made, you'll be notified through the app or via email, and we will update the effective date at the top of this page.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>📬 Contact Us</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          If you have any questions or concerns about this policy or your data, reach out to:{"\n\n"}
          Email: support@whatcanigetfor.com{"\n"}
          Subject Line: Privacy Policy Inquiry
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
