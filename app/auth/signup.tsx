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

export default function SignupScreen() {
  const Colors = useColors();
  const router = useRouter();

  const handleSignup = async ({ email, password }: AuthData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Toast.show({
          type: "error",
          text1: "Signup failed",
          text2: data.error || "Unknown error",
        });
        return;
      }

      if (data.token) {
        await saveToken("authToken", data.token);
        Toast.show({
          type: "success",
          text1: "Signup successful",
          text2: `Welcome, ${email}!`
        });
        router.replace("/");
      } else {
        Toast.show({
          type: "success",
          text1: "Signup complete",
          text2: "Please log in to continue",
        });

        router.replace("/auth/login");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network error",
        text2: "Please try again later.",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <AuthForm title="Create Account" buttonLabel="Sign Up" onSubmit={handleSignup} />
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={[styles.linkText, { color: Colors.primary }]}>
          Already have an account? Log in
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
