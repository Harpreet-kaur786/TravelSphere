import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firestore, collection, getDocs, query } from '../../firebase';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles'; 

const levenshtein = (a, b) => {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
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
  const [destinations, setDestinations] = useState([]);  // Stores all destinations
  const [filteredDestinations, setFilteredDestinations] = useState([]); // Stores searched destinations
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all destinations when the screen loads
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const q = query(collection(firestore, 'destinations'));
        const querySnapshot = await getDocs(q);
        const destinationsData = querySnapshot.docs.map(doc => doc.data());

        setDestinations(destinationsData); // Store all destinations
        setFilteredDestinations(destinationsData); // Initially show all destinations
      } catch (error) {
        console.error('Error fetching destinations: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // ✅ Filter destinations based on search
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredDestinations(destinations); // Show all if search is empty
      return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    const filtered = destinations.filter(destination => {
      // Case-insensitive search for name, description, country, and category
      const nameMatch = destination.name && levenshtein(destination.name.toLowerCase(), normalizedSearchTerm) <= 3;
      const descriptionMatch = destination.description && levenshtein(destination.description.toLowerCase(), normalizedSearchTerm) <= 3;
      const countryMatch = destination.country && levenshtein(destination.country.toLowerCase(), normalizedSearchTerm) <= 3;
      const categoryMatch = destination.category && levenshtein(destination.category.toLowerCase(), normalizedSearchTerm) <= 3;

      return nameMatch || descriptionMatch || countryMatch || categoryMatch;
    });

    setFilteredDestinations(filtered);
  };

  return (
    <View style={styles.container}>

      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for destinations"
          value={searchTerm}
          onChangeText={text => {
            setSearchTerm(text);
            handleSearch();
          }}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <AntDesign name="search1" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* ⏳ Show Loading Indicator */}
      {loading ? <Text>Loading...</Text> : null}

      {/* 🏝️ Display Destinations */}
      {filteredDestinations.length > 0 ? (
        <FlatList
          data={filteredDestinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* ✅ Display Image Correctly */}
              {Array.isArray(item.image) && item.image.length > 0 ? (
                <Image source={{ uri: item.image[0] }} style={styles.image} />
              ) : item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <Image 
                  source={{ uri: 'https://via.placeholder.com/150' }} 
                  style={styles.image} 
                />
              )}

              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.category}>Category: {item.category}</Text>
                <Text style={styles.country}>Country: {item.country}</Text>
                <TouchableOpacity 
                  style={styles.detailsLink} 
                  onPress={() => navigation.navigate('Details', { item })}
                >
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
