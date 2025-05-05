import React from "react";
import { ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import AuthForm from "@/components/AuthForm";
import { useColors } from "@/constants/colors";

type AuthData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const Colors = useColors();
  const router = useRouter();

  const handleLogin = ({ email, password }: AuthData) => {
    // TODO: Validate and log in via backend
    Alert.alert("Login Success", `Welcome back, ${email}!`);
    router.replace("/");
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
