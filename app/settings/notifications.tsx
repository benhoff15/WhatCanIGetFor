import React from "react";
import {
  ScrollView,
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import {
  BellRing,
  Save,
  Sparkles,
  Mail,
  ChevronLeft,
} from "lucide-react-native";

import i18n from "../../lib/i18n";
import { useSettingsStore, type SettingsState } from "../../store/settingsStore"; 
import { LightColors, DarkColors } from "../../constants/colors";

type NotificationPrefKey = keyof SettingsState['notificationPrefs'];

const prefDetails: Record<
  NotificationPrefKey,
  { icon: React.ElementType; labelKey: string }
> = {
  tripSuggestions: { icon: BellRing, labelKey: "tripSuggestions" },
  savedTripChanges: { icon: Save, labelKey: "savedTripChanges" },
  newFeatures: { icon: Sparkles, labelKey: "newFeatures" },
  marketingEmails: { icon: Mail, labelKey: "marketingEmails" },
};

export default function NotificationPreferencesScreen() {
  const storeState: SettingsState = useSettingsStore();
  const {
    darkMode,
    notifications,
    notificationPrefs,
    setNotificationPref,
  } = storeState;

  const Colors = darkMode ? DarkColors : LightColors;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    card: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 24,
      shadowColor: Colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
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
    divider: {
      height: 1,
      backgroundColor: Colors.border,
      marginLeft: 60,
      marginRight: 16,
    },
    disabledOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(128,128,128,0.1)',
      zIndex: 1,
    },
    masterOffMessageContainer: {
      padding: 16,
      marginHorizontal: 16,
      backgroundColor: Colors.iconBackground,
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
    },
    masterOffMessageText: {
      color: Colors.textSecondary,
      textAlign: 'center',
      fontSize: 14,
    },
  });

  const prefKeys = Object.keys(notificationPrefs) as Array<keyof typeof notificationPrefs>;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: i18n.t("notificationPreferences") }} />
      
      {!notifications && (
        <View style={styles.masterOffMessageContainer}>
          <Text style={styles.masterOffMessageText}>
            {i18n.t("allNotifications")} {i18n.t("notifications").toLowerCase()} are currently disabled. Turn them on from the main settings to manage individual preferences.
          </Text>
        </View>
      )}

      <View style={styles.card}>
        {/* Explicitly type key using NotificationPrefKey which is now keyof SettingsState['notificationPrefs'] */}
        {prefKeys.map((key: NotificationPrefKey, index) => { 
          const IconComponent = prefDetails[key].icon;
          return (
            <React.Fragment key={key}>
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <IconComponent size={20} color={Colors.primary} />
                </View>
                <Text style={styles.settingLabel}>
                  {i18n.t(prefDetails[key].labelKey)}
                </Text>
                <Switch
                  value={notificationPrefs[key]}
                  onValueChange={(value) => setNotificationPref(key, value)}
                  trackColor={{
                    false: Colors.switchTrack,
                    true: Colors.primary,
                  }}
                  thumbColor={Colors.switchThumb}
                  disabled={!notifications}
                />
              </View>
              {index < prefKeys.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
         {!notifications && <View style={styles.disabledOverlay} />}
      </View>
    </ScrollView>
  );
}