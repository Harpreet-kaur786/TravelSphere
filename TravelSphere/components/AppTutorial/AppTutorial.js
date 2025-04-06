
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const featureVideos = [
  { title: "Login & Register", file: require('../../assets/LoginSignup.mov') },
  { title: "Change Name", file: require('../../assets/Screen Recording 2025-04-06 at 4.27.19 AM.mov') },
  { title: "View Destination", file: require('../../assets/BrowseDestination.mov') },
  { title: "Checklist", file: require('../../assets/Chceklist.mov') },
];

export default function AppTutorialScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      {/* Gradient Header */}
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Tutorial</Text>
      </LinearGradient>

      {/* Tutorial Cards */}
      <ScrollView contentContainerStyle={styles.container}>
        {featureVideos.map((video, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>{video.title}</Text>
            <Video
              source={video.file}
              useNativeControls
              resizeMode="contain"
              style={styles.video}
              isLooping
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  container: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    width: '90%',
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  video: {
    width: Dimensions.get('window').width * 0.85,
    height: 200,
    borderRadius: 15,
  },
});
