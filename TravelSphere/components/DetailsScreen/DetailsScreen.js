import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator ,TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const DetailsScreen = ({ route, navigation }) => {
  const { item: destination } = route.params || {}; // Extracting destination directly

  if (!destination) {
    console.error("No destination data provided!");
    navigation.goBack(); // Navigate back if no data is provided
    return null;
  }

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (destination['co-ordinates']) {
      const fetchWeather = async () => {
        try {
          const apiKey = 'bbe8b53d8588c431ef2583584e243046'; // Ensure this is valid
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${destination['co-ordinates'].latitude}&lon=${destination['co-ordinates'].longitude}&appid=${apiKey}&units=metric`
          );

          if (response.status === 200) {
            setWeather(response.data);
            setWeatherError(false);
          } else {
            setWeatherError(true);
          }
        } catch (error) {
          console.error('Error fetching weather:', error);
          setWeatherError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
    }
  }, [destination]);

  const renderItem = ({ item }) => {
    if (item.isTitle) {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }
    return <Text style={styles.text}>{item.title}</Text>;
  };

  return (
    <FlatList
      data={[
        { title: destination.name || 'No name available as mentioned', isTitle: true },
        { title: 'Description', isTitle: true },
        { title: destination.description || 'No description available here' },
        { title: 'Best Time to Visit', isTitle: true },
        { title: destination.bestTime || 'No time specified' },
        { title: 'Category', isTitle: true },
        { title: destination.category || 'No category specified' },
        { title: 'Country', isTitle: true },
        { title: destination.country || 'No country specified' },
        { title: 'Tips', isTitle: true },
        { title: destination.tips || 'No tips available' },
        { title: 'Weather', isTitle: true },
        {
          title: weatherError
            ? 'Unable to fetch weather details. Please try again later.'
            : weather ? (
              <View>
                <Text style={styles.text}>
                  {weather.weather[0].description}, {weather.main.temp}°C
                </Text>
                <Text style={styles.text}>
                  Wind: {weather.wind.speed} m/s | Humidity: {weather.main.humidity}%
                </Text>
              </View>
            ) : (
              <Text style={styles.text}>Loading weather...</Text>
            ),
        },
        { title: 'Attractions', isTitle: true },
        ...(destination.attractions ? destination.attractions.map(attraction => ({ title: attraction })) : []),
      ]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>{destination.name}</Text>
          <Swiper style={styles.carousel} showsButtons autoplay>
            {destination.image && Array.isArray(destination.image) ? (
              destination.image.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.carouselImage} />
              ))
            ) : (
              <Text style={styles.text}>No images are available</Text>
            )}
          </Swiper>
        </>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2f4f4f',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#2f4f4f',
  },
  text: {
    fontSize: 17,
    color: '#555',
    marginBottom: 10,
  },
  carousel: {
    height: 250,
    marginBottom: 20,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
  },
});

export default DetailsScreen;