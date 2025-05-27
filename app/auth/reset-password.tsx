import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { useColors } from "@/constants/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export default function ResetPasswordScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { token: urlToken } = useLocalSearchParams<{ token?: string }>();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid Link",
        text2: "No reset token provided. Please request a new link.",
        visibilityTime: 5000,
      });
    }
  }, [urlToken, router]);

  const validateForm = () => {
    let isValid = true;
    // Password validation
    if (!password.trim()) {
      setPasswordError("New password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirm password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    return isValid;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) {
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Missing Token",
        text2: "No reset token found. Please request a new link.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (token === "valid-token" && password === confirmPassword && password.length >= 8) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful",
          text2: "You can now log in with your new password.",
        });
        router.replace("/auth/login");
      } else if (token === "invalid-token") {
        Toast.show({
          type: "error",
          text1: "Reset Failed",
          text2: "Invalid or expired token. Please request a new link.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Reset Failed",
          text2: "Could not reset password. Please try again or request a new link.",
        });
      }
    } catch (error) {
      console.error("Password Reset Error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!urlToken && !token) {
    return (
        <View style={[styles.container, { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={[styles.title, { color: Colors.text, marginBottom: 20 }]}>Invalid Reset Link</Text>
            <Text style={[styles.subtitle, { color: Colors.textSecondary, marginBottom: 20 }]}>
                The password reset link is missing or invalid. Please request a new one.
            </Text>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.replace("/auth/login")}>
                <Text style={[styles.linkText, { color: Colors.primary }]}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.text }]}>Reset Your Password</Text>
      <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
        Enter your new password below.
      </Text>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            { color: Colors.text, borderColor: Colors.border },
            passwordError ? styles.inputError : {},
          ]}
          placeholder="New Password"
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) validateForm();
          }}
          accessibilityLabel="New Password Input"
        />
        <TouchableOpacity
          style={[styles.toggleButton, {borderColor: Colors.border}]}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Text style={{ color: Colors.textSecondary }}>{isPasswordVisible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Confirm New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            { color: Colors.text, borderColor: Colors.border },
            confirmPasswordError ? styles.inputError : {},
          ]}
          placeholder="Confirm New Password"
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (confirmPasswordError) validateForm();
          }}
          accessibilityLabel="Confirm New Password Input"
        />
        <TouchableOpacity
          style={[styles.toggleButton, {borderColor: Colors.border}]}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Text style={{ color: Colors.textSecondary }}>{isConfirmPasswordVisible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled, !token && styles.buttonDisabled]}
        onPress={handlePasswordReset}
        disabled={isLoading || !token}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordInput: {
    flex: 1,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  toggleButton: {
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 5,
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