import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function HelpScreen() {
  const Colors = useColors();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });
  }, [navigation, Colors]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.text }]}>Help & Support</Text>
      <Text style={[styles.text, { color: Colors.textSecondary }]}>
        For help, contact us at help@yourapp.com or visit the FAQ section in the app.
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
