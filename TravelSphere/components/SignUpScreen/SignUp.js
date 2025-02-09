import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import styles from './styles'
const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;

   // Username Validation
if (!username) {
  setUsernameError("Username is required.");
  isValid = false;
} else if (username.length > 8) {
  setUsernameError("Username cannot be more than 8 characters.");
  isValid = false;
} else if (!/(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(username)) {
  setUsernameError("Username must contain at least 1 lowercase letter, 1 number, and 1 special character.");
  isValid = false;
} else {
  setUsernameError("");
}

// ✅ Generate Suggestions if Invalid
if (!isValid) {
  const randomSuffix = Math.floor(Math.random() * 1000); // Random number for uniqueness
  const suggestion1 = `user${randomSuffix}!`; // Example: user123!
  const suggestion2 = `u${randomSuffix}_pass`; // Example: u789_pass
  setUsernameError(prevError => `${prevError}\nTry: ${suggestion1} or ${suggestion2}`);
}


    //  Email Validation
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

    //  Confirm Password Validation
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
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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
  );
};

export default SignUpScreen;
