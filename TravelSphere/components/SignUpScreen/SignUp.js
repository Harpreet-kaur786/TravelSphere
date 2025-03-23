

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import styles from './styles';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    // First Name Validation
    if (!firstName) {
      setFirstNameError("First name is required.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Last Name Validation
    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Email Validation
    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format. Example: user@gmail.com");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password Validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter.");
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number.");
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*).");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setVerificationMessage("A verification email has been sent. Please check your inbox.");

      // Check for email verification status every 5 seconds
      const checkVerified = setInterval(async () => {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          clearInterval(checkVerified);
          setIsLoading(false);
          navigation.replace("Login"); // Redirect to Login
        }
      }, 5000);
    } catch (error) {
      setEmailError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/Signup.jpg")} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        {verificationMessage ? <Text style={styles.verificationText}>{verificationMessage}</Text> : null}

        <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
