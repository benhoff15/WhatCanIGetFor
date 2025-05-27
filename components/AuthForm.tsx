import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useColors } from "@/constants/colors";

type AuthData = {
  email: string;
  password: string;
};

type AuthFormProps = {
  title: string;
  buttonLabel: string;
  onSubmit: (data: AuthData) => void;
  isLoading?: boolean;
};

export default function AuthForm({ title, buttonLabel, onSubmit, isLoading }: AuthFormProps) {
  const Colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (isLoading) return;
    if (validateForm()) {
      onSubmit({ email, password });
    }
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
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) validateForm();
        }}
        accessibilityLabel={title + " Email Input"}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, { color: Colors.text, borderColor: Colors.border }]}
          placeholder="Password"
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) validateForm();
          }}
          accessibilityLabel={title + " Password Input"}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          accessibilityLabel="Toggle password visibility"
          accessibilityHint={isPasswordVisible ? "Hide password" : "Show password"}
        >
          <Text style={{ color: Colors.textSecondary }}>{isPasswordVisible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={[styles.errorText, styles.passwordErrorMargin]}>{passwordError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>{buttonLabel}</Text>}
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
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleButton: {
    padding: 12,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  passwordErrorMargin: {
    marginTop: -10,
    marginBottom: 10,
  }
});
