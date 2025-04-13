import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressContext } from '../ProgressContext/ProgressContext';
import { ProgressBar } from 'react-native-paper'; // ✅ Import from paper

const BadgesScreen = () => {
  const navigation = useNavigation();
  const progress = useContext(ProgressContext);

  if (!progress) return <Text>Loading...</Text>;

  const {
    destinationsVisited,
    checklistsCompleted,
    tripsPacked,
    userPoints,
    setUserPoints,
  } = progress;

  const handleBadgePress = (screen, points) => {
    setUserPoints((prev) => prev + points);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏅 Your Badges</Text>
        <Text style={styles.pointsText}>🏆 Points: {userPoints}</Text>

        {/* 🌍 Explorer Badge */}
        <TouchableOpacity
          style={[styles.badgeContainer, { backgroundColor: '#76C4DE' }]}
          onPress={() => handleBadgePress('Home', 10)}
        >
          <Text style={styles.badgeTitle}>🌍 Explorer</Text>
          <ProgressBar progress={destinationsVisited / 5} color="#fff" style={styles.bar} />
        </TouchableOpacity>

        {/* ✅ Checklist Champion Badge */}
        <TouchableOpacity
          style={[styles.badgeContainer, { backgroundColor: '#DFAE7B' }]}
          onPress={() => handleBadgePress('Checklist', 5)}
        >
          <Text style={styles.badgeTitle}>✅ Checklist Champion</Text>
          <ProgressBar progress={checklistsCompleted / 10} color="#fff" style={styles.bar} />
        </TouchableOpacity>

        {/* ⭐ Favourites Fan Badge */}
        <TouchableOpacity
          style={[styles.badgeContainer, { backgroundColor: '#DE8776' }]}
          onPress={() => handleBadgePress('Favourite', 7)}
        >
          <Text style={styles.badgeTitle}>⭐ Favourites Fan</Text>
          <ProgressBar progress={tripsPacked / 3} color="#fff" style={styles.bar} />
        </TouchableOpacity>
      </View>

      {/* 🏠 Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>🏠 Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BadgesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  pointsText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  badgeContainer: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  bar: {
    height: 10,
    width: '100%',
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  homeButton: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    backgroundColor: '#F58320',
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
