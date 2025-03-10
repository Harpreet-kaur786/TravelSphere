


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { loginUser } from "../../firebase"; 
import { auth } from "../../firebase"; 
import { sendEmailVerification } from "firebase/auth";
import styles from './styles';


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
      navigation.replace("Home");
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/EfilTower.jpg")} style={styles.image} />
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        {/* Signup & Back Navigation */}
        <View style={styles.signupText}>
          <Text>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.signupLink}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Image */}
      <View style={styles.imageContainerBottom}>
        <Image source={require("../../assets/LoginBottom.jpg")} style={styles.imageBottom} />
      </View>
    </View>
  );
};

export default LoginScreen;
