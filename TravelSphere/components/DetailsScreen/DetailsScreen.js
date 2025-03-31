import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import axios from 'axios';

const DetailsScreen = ({ route, navigation }) => {
  const { item: destination } = route.params || {};

  if (!destination) {
    console.error("No destination data provided!");
    navigation.goBack();
    return null;
  }

  const { name, description, bestTime, category, country, tips, attractions, image, 'co-ordinates': coordinates } = destination;

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coordinates) {
      const fetchWeather = async () => {
        try {
          const apiKey = 'bbe8b53d8588c431ef2583584e243046';
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric`
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
    } else {
      setLoading(false); // If no coordinates, set loading to false immediately
    }
  }, [coordinates]);

  const renderItem = ({ item }) => {
    if (item.isTitle) {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }
    return <Text style={styles.text}>{item.title}</Text>;
  };

  const staticMapUrl = destination['co-ordinates']
  ? `https://maps.gomaps.pro/maps/api/staticmap?center=${destination['co-ordinates'].latitude},${destination['co-ordinates'].longitude}&zoom=12&size=600x400&markers=color:red%7Clabel:A%7C${destination['co-ordinates'].latitude},${destination['co-ordinates'].longitude}&key=AlzaSyKCEnxPhd_T13y5e3WK0ouKaEeRoSGSG4R`
  : null;

  // Log the staticMapUrl to debug the map image generation
  console.log('Static Map URL:', staticMapUrl);

  return (
    <FlatList
      data={[
        { title: name || 'No name available', isTitle: true },
        { title: 'Description', isTitle: true },
        { title: description || 'No description available' },
        { title: 'Best Time to Visit', isTitle: true },
        { title: bestTime || 'No time specified' },
        { title: 'Category', isTitle: true },
        { title: category || 'No category specified' },
        { title: 'Country', isTitle: true },
        { title: country || 'No country specified' },
        { title: 'Tips', isTitle: true },
        { title: tips || 'No tips available for selected destination.' },
        { title: 'Weather', isTitle: true },
        {
          title: weatherError
            ? 'Unable to fetch weather data. Please try again later.'
            : loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : weather ? (
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherText}>
                  {weather.weather[0].description.toUpperCase()}, {weather.main.temp}°C
                </Text>
                <Text style={styles.weatherText}>
                  🌬 Wind: {weather.wind.speed} m/s | 💧 Humidity: {weather.main.humidity}%
                </Text>
              </View>
            ) : (
              <Text style={styles.text}>No weather data available</Text>
            ),
        },
        { title: 'Attractions', isTitle: true },
        ...(attractions ? attractions.map(attraction => ({ title: attraction })) : []),
        { title: 'Location on Map', isTitle: true },
        {
          title: staticMapUrl ? (
            <Image source={{ uri: staticMapUrl }} style={styles.mapImage} />
          ) : (
            <Text style={styles.text}>No map available</Text>
          ),
        },
      ]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>{name}</Text>
          <Swiper style={styles.carousel} showsButtons autoplay>
            {destination.images && Array.isArray(destination.images) ? (
              destination.images.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.carouselImage} />
              ))
            ) : (
              <Text style={styles.text}>No images available</Text>
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
    fontSize: 16,
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
  weatherContainer: {
    backgroundColor: '#D6EAF8', // Light blue background
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#154360', // Dark blue text for readability
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginTop: 10,
  },
});

export default DetailsScreen;