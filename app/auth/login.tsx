import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@/components/AuthForm";
import { useColors } from "@/constants/colors";
import { saveToken } from "@/utils/secureStore";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

type AuthData = {
  email: string;
  password: string;
};


const API_URL = Constants?.expoConfig?.extra?.RORK_API_BASE_URL || "http://localhost:8080";


export default function LoginScreen() {
  const router = useRouter();
  const Colors = useColors();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({ email, password }: AuthData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: data.error || "Invalid credentials",
        });
        return;
      }

      if (!data.token) {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Missing token in server response",
        });
          return;
      }

      await saveToken("authToken", data.token);
      Toast.show({
        type: "success",
        text1: "Login successful",
        text2: `Welcome back, ${email}`,
      });
      router.replace("/"); // Redirect to home or dashboard
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network error",
        text2: "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <AuthForm title="Welcome Back" buttonLabel="Login" onSubmit={handleLogin} isLoading={isLoading} />
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={[styles.linkText, { color: Colors.primary }]}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
          <Text style={[styles.linkText, { color: Colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  linksContainer: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
});