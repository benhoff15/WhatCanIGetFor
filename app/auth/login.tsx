import React from "react";
import { ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@/components/AuthForm";
import { useColors } from "@/constants/colors";
import * as SecureStore from "expo-secure-store";

type AuthData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const Colors = useColors();

const handleLogin = async ({ email, password }: AuthData) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Login failed", data.error || "Unknown error");
      return;
    }

    // ✅ Save JWT token securely
    await SecureStore.setItemAsync("authToken", data.token);
    Alert.alert("Login Success", `Welcome back, ${email}`);
    router.replace("/"); // or navigate to a protected screen

  } catch (error) {
    Alert.alert("Network error", "Something went wrong");
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
