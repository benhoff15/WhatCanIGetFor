import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useColors } from "@/constants/colors";

export default function TermsOfServiceScreen() {
  const Colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Terms of Service",
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });
  }, [navigation, Colors]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
        <Text style={[styles.title, { color: Colors.text }]}>Terms of Service</Text>

        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          These Terms of Service govern your use of the WhatCanIGetFor app and its associated services.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          By using our app, you agree to be bound by these terms. If you do not agree, please do not use the service.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>2. Use of the Service</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          You may use WhatCanIGetFor only for lawful purposes. You agree not to misuse the service or interfere with its functionality.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>3. User Accounts</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorized use.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>4. Intellectual Property</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          All content, design, and trademarks are the property of WhatCanIGetFor or its licensors. You may not copy, distribute, or modify content without permission.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>5. Termination</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may suspend or terminate your access to the service at any time if you violate these terms or misuse the platform.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>6. Disclaimer</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          The service is provided "as is" without warranties of any kind. We do not guarantee that adventures or experiences shown will be available or accurate.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>7. Changes to Terms</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may revise these Terms of Service at any time. Continued use after updates means you accept the new terms.
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
