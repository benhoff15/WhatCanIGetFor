import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  ChevronRight,
  Moon,
  Bell,
  MapPin,
  HelpCircle,
  Info,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router"; // ✅ import router

import { LightColors, DarkColors } from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";

export default function SettingsScreen() {
  const router = useRouter(); // ✅ initialize router

  const {
    darkMode,
    notifications,
    useLocation,
    toggleDarkMode,
    toggleNotifications,
    toggleLocation,
  } = useSettingsStore();

  const Colors = darkMode ? DarkColors : LightColors;

  const handleToggle = (
    setting: "darkMode" | "notifications" | "useLocation"
  ) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    switch (setting) {
      case "darkMode":
        toggleDarkMode();
        break;
      case "notifications":
        toggleNotifications();
        break;
      case "useLocation":
        toggleLocation();
        break;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.textSecondary,
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 8,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.cardBackground,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    settingIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.iconBackground,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingLabel: {
      flex: 1,
      fontSize: 16,
      color: Colors.text,
    },
    versionContainer: {
      alignItems: "center",
      padding: 24,
    },
    versionText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Moon size={20} color={Colors.primary} />
          </View>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={() => handleToggle("darkMode")}
            trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
            thumbColor={Colors.switchThumb}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={Colors.primary} />
          </View>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={() => handleToggle("notifications")}
            trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
            thumbColor={Colors.switchThumb}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <MapPin size={20} color={Colors.primary} />
          </View>
          <Text style={styles.settingLabel}>Use Current Location</Text>
          <Switch
            value={useLocation}
            onValueChange={() => handleToggle("useLocation")}
            trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
            thumbColor={Colors.switchThumb}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push("/help")} // ✅ navigate to /help
        >
          <View style={styles.settingIconContainer}>
            <HelpCircle size={20} color={Colors.primary} />
          </View>
          <Text style={styles.settingLabel}>Help & Support</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push("/about")} // ✅ navigate to /about
        >
          <View style={styles.settingIconContainer}>
            <Info size={20} color={Colors.primary} />
          </View>
          <Text style={styles.settingLabel}>About App</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
