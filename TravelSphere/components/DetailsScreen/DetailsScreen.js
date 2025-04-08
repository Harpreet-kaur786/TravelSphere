import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, 
  TextInput, Button, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { firestore } from '../../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth } from '../../firebase'; // Firebase auth
import SendSMS from 'react-native-sms';
import { Linking, Alert } from 'react-native';

const DetailsScreen = ({ route, navigation }) => {
  const { item: destination } = route.params || {};

  if (!destination) {
    console.error("No destination data provided!");
    navigation.goBack();
    return null;
  }

  const { name, description, bestTime, category, country, tips, attractions, 'co-ordinates': coordinates } = destination;

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState('');
  const [userEmail, setUserEmail] = useState(auth?.currentUser?.email || "Anonymous");

  // Fetch Weather data
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
      setLoading(false);
    }
  }, [coordinates]);

  // Fetch Reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(firestore, 'reviews'), 
          where('destinationName', '==', name),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [name]);

  // Submit Review to Firestore
  const handleReviewSubmit = async () => {
    const ratingNumber = parseInt(userRating, 10);
    if (!userReview.trim() || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      alert('Please enter a valid review and rating (1-5).');
      return;
    }

    try {
      const newReview = {
        destinationName: name,
        text: userReview,
        rating: ratingNumber,
        userEmail: userEmail,
        createdAt: new Date(),
      };

      await addDoc(collection(firestore, 'reviews'), newReview);
      setReviews(prevReviews => [newReview, ...prevReviews]); // Update UI instantly
      setUserReview('');
      setUserRating('');
      alert('Review Submitted Successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  // Map URL for static image
  const staticMapUrl = coordinates
    ? `https://maps.gomaps.pro/maps/api/staticmap?center=${coordinates.latitude},${coordinates.longitude}&zoom=12&size=600x400&markers=color:red%7Clabel:A%7C${coordinates.latitude},${coordinates.longitude}&key=AlzaSyKCEnxPhd_T13y5e3WK0ouKaEeRoSGSG4R`
    : null;

  // Function to mask the entire domain part of the email (including @ and after)
  const maskEmail = (email) => {
    if (!email) return "Anonymous"; // If no email, show "Anonymous"

    const [localPart] = email.split('@');
    
    // Mask everything after the local part
    const maskedLocalPart = localPart ? localPart.slice(0, 15) + '*******' : ''; // Show the first 3 characters of the local part

    return maskedLocalPart;
  };

  // sharing
  const destinationLink = `https://www.travelsphere.com/destination/${encodeURIComponent(name)}`;

  // ✅ Share via WhatsApp
  const shareViaWhatsApp = () => {
    const message = `Check out this destination: ${name}!\n\n${description}\nLocation: ${country}\nMore info: ${destinationLink}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          alert("WhatsApp is not installed on this device.");
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };
  //  Share Via SMS
  const shareViaSMS = ({ name, description, country }) => {
    const link = `https://www.travelsphere.com/destination/${encodeURIComponent(name)}`;
    const message = `Check out this destination: ${name}!\n\n${description}\nLocation: ${country}\nMore info: ${link}`;
    const url = `sms:&body=${encodeURIComponent(message)}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('SMS not supported', 'No SMS app is available on this device.');
        }
      })
      .catch((err) => console.error('Error opening SMS:', err));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
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

          <View style={{ marginVertical: 10 }}>
            <Button title="Share via WhatsApp" onPress={shareViaWhatsApp} color="green" />
             <Button title="Share via SMS" onPress={() => shareViaSMS(destination)} />
           </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>{description || 'No description available'}</Text>

          <Text style={styles.sectionTitle}>Best Time to Visit</Text>
          <Text style={styles.text}>{bestTime || 'No time specified'}</Text>

          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.text}>{category || 'No category specified'}</Text>

          <Text style={styles.sectionTitle}>Country</Text>
          <Text style={styles.text}>{country || 'No country specified'}</Text>

          <Text style={styles.sectionTitle}>Tips</Text>
          <Text style={styles.text}>{tips || 'No tips available'}</Text>

          <Text style={styles.sectionTitle}>Weather</Text>
            {weatherError ? (
              <Text style={styles.text}>Unable to fetch weather data.</Text>
            ) : loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : weather ? (
              <View style={styles.weatherContainer}>
                {/* Ensure the icon URL is valid */}
                {weather.weather[0].icon ? (
                  <Image
                    style={styles.weatherIcon}
                    source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png` }} // Icon URL
                    resizeMode="contain"  // Ensure proper scaling
                  />
                ) : (
                  <Text>No icon available</Text> // Fallback message if no icon
                )}
                <Text style={styles.weatherText}>
                  {`${weather.weather[0].description.toUpperCase()}`}
                </Text>
                <Text style={styles.temperatureText}>
                  {`${weather.main.temp}°C`}
                </Text>
                
                {/* Display Wind and Humidity in separate lines */}
                <View style={styles.weatherDetails}>
                  <Text style={styles.weatherText}>
                    {`🌬 Wind: ${weather.wind.speed} m/s`}
                  </Text>
                  <Text style={styles.weatherText}>
                    {`💧 Humidity: ${weather.main.humidity}%`}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.text}>No weather data available</Text>
            )}



          <Text style={styles.sectionTitle}>Attractions</Text>
          {attractions && attractions.length ? (
            attractions.map((attraction, index) => (
              <Text key={index} style={styles.text}>{attraction}</Text>
            ))
          ) : (
            <Text style={styles.text}>No attractions available</Text>
          )}

           <Text style={styles.sectionTitle}>Location on Map</Text>
           {staticMapUrl ? (
             <Image source={{ uri: staticMapUrl }} style={styles.mapImage} />
           ) : (
             <Text style={styles.text}>No map available</Text>
           )}
          
          <Text style={styles.sectionTitle}>Submit Your Review...</Text>         
          <View style={styles.reviewContainer}>
            <View style={styles.reviewInputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Write your review..." 
                value={userReview} 
                onChangeText={setUserReview} 
                multiline 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Rating (1-5)" 
                value={userRating} 
                onChangeText={setUserRating} 
                keyboardType="numeric" 
              />
              <Button title="Submit Review" onPress={handleReviewSubmit} />
            </View>
          </View>

          <Text style={styles.sectionTitleR}>Reviews by Users</Text>

          {reviews.length > 0 ? (
            <View style={styles.reviewsList}>
              {reviews.map((review, index) => (
                <View key={review.id || index} style={styles.reviewItem}>
                  <Text style={styles.reviewUserText}>
                    {maskEmail(review.userEmail || "Anonymous")}
                  </Text>
                  <Text style={styles.reviewText}>
                    Reviews:"{review.text}"
                  </Text>
                  <Text style={styles.ratingText}>
                    Ratings: ⭐ {review.rating}/5
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.text}>No reviews yet.</Text>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
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
  sectionTitleR: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 25,
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
  mapImage: {
    width: '100%',
    height: 250,
    marginVertical: 15,
    borderRadius: 10,
  },
  reviewContainer: {
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  reviewInputContainer: {
    marginVertical: 15,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  reviewsList: {
    marginTop: 20,
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  reviewUserText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginTop: 5,
  },

weatherContainer: {
  backgroundColor: '#a5e0f0', // Soft light blue background
  padding: 20,
  borderRadius: 15,
  marginVertical: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5, // For Android shadow
},
weatherText: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2C3E50', // Dark text for contrast
  marginTop: 10,
},
temperatureText: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#E74C3C', // A warm color for temperature
},
weatherIcon: {
  width: 50,
  height: 50,
  marginBottom: 10,
},



});

export default DetailsScreen;
