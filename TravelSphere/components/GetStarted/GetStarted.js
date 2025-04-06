import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const GetStartedScreen = () => {
  const navigation = useNavigation();

  // Hide header if needed
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require("../../assets/Started.mp4")}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>EXPLORE</Text>
        <Text style={styles.subtitle}>UNSEEN EARTH</Text>
        <Text style={styles.description}>
          TravelvSphere is a web-based collaborative travel guide based on the
          wiki format and book hotels by users.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
       {/* Watch App Tutorial Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AppTutorial')}
      >
        <Text style={styles.buttonText}>Watch App Tutorial</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetStartedScreen;
