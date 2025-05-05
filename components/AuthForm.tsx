import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/constants/colors";

type AuthData = {
  email: string;
  password: string;
};

type AuthFormProps = {
  title: string;
  buttonLabel: string;
  onSubmit: (data: AuthData) => void;
};

export default function AuthForm({ title, buttonLabel, onSubmit }: AuthFormProps) {
  const Colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>

      <TextInput
        style={[styles.input, { color: Colors.text, borderColor: Colors.border }]}
        placeholder="Email"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { color: Colors.text, borderColor: Colors.border }]}
        placeholder="Password"
        placeholderTextColor={Colors.textSecondary}
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
