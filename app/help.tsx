import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated, 
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { useColors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { trpc } from "@/lib/trpc";
import { ChevronDown, Mail, User, FileText, MessageSquare, Check, HelpCircle } from "lucide-react-native"; 
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";


interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const Colors = useColors(); 
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen); 

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: newIsOpen ? contentHeight : 0,
        duration: 300,
        useNativeDriver: false, 
      }),
      Animated.timing(opacityAnim, {
        toValue: newIsOpen ? 1 : 0,
        duration: newIsOpen ? 300 : 200, 
        useNativeDriver: true,
      }),
      Animated.timing(rotationAnim, {
        toValue: newIsOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const animatedChevronStyle = {
    transform: [{
      rotate: rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    }],
  };

  const animatedContentStyle: Animated.WithAnimatedObject<ViewStyle> = {
    height: heightAnim,
    opacity: opacityAnim,
    overflow: 'hidden', 
  };

  return (
    <View style={[styles.accordionItemContainer, { borderBottomColor: Colors.border }]}>
      <TouchableOpacity onPress={toggleOpen} style={styles.accordionHeader}>
        <HelpCircle size={22} color={Colors.textSecondary} style={styles.accordionIcon} />
        <Text style={[styles.accordionTitle, { color: Colors.text }]}>{title}</Text>
        <Animated.View style={animatedChevronStyle}>
          <ChevronDown color={Colors.text} size={22} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={animatedContentStyle}>
        <View 
          style={styles.accordionContentInner} 
          onLayout={(event) => !contentHeight ? setContentHeight(event.nativeEvent.layout.height) : null }
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};


export default function HelpScreen() {
  const Colors = useColors();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false); 
  const router = useRouter();

  const mutation = trpc.contact.submit.useMutation();
  const { mutateAsync, isPending } = mutation;
  const isLoading = isPending;
  const scaleAnim = useRef(new Animated.Value(1)).current; // For button press
  const fadeAnim = useRef(new Animated.Value(0)).current;  // For card mount
  const slideAnim = useRef(new Animated.Value(20)).current; // For card mount
  const shakeAnim = useRef(new Animated.Value(0)).current; // For form shake

  useEffect(() => {
    navigation.setOptions({
      title: "Contact Us",
      headerStyle: { backgroundColor: Colors.background },
      headerTitleStyle: { color: Colors.text },
      headerTintColor: Colors.text,
    });

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

  }, [navigation, Colors, fadeAnim, slideAnim]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!subject) newErrors.subject = "Subject is required";
    if (!message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerShake = () => {
    shakeAnim.setValue(0); // Reset shake animation value
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true })
    ]).start();
  };

  const handleSubmit = async () => {
    if (showSuccessIcon || isLoading) return; 

    if (validateForm()) {
      try {
        const result = await mutateAsync({
          name: name || undefined, email, subject, message,
        });
        if (result.success) {
          // TODO: Replace with global toast notification: "Your message has been sent! 🎉"
          Alert.alert("Message Sent!", "Your message has been sent successfully! 🎉");
          setShowSuccessIcon(true);
          setName(""); setEmail(""); setSubject(""); setMessage(""); setErrors({});
          setTimeout(() => {
            setShowSuccessIcon(false);
          }, 2500); // Show success for 2.5 seconds
        } else {
          Alert.alert("Submission Failed", result.message || "An unknown error occurred.");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Something went wrong. Please try again.");
      }
    } else {
      triggerShake(); // Trigger shake on validation failure
      Alert.alert("Validation Error", "Please correct the errors in the form.");
    }
  };

  const handlePressIn = () => {
    if (showSuccessIcon || isLoading) return; 
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, friction: 7, tension: 100 }).start();
  }
  const handlePressOut = () => {
    if (showSuccessIcon || isLoading) return;
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 40 }).start();
  }

  const getBorderColor = (fieldName: string) => {
    if (errors[fieldName]) return Colors.error;
    if (focusedField === fieldName) return Colors.primary;
    return Colors.border;
  };

  const getIconColor = (fieldName: string) => {
    if (errors[fieldName]) return Colors.error; 
    if (focusedField === fieldName) return Colors.primary;
    return Colors.gray;
  };


  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={[styles.scrollViewContent, { backgroundColor: Colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.pageTitle, { color: Colors.text }]}>Get in Touch</Text>

      <Animated.View
        style={[
          styles.formContainer,
          { 
            backgroundColor: Colors.cardBackground, 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }, { translateX: shakeAnim }], // Added shakeAnim 
          },
        ]}
      >
        {/* Input Fields */}
        <Text style={[styles.label, { color: Colors.text }]}>Name</Text>
        <View style={[styles.inputContainer, { borderColor: getBorderColor('name') }]}>
          <User size={20} color={getIconColor('name')} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: Colors.text }]}
            placeholder="Your Name (Optional)"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            editable={!isLoading && !showSuccessIcon}
          />
        </View>

        <Text style={[styles.label, { color: Colors.text }]}>Email</Text>
        <View style={[styles.inputContainer, { borderColor: getBorderColor('email') }]}>
          <Mail size={20} color={getIconColor('email')} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: Colors.text }]}
            placeholder="your@email.com"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => { setEmail(text); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            editable={!isLoading && !showSuccessIcon}
          />
        </View>
        {errors.email && (<Text style={[styles.errorText, { color: Colors.error }]}>{errors.email}</Text>)}

        <Text style={[styles.label, { color: Colors.text }]}>Subject</Text>
        <View style={[styles.inputContainer, { borderColor: getBorderColor('subject') }]}>
          <FileText size={20} color={getIconColor('subject')} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: Colors.text }]}
            placeholder="Regarding..."
            placeholderTextColor={Colors.textSecondary}
            value={subject}
            onChangeText={(text) => { setSubject(text); if (errors.subject) setErrors(prev => ({ ...prev, subject: '' })); }}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            editable={!isLoading && !showSuccessIcon}
          />
        </View>
        {errors.subject && (<Text style={[styles.errorText, { color: Colors.error }]}>{errors.subject}</Text>)}

        <Text style={[styles.label, { color: Colors.text }]}>Message</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer, { borderColor: getBorderColor('message') }]}>
          <MessageSquare size={20} color={getIconColor('message')} style={[styles.inputIcon, styles.textAreaIcon]} />
          <TextInput
            style={[styles.input, styles.textAreaInput, { color: Colors.text }]}
            placeholder="Your message..."
            placeholderTextColor={Colors.textSecondary}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={message}
            onChangeText={(text) => { setMessage(text); if (errors.message) setErrors(prev => ({ ...prev, message: '' })); }}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            editable={!isLoading && !showSuccessIcon}
          />
        </View>
        {errors.message && (<Text style={[styles.errorText, { color: Colors.error }]}>{errors.message}</Text>)}
      </Animated.View>

      <TouchableOpacity
        onPress={handleSubmit}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading || showSuccessIcon}
        activeOpacity={1} 
      >
        <Animated.View 
            style={[
                styles.submitButtonContainer, 
                { transform: [{ scale: scaleAnim }] } 
            ]}
        >
          <LinearGradient
            colors={
              showSuccessIcon
                ? [Colors.success, Colors.success] 
                : isLoading 
                ? [Colors.disabled, Colors.disabled] 
                : [Colors.primary, Colors.secondary] 
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }} 
            style={styles.submitButtonGradient}
          >
            {showSuccessIcon ? (
              <>
                <Check color="#FFFFFF" size={20} style={{ marginRight: 8 }}/>
                <Text style={styles.submitButtonText}>Thank You!</Text>
              </>
            ) : isLoading ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 10 }} />
                <Text style={styles.submitButtonText}>Sending...</Text>
              </>
            ) : (
              <Text style={styles.submitButtonText}>Send Message</Text>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* FAQ Section */}
      <Text style={[styles.sectionTitle, { color: Colors.text }]}>Frequently Asked Questions</Text>
      <View style={[styles.faqContainer, { backgroundColor: Colors.cardBackground }]}>
        <AccordionItem title="What is WhatCanIGetFor?">
          <Text style={[styles.accordionContentText, { color: Colors.textSecondary }]}>
            WhatCanIGetFor is an app designed to help you discover new activities, restaurants, and experiences based on your budget and location.
          </Text>
        </AccordionItem>
        <AccordionItem title="How is my data used?">
          <Text style={[styles.accordionContentText, { color: Colors.textSecondary }]}>
            We use your data to personalize recommendations and improve our services. For more details, please see our Privacy Policy. Your data is not shared with third parties for marketing purposes.
          </Text>
        </AccordionItem>
        <AccordionItem title="Is there a premium version?">
          <Text style={[styles.accordionContentText, { color: Colors.textSecondary }]}>
            Currently, all features are available for free. We may introduce premium features in the future, but core functionality will remain accessible to all users.
          </Text>
        </AccordionItem>
      </View>

      {/* More Information Section */}
      <View style={[styles.linksContainer, { backgroundColor: Colors.cardBackground }]}>
        <TouchableOpacity onPress={() => router.push("/privacy")}>
          <Text style={[styles.linkText, { color: Colors.primary }]}>Privacy Policy</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/terms")}>
        <Text style={[styles.linkText, { color: Colors.primary }]}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: { padding: 24, paddingBottom: 48 },
  pageTitle: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  formContainer: {
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 4, 
    borderRadius: 16, 
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 5 },
    }),
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5, 
    borderRadius: 12, 
    paddingHorizontal: 12,
    marginBottom: 16, 
  },
  textAreaContainer: { alignItems: 'flex-start' },
  inputIcon: { marginRight: 10 },
  textAreaIcon: { marginTop: 12 },
  input: { 
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 14 : 12, 
    fontSize: 16,
  },
  textAreaInput: { height: 100, paddingTop: Platform.OS === "ios" ? 14 : 12 },
  errorText: { fontSize: 12, marginBottom: 12, marginTop: -12, marginLeft: 12 }, 
  
  submitButtonContainer: { 
    borderRadius: 12, 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  submitButtonGradient: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, 
    alignItems: "center", justifyContent: "center", minHeight: 52, flexDirection: 'row', 
  },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 32, marginBottom: 16 },
  faqContainer: { borderRadius: 8, overflow: 'hidden' },
  accordionItemContainer: { borderBottomWidth: 1 },
  accordionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 16, 
  },
  accordionIcon: {
    marginRight: 12, 
  },
  accordionTitle: { 
    fontSize: 16, 
    fontWeight: '500',
    flex: 1, 
  },
  accordionContentInner: { 
    padding: 16, 
  },
  accordionContentText: { fontSize: 14, lineHeight: 20 },
  linksContainer: { borderRadius: 8, padding: 16, marginTop: 0 },
  linkText: { fontSize: 16, paddingVertical: 10 },
});
