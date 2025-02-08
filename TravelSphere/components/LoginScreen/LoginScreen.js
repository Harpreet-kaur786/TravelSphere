import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { loginUser } from "../../firebase"; // Import login function
import { auth } from "../../firebase"; // Firebase Auth instance
import { sendEmailVerification } from "firebase/auth";
import styles from'./styles'
const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      setErrorMessage("Please fill in both email/username and password.");
      return;
    }

    setIsLoading(true);
    const result = await loginUser(emailOrUsername, password);

    if (result.success) {
      const user = auth.currentUser;

      if (user && !user.emailVerified) {
        setIsLoading(false);
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            { text: "Resend Email", onPress: () => sendEmailVerification(user) },
            { text: "OK" }
          ]
        );
        return;
      }

      navigation.replace("Home"); // Navigate to Home after login
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        placeholder="Email"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <Text>Don’t have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
