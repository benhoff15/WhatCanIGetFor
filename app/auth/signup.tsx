import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
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

export default function SignupScreen() {
  const Colors = useColors();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async ({ email, password }: AuthData) => {
    setIsLoading(true);
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

        setTimeout(() => {
          router.replace("/");
        }, 1000);
        
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <AuthForm title="Create Account" buttonLabel="Sign Up" onSubmit={handleSignup} isLoading={isLoading} />
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={[styles.linkText, { color: Colors.primary }]}>
          Already have an account? Log In
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