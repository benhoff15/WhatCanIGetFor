import React from "react";
import { ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@/components/AuthForm";
import { useColors } from "@/constants/colors";
import { saveToken } from "@/utils/secureStore";
import Toast from "react-native-toast-message";

type AuthData = {
  email: string;
  password: string;
};

const API_URL = "http://localhost:8080";


export default function LoginScreen() {
  const router = useRouter();
  const Colors = useColors();

  const handleLogin = async ({ email, password }: AuthData) => {
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
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <AuthForm title="Welcome Back" buttonLabel="Login" onSubmit={handleLogin} />
      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text style={[styles.linkText, { color: Colors.primary }]}>
          Don't have an account? Sign up
        </Text>
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
  linkText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
  },
});
