import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signUpUser, sendEmailVerification, checkEmailVerification } from "../../firebase";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [verificationMessage, setVerificationMessage] = useState("");

  const trustedDomains = ["gmail.com", "fanshaweonline.ca"];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domain = email.split("@")[1]?.toLowerCase();

    if (!emailRegex.test(email)) {
      return "Invalid email format. Example: user@gmail.com";
    }
    if (!trustedDomains.includes(domain)) {
      return `Use an email from a trusted domain (${trustedDomains.join(", ")})`;
    }
    return "";
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(validateEmail(text));
  };

  const validateUsername = (name) => {
    const usernameRegex = /^[A-Za-z0-9_]{3,15}$/;
    const reservedUsernames = ["admin", "tester", "root"];
    if (reservedUsernames.includes(name.toLowerCase())) {
      return "This username is reserved. Please choose another.";
    }
    if (!usernameRegex.test(name)) {
      return "Username must be 3-15 characters and can only include letters, numbers, or underscores.";
    }
    return "";
  };

  const generateUsernameSuggestions = (name) => {
    let base = name.replace(/[^A-Za-z0-9_]/g, "");
    if (base.length < 3) {
      base = base.padEnd(3, "1");
    }
    return [`${base}_official`, `${base}_123`, `${base}2025`];
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    const error = validateUsername(text);
    setUsernameError(error);
    setUsernameSuggestions(error ? generateUsernameSuggestions(text) : []);
  };

  const validatePassword = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass)
      ? ""
      : "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";
  };

  const handleSignUp = async () => {
    setUsernameError(validateUsername(username));
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
    setConfirmPasswordError(password !== confirmPassword ? "Passwords do not match." : "");

    if (usernameError || emailError || passwordError || confirmPasswordError) return;

    const result = await signUpUser(email, password);
    if (result.success) {
      await sendEmailVerification(); // Send verification email
      setVerificationMessage(
        "A verification email has been sent. Please verify your email before logging in."
      );
    } else {
      setEmailError(result.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        clearInterval(interval);
        navigation.replace("Login");
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
        style={styles.input}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
      {usernameSuggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionTitle}>Suggestions:</Text>
          {usernameSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setUsername(suggestion);
                setUsernameError("");
                setUsernameSuggestions([]);
              }}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        style={styles.input}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(validatePassword(text));
        }}
        secureTextEntry
        style={styles.input}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (confirmPasswordError && text === password) {
            setConfirmPasswordError("");
          }
        }}
        secureTextEntry
        style={styles.input}
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      {verificationMessage ? <Text style={styles.verificationText}>{verificationMessage}</Text> : null}

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};
export default SignUpScreen;
