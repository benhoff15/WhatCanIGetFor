import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useColors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { useEffect, useState, useRef } from "react";
import Logo from "@/components/Logo";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Tag,
  Target,
  Moon,
  Settings,
  Info,
  Code,
  Mail,
  RefreshCw, // For update button
  Twitter, // For Twitter icon
  Instagram, // For Instagram icon
  Smartphone, // For Expo/React Native
  Store, // For Zustand
  Database, // For Prisma
  Cloud, // For Vercel
  Palette, // For UI
  ChevronRight, // For individual item collapse
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import * as Clipboard from "expo-clipboard";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultCollapsed?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  icon,
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const Colors = useColors();

  return (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsCollapsed(!isCollapsed)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <Text style={[styles.sectionTitle, { color: Colors.text, marginLeft: icon ? 8 : 0 }]}>
            {title}
          </Text>
        </View>
        {isCollapsed ? (
          <ChevronDown size={24} color={Colors.textSecondary} />
        ) : (
          <ChevronUp size={24} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>
      {!isCollapsed && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// Simple Tooltip for Web
interface WebTooltipProps {
  tooltipText: string;
  children: React.ReactNode;
}

const WebTooltip: React.FC<WebTooltipProps> = ({ tooltipText, children }) => {
  const [showTip, setShowTip] = useState(false);
  const Colors = useColors();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.tooltipContainer}>
      {Platform.OS === 'web' ? (
        <div
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          style={{ display: 'inline-block' }}
        >
          {children}
        </div>
      ) : (
        <View>{children}</View>
      )}
      
      {showTip && (
        <View style={[styles.tooltip, { backgroundColor: Colors.gray, shadowColor: Colors.text }]}>
          <Text style={[styles.tooltipText, {color: Colors.background}]}>{tooltipText}</Text>
        </View>
      )}
    </View>
  );
};


// New TechnologyItem component
interface TechnologyItemProps {
  icon: React.ReactNode | React.ReactNode[];
  title: string;
  description: string;
}

const TechnologyItem: React.FC<TechnologyItemProps> = ({ icon, title, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Colors = useColors();

  return (
    <View style={styles.techItemContainer}>
      <TouchableOpacity
        style={styles.techItemHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.techItemTitleContainer}>
          {Array.isArray(icon) ? (
            <View style={{flexDirection: 'row'}}>
              {icon.map((ic, index) => <View key={index} style={{marginRight: index === icon.length -1 ? 0 : 4}}>{ic}</View>)}
            </View>
          ) : (
            icon
          )}
          <Text style={[styles.techItemTitle, { color: Colors.text, marginLeft: 8 }]}>{title}</Text>
        </View>
        {isExpanded ? <ChevronUp size={20} color={Colors.textSecondary} /> : <ChevronRight size={20} color={Colors.textSecondary} />}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.techItemDescriptionContainer}>
          <Text style={[styles.text, { color: Colors.textSecondary }]}>{description}</Text>
        </View>
      )}
    </View>
  );
};


export default function AboutScreen() {
  const Colors = useColors();
  const navigation = useNavigation();
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
  const currentAppVersion = "1.0.0"; // Hardcoded current version
  const confettiRef = useRef<ConfettiCannon>(null);
  const versionTextScale = useRef(new Animated.Value(1)).current;
  const contactEmail = "support@whatcanigetfor.com";

  useEffect(() => {
    navigation.setOptions({
      title: "About App",
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });
  }, [navigation, Colors]);

  const gradientColors: [string, string] = [
    Colors.background,
    Colors.cardBackground,
  ];

  const handleCheckForUpdate = () => {
    setIsCheckingForUpdate(true);
    // Simulate API call
    setTimeout(() => {
      const latestVersion = "1.0.1"; // Hardcoded latest version (scenario: update available)
      // const latestVersion = "1.0.0"; // Hardcoded latest version (scenario: no update)
      setIsCheckingForUpdate(false);

      if (latestVersion > currentAppVersion) {
        Toast.show({
          type: "info",
          text1: "Update Available",
          text2: `A new version (${latestVersion}) is available!`,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Up to Date",
          text2: "You are using the latest version.",
          position: "bottom",
        });
      }
    }, 1500);
  };

  const handleOpenURL = async (url: string, isMail?: boolean) => {
  try {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        throw new Error("Unsupported URL");
      }
    }
  } catch (error) {
    console.error("Failed to open URL:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: isMail
        ? "Could not open email client."
        : "Could not open the link.",
      position: "bottom",
    });
  }
};

  const handleEmailPress = async () => {
    try {
      await Clipboard.setStringAsync(contactEmail);
      Toast.show({
        type: 'success',
        text1: 'Email Copied',
        text2: `${contactEmail} copied to clipboard!`,
        position: 'bottom',
      });
      // Attempt to open mail client after copying
      await handleOpenURL(`mailto:${contactEmail}`, true);
    } catch (e) {
       console.error('Failed to copy email or open mail client', e);
       Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not copy email or open mail client.',
        position: 'bottom',
      });
    }
  };

  const triggerVersionTextAnimation = () => {
    confettiRef.current?.start();
    Animated.sequence([
      Animated.timing(versionTextScale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(versionTextScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <View style={styles.featureItem}>
      {icon}
      <Text style={[styles.text, { color: Colors.textSecondary, marginLeft: 8 }]}>{text}</Text>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoWrapper}>
          <Logo size={64} />
          <Text style={[styles.tagline, { color: Colors.textSecondary }]}>
            Built for discovery
          </Text>
        </View>

        <Text style={[styles.title, { color: Colors.text }]}>
          WhatCanIGetFor
        </Text>

        <Text style={[styles.text, { color: Colors.textSecondary, marginBottom: 24 }]}>
          WhatCanIGetFor is your curated adventure finder. Whether you're
          exploring your hometown or planning a getaway, we help you discover
          experiences tailored to your location and budget.
        </Text>

        <CollapsibleSection title="Features" icon={<Settings size={20} color={Colors.primary} />}>
          <FeatureItem icon={<Globe size={18} color={Colors.primary} />} text="Discover unique adventures filtered by price and proximity" />
          <FeatureItem icon={<Tag size={18} color={Colors.primary} />} text="Save your favorite trips and revisit them anytime" />
          <FeatureItem icon={<Target size={18} color={Colors.primary} />} text="Personalized results based on your location" />
          <FeatureItem icon={<Moon size={18} color={Colors.primary} />} text="Light and dark mode support" />
          <FeatureItem icon={<Settings size={18} color={Colors.primary} />} text="Simple, intuitive design focused on usability" />
        </CollapsibleSection>

        <CollapsibleSection title="Version" icon={<Info size={20} color={Colors.primary} />} defaultCollapsed={false}>
          <TouchableOpacity onPress={triggerVersionTextAnimation}>
            <Animated.Text style={[styles.text, { color: Colors.textSecondary, transform: [{scale: versionTextScale}] }]}>
              You are currently using version {currentAppVersion}. Future updates will
              include more filtering options, AI-driven suggestions, and account
              syncing.
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: Colors.primary }]}
            onPress={handleCheckForUpdate}
            disabled={isCheckingForUpdate}
          >
            {isCheckingForUpdate ? (
              <ActivityIndicator size="small" color={Colors.white || "#FFFFFF"} />
            ) : (
              <RefreshCw size={18} color={Colors.white || "#FFFFFF"} style={{ marginRight: 8 }} />
            )}
            <Text style={[styles.updateButtonText, { color: Colors.white || "#FFFFFF" }]}>
              {isCheckingForUpdate ? "Checking..." : "Check for updates"}
            </Text>
          </TouchableOpacity>
        </CollapsibleSection>

        <CollapsibleSection title="Built With" icon={<Code size={20} color={Colors.primary} />}>
          <TechnologyItem
            icon={<Smartphone size={18} color={Colors.primary} />}
            title="Expo + React Native"
            description="For cross-platform development, enabling a single codebase for both iOS and Android."
          />
          <TechnologyItem
            icon={<Store size={18} color={Colors.primary} />}
            title="Zustand"
            description="For fast and simple global state management, keeping our app's data flow predictable and efficient."
          />
          <TechnologyItem
            icon={[
              <Database size={18} color={Colors.primary} key="db" />,
              <Cloud size={18} color={Colors.primary} key="cloud" />,
            ]}
            title="Prisma + Vercel"
            description="For robust backend API development and seamless data access, hosted on a serverless infrastructure."
          />
          <TechnologyItem
            icon={<Palette size={18} color={Colors.primary} />}
            title="Tailored UI"
            description="With full dark/light theming capabilities, ensuring a comfortable viewing experience in any lighting condition."
          />
        </CollapsibleSection>

        <CollapsibleSection title="Contact" icon={<Mail size={20} color={Colors.primary} />}>
          <Text style={[styles.text, { color: Colors.textSecondary, marginBottom: 16 }]}>
            Have feedback or ideas? Reach out at{' '}
            <WebTooltip tooltipText="Tap to copy email">
              <Text onPress={handleEmailPress} style={[styles.emailLink, { color: Colors.primary }]}>
                {contactEmail}
              </Text>
            </WebTooltip>
            .
          </Text>
          <View style={styles.socialMediaContainer}>
            <TouchableOpacity
              onPress={() => handleOpenURL("https://twitter.com/fortnitewoj", false)}
              style={[styles.socialIconWrapper, {backgroundColor: Colors.iconBackground}]}
              activeOpacity={0.7}
            >
              <Twitter size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenURL("https://instagram.com/benji.hoff", false)}
              style={[styles.socialIconWrapper, {backgroundColor: Colors.iconBackground, marginLeft: 16}]}
              activeOpacity={0.7}
            >
              <Instagram size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </CollapsibleSection>
      </ScrollView>
      <ConfettiCannon ref={confettiRef} count={50} origin={{ x: -10, y: 0 }} autoStart={false} fadeOut={true} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48, // Ensure space for last collapsible item
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: 'center',
  },
  collapsibleSection: {
    marginBottom: 16,
    borderRadius: 8,
    // backgroundColor: Colors.backgroundMuted, 
    // overflow: 'hidden', 
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 8, // Decided to use marginBottom on the text above instead
  },
  socialIconWrapper: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Styles for TechnologyItem
  techItemContainer: {
    marginBottom: 10,
    // backgroundColor: Colors.cardBackground, // Optional: if you want a distinct background
    borderRadius: 6,
    padding: 10, // Padding around each tech item
    borderWidth: 1,
    // borderColor: Colors.border, // Optional: if you want borders
  },
  techItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  techItemDescriptionContainer: {
    marginTop: 8,
    paddingLeft: 26, // Align with title text if icon is ~18 + 8 margin
  },
  emailLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  // Tooltip specific styles
  tooltipContainer: { // This View is only for web to position tooltip correctly if needed
    position: 'relative', // Needed for absolute positioning of the tooltip
    // display: 'inline-flex', // Removed to simplify and avoid potential style conflicts
    // If 'inline-flex' behavior is strictly needed, it would require web-specific styling outside StyleSheet
  },
  tooltip: {
    position: 'absolute',
    bottom: '125%', // Position above the text
    // left: '50%', // Removed for simplification
    // transform: [{ translateX: '-50%' as any }], // Removed due to type issues and web-specificity
    alignSelf: 'center', // Attempt to center the tooltip above the content
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 3, // For Android shadow
    zIndex: 1000, // Ensure it's on top
    // boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Removed due to web-specificity
  },
  tooltipText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
