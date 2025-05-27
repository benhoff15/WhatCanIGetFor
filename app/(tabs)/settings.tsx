import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { getToken, deleteToken } from "@/utils/secureStore";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  ChevronRight,
  Moon,
  Bell,
  MapPin,
  HelpCircle,
  Info,
  LogOut,
  Palette,
  Sun,
  LogIn,
  UserPlus,
  Globe,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import Logo from "@/components/Logo";
import Toast from "react-native-toast-message";

import { LightColors, DarkColors } from "@/constants/colors";
import { useSettingsStore } from "@/store/settingsStore";
import i18n from "../../lib/i18n";
import * as Location from "expo-location";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

export default function SettingsScreen() {
  const router = useRouter();

  const {
    darkMode,
    notifications,
    useLocation,
    currentLanguage,
    currentCoordinates,
    locationError,
    isFetchingLocation,
    toggleDarkMode,
    toggleNotifications,
    // toggleLocation, // Will be replaced by specific logic
    setLanguage,
    setLocationData,
    setIsFetchingLocation,
  } = useSettingsStore();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [webManagePermissionsModalVisible, setWebManagePermissionsModalVisible] = useState(false); // Added

  const Colors = darkMode ? DarkColors : LightColors;
  const { data: user, isLoading } = trpc.user.me.useQuery();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, user]);

  const handleLogout = async () => {
    await deleteToken("authToken");
    Toast.show({
      type: "success",
      text1: i18n.t("logout"),
    });
    router.replace("/auth/login");
  };

  const handleRequestLocation = async () => {
    setIsFetchingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationData(null, i18n.t("locationPermissionDenied"));
      // useSettingsStore.setState({ useLocation: false }); // Ensure toggle is off
      Toast.show({ type: 'error', text1: i18n.t("locationPermissionDenied") });
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocationData({ latitude: location.coords.latitude, longitude: location.coords.longitude }, null);
      // useSettingsStore.setState({ useLocation: true }); // Ensure toggle is on
      Toast.show({ type: 'success', text1: i18n.t("locationFetched") });
    } catch (error) {
      setLocationData(null, i18n.t("locationPermissionDenied"));
      // useSettingsStore.setState({ useLocation: false });
      Toast.show({ type: 'error', text1: i18n.t("locationPermissionDenied") });
    } finally {
      setIsFetchingLocation(false);
    }
  };
  
  const handleToggleLocationSwitch = (value: boolean) => {
    if (value) {
      handleRequestLocation();
    } else {
      setLocationData(null, null);
      setIsFetchingLocation(false);
    }
  };

  const handleManagePermissions = () => {
    if (Platform.OS === "web") {
      setWebManagePermissionsModalVisible(true);
    } else {
      Linking.openSettings();
    }
  };

  const handleToggleDarkMode = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    toggleDarkMode();
  };

  const handleToggleNotifications = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    toggleNotifications();
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.textSecondary,
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 24,
      shadowColor: Colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    headerCard: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 24,
      paddingVertical: 24,
      alignItems: 'center',
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
    divider: {
      height: 1,
      backgroundColor: Colors.border,
      marginVertical: 4,
      marginLeft: 60,
      marginRight: 16,
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
    currentLanguageText: {
      fontSize: 16,
      color: Colors.textSecondary,
      marginRight: 8,
    },
    locationDescription: {
      fontSize: 12,
      color: Colors.textSecondary,
      paddingHorizontal: 16,
      marginTop: 4,
      marginBottom: 8,
      marginLeft: 60,
    },
    managePermissionsButton: {
      marginLeft: 76,
      paddingVertical: 4,
    },
    managePermissionsText: {
      color: Colors.primary,
      fontSize: 12,
    },
    errorText: {
      fontSize: 12,
      color: Colors.error,
      paddingHorizontal: 16,
      marginTop: 4,
      marginLeft: 60,
    },
    versionContainer: {
      alignItems: "center",
      padding: 24,
    },
    logoWrapper: {
      alignItems: "center",
    },
    logoutText: {
      flex: 1,
      fontSize: 16,
      color: Colors.error,
    },
    loginText: {
      flex: 1,
      fontSize: 16,
      color: Colors.primary,
    },
    signupText: {
      flex: 1,
      fontSize: 16,
      color: Colors.primary,
    },
    versionText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: Colors.cardBackground,
      padding: 20,
      borderRadius: 12,
      width: "80%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    languageOption: {
      paddingVertical: 15,
      width: "100%",
      alignItems: "center",
    },
    languageOptionText: {
      fontSize: 18,
      color: Colors.primary,
    },
  });

  const currentLanguageName = languages.find(l => l.code === currentLanguage)?.name || currentLanguage;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.logoWrapper}>
          <Logo size={84} />
          {!isLoading && user?.email && (
            <Text
              style={{
                textAlign: "center",
                color: Colors.textSecondary,
                fontSize: 14,
                marginTop: 8,
              }}
            >
              {i18n.t("loggedInAs", { email: user.email })}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t("preferences")}</Text>
        <View style={styles.card}>
          {!isLoading && !user && (
            <>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/auth/login")}
              >
                <View style={styles.settingIconContainer}>
                  <LogIn size={20} color={Colors.primary} />
                </View>
                <Text style={styles.loginText}>{i18n.t("login")}</Text>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/auth/signup")}
              >
                <View style={styles.settingIconContainer}>
                  <UserPlus size={20} color={Colors.primary} />
                </View>
                <Text style={styles.signupText}>{i18n.t("signup")}</Text>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
          {!isLoading && user && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLogout}
            >
              <View style={styles.settingIconContainer}>
                <LogOut size={20} color={Colors.error} />
              </View>
              <Text style={styles.logoutText}>{i18n.t("logout")}</Text>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}

          {((!isLoading && user) || (!isLoading && !user)) && <View style={styles.divider} />}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Palette size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{i18n.t("darkMode")}</Text>
            {darkMode ? <Moon size={18} color={Colors.primary} style={{ marginRight: 8 }} /> : <Sun size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
              thumbColor={Colors.switchThumb}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/settings/notifications')}
          >
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{i18n.t("notifications")}</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
              thumbColor={Colors.switchThumb}
              style={{ marginRight: 8 }}
            />
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          {/* Use Current Location Section */}
          <View>
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <MapPin size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>{i18n.t("useCurrentLocation")}</Text>
              {isFetchingLocation && <ActivityIndicator size="small" color={Colors.primary} style={{marginRight: 8}} />}
              <Switch
                value={useLocation}
                onValueChange={handleToggleLocationSwitch}
                trackColor={{ false: Colors.switchTrack, true: Colors.primary }}
                thumbColor={Colors.switchThumb}
              />
            </View>
            <Text style={styles.locationDescription}>
              {i18n.t("useCurrentLocationDescription")}
            </Text>
            {locationError && (
              <Text style={styles.errorText}>{locationError}</Text>
            )}
            <TouchableOpacity
              style={styles.managePermissionsButton}
              onPress={handleManagePermissions}
            >
              <Text style={styles.managePermissionsText}>
                {i18n.t("managePermissions")}
              </Text>
            </TouchableOpacity>
          </View>
          {/* End Use Current Location Section */}
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{i18n.t("language")}</Text>
            <Text style={styles.currentLanguageText}>{currentLanguageName}</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t("about")}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{i18n.t("helpSupport")}</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/about")}
          >
            <View style={styles.settingIconContainer}>
              <Info size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{i18n.t("aboutApp")}</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{i18n.t("version")} 1.0.0</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLanguageModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: Colors.cardBackground }]}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.languageOption}
                onPress={() => {
                  setLanguage(lang.code);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.languageOptionText, { color: Colors.primary }]}>{lang.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Web Manage Permissions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={webManagePermissionsModalVisible}
        onRequestClose={() => setWebManagePermissionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setWebManagePermissionsModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: Colors.cardBackground }]}>
            <Text style={{color: Colors.text, textAlign: 'center', marginBottom: 16}}>
              {i18n.t("managePermissionsWebExplainer")}
            </Text>
            <TouchableOpacity
              style={{marginTop: 10, padding: 10, backgroundColor: Colors.primary, borderRadius: 8}}
              onPress={() => setWebManagePermissionsModalVisible(false)}
            >
              <Text style={{color: Colors.switchThumb, fontSize: 16}}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}