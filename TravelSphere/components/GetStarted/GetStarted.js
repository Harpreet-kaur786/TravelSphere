import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "./styles";
const GetStartedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TravelSphere</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStartedScreen;
