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
          Effective Date: May 31, 2025
        </Text>

        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          These Terms of Service ("Terms") govern your access to and use of the WhatCanIGetFor mobile application and related services (collectively, the "Service"). By using the Service, you agree to be bound by these Terms. If you do not agree, please refrain from using the app.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          By accessing or using WhatCanIGetFor, you agree to comply with these Terms and all applicable laws and regulations. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>2. Use of the Service</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          You agree to use the Service only for lawful and intended purposes. You must not:{"\n\n"}
          • Interfere with the functionality or security of the app;{"\n\n"}
          • Attempt to gain unauthorized access to user data or platform systems;{"\n\n"}
          • Scrape, copy, or republish app content without written consent.{"\n\n"}
          The app is intended for personal, non-commercial use unless expressly authorized.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>3. User Accounts</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          To access certain features, you may be required to create an account. You are responsible for:{"\n\n"}
          • Maintaining the confidentiality of your login credentials;{"\n\n"}
          • Notifying us immediately of any unauthorized use or suspected breach.{"\n\n"}
          We are not liable for any loss or damage arising from your failure to comply with these responsibilities.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>4. Content Ownership and Intellectual Property</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          All content, branding, layout, graphics, code, and design elements are the property of WhatCanIGetFor or its licensors and are protected by copyright, trademark, and other applicable laws.{"\n\n"}
          You may not copy, modify, distribute, or create derivative works without prior written permission.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>5. Adventure Listings and Third-Party Content</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          Some adventure listings or recommendations may link to third-party services (e.g., ticket booking or review platforms). We do not control or endorse these third-party services and are not responsible for their content, pricing, availability, or terms.{"\n\n"}
          You use third-party services at your own risk and are subject to their terms and privacy policies.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>6. Termination</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We reserve the right to suspend or terminate your account or access to the Service at any time, without prior notice, if:{"\n\n"}
          • You violate these Terms;{"\n\n"}
          • You engage in behavior that may harm the platform or its users;{"\n\n"}
          • We discontinue or materially alter the Service.{"\n\n"}
          You may also terminate your use at any time by deleting your account or the app.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>7. Disclaimers</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          The Service is provided "as is" without warranties of any kind.{"\n\n"}
          We do not guarantee:{"\n\n"}
          • That experiences, prices, or listings will always be accurate, up to date, or available;{"\n\n"}
          • That the app will be error-free, secure, or continuously operational.{"\n\n"}
          Use of the app is at your sole risk.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>8. Limitation of Liability</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          To the maximum extent permitted by law, WhatCanIGetFor is not liable for:{"\n\n"}
          • Indirect, incidental, special, or consequential damages;{"\n\n"}
          • Any loss of data, revenue, or opportunity;{"\n\n"}
          • Third-party service interruptions or errors.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>9. Changes to the Terms</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          We may update these Terms periodically. Continued use of the app after any revisions constitutes acceptance of the updated terms. We will notify users of material changes via in-app notifications or email.
        </Text>

        <Text style={[styles.heading, { color: Colors.text }]}>10. Contact</Text>
        <Text style={[styles.text, { color: Colors.textSecondary }]}>
          If you have questions or concerns about these Terms, contact us at:{"\n\n"}
          📧 support@whatcanigetfor.com
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
