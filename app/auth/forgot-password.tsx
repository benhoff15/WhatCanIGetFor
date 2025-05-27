import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useColors } from "@/constants/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export default function ForgotPasswordScreen() {
  const Colors = useColors();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handlePasswordResetRequest = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      const lowercasedEmail = email.toLowerCase();

      if (lowercasedEmail === "exists@example.com") {
        Toast.show({
          type: "success",
          text1: "Check Your Email",
          text2: "If an account with that email exists, we've sent a password reset link.",
        });
        // Optionally navigate back to login or clear form
        // setEmail("");
        // router.push('/auth/login');
      } else if (lowercasedEmail === "error@example.com") {
         Toast.show({
          type: "error",
          text1: "Request Failed",
          text2: "Something went wrong. Please try again.",
        });
      } else {
         Toast.show({ 
          type: "success", // Show success for security reasons (don't reveal if email exists)
          text1: "Check Your Email",
          text2: "If an account with that email exists, we've sent a password reset link.",
        });
      }
    } catch (error) {
      console.error("Password Reset Request Error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.text }]}>Forgot Your Password?</Text>
      <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
        Enter your email address below and we'll send you a link to reset your password.
      </Text>

      <TextInput
        style={[
          styles.input,
          { color: Colors.text, borderColor: Colors.border },
          emailError ? styles.inputError : {},
        ]}
        placeholder="Email"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) validateEmail(); // Real-time validation after first error
        }}
        accessibilityLabel="Email input for password reset"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled]}
        onPress={handlePasswordResetRequest}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/auth/login")}>
        <Text style={[styles.linkText, { color: Colors.primary }]}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});