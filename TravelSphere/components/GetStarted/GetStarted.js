import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import styles from "./styles";

const GetStartedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image occupies 40% of the screen height */}
      <Image
        source={require('../../assets/pexels-nubikini-386009.jpg')} // Update with the correct path
        style={styles.image}
        resizeMode="cover"
      />

      {/* Bottom 60%: Welcome Text and Buttons */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Welcome to TravelSphere</Text>
        <Text style={styles.subtitle}>Start your adventure today</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate("SignUp")} 
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetStartedScreen;
