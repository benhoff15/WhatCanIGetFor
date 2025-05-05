import React from "react";
import { ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@/components/AuthForm";
import { useColors } from "@/constants/colors";

type AuthData = {
  email: string;
  password: string;
};

export default function SignupScreen() {
  const Colors = useColors();
  const router = useRouter();

  const handleSignup = async ({ email, password }: AuthData) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        Alert.alert("Signup failed", data.error || "Unknown error");
        return;
      }
  
      Alert.alert("Sign Up Success", `Welcome, ${email}!`);
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Network error", "Something went wrong");
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
