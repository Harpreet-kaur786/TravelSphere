import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firestore, collection, getDocs, query } from '../../firebase';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const levenshtein = (a, b) => {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) tmp[i] = [i];
  for (j = 0; j <= b.length; j++) tmp[0][j] = j;
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
};

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <AntDesign name="logout" size={24} color="red" />
        </TouchableOpacity>
        {/* Favourite Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Favourite')} style={{ marginRight: 15 }}>
            <AntDesign name="heart" size={24} color="red" />
          </TouchableOpacity>
          </>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  useEffect(() => {
    loadFavourites();
  }, []);
  
  const loadFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem('favourites');
      if (favs) {
        setFavourites(JSON.parse(favs));
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
    }
  };
  
  const toggleFavourite = async (item) => {
    let updatedFavourites = [...favourites];
    const index = updatedFavourites.findIndex(fav => fav.name === item.name);
    
    if (index === -1) {
      updatedFavourites.push(item); // Add if not in favourites
    } else {
      updatedFavourites.splice(index, 1); // Remove if already in favourites
    }
  
    setFavourites(updatedFavourites);
    await AsyncStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };
  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    setLoading(true);
    try {
      const q = query(collection(firestore, 'destinations'));
      const querySnapshot = await getDocs(q);
      const destinationsData = querySnapshot.docs.map(doc => doc.data());
      const filteredDestinations = destinationsData.filter(destination => {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const nameMatch = levenshtein(destination.name.toLowerCase(), normalizedSearchTerm) <= 3;
        const descriptionMatch = levenshtein(destination.description.toLowerCase(), normalizedSearchTerm) <= 3;
        const countryMatch = destination.country && levenshtein(destination.country.toLowerCase(), normalizedSearchTerm) <= 3;
        const categoryMatch = destination.category && levenshtein(destination.category.toLowerCase(), normalizedSearchTerm) <= 3;
        return nameMatch || descriptionMatch || countryMatch || categoryMatch;
      });
      setDestinations(filteredDestinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for destinations"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <AntDesign name="search1" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      {loading ? <Text>Loading...</Text> : null}
      {destinations.length > 0 ? (
        <FlatList
          data={destinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <TouchableOpacity 
                  style={styles.detailsLink} 
                  onPress={() => navigation.navigate('Details', { item })}
                >
                   <AntDesign 
                      name={favourites.some(fav => fav.name === item.name) ? 'heart' : 'hearto'} 
                      size={20} 
                      color="#FF6347" 
                    />
                  <AntDesign name="plus" size={16} color="#4CAF50" />
                  <Text style={styles.detailsText}> View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>No destinations found</Text>
      )}
    </View>
  );
};

export default HomeScreen;
