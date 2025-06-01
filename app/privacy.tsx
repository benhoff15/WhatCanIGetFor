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
          At WhatCanIGetFor, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>1. Information We Collect</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may collect your email, name, location, and trip preferences when you use our app. This helps us personalize recommendations and provide better service.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>2. How We Use Your Information</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          - To personalize your adventure recommendations{"\n"}
          - To communicate with you about your account or support requests{"\n"}
          - To improve our app functionality and user experience
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>3. Data Sharing</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We do not sell your personal data. We may share limited information with trusted service providers (e.g., Resend for email delivery) only when necessary.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>4. Your Rights</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          You can request to view, modify, or delete your data at any time by contacting us at support@whatcanigetfor.com.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>5. Security</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We use secure storage practices and encrypt all communication between the app and our servers.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>6. Updates to This Policy</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may update this policy occasionally. You’ll be notified of material changes through the app or by email.
        </Text>

        <Text style={[styles.text, { color: Colors.textSecondary, marginTop: 16 }]}>
          Effective Date: May 31, 2025
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
