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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  //const [selectedSorting, setSelectedSorting] = useState('');
  const [allDestinations, setAllDestinations] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false); // Filter visibility state
  const [resetItems,setResetItems] = useState([]);

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
    if (searchTerm.trim() === '') {
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(firestore, 'destinations'));
      const querySnapshot = await getDocs(q);
      const destinationsData = querySnapshot.docs.map(doc => doc.data());
      setAllDestinations(destinationsData);

      const filteredDestinations = destinationsData.filter(destination => {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        const nameMatch = levenshtein(destination.name.toLowerCase(), normalizedSearchTerm) <= 3;
        const descriptionMatch = levenshtein(destination.description.toLowerCase(), normalizedSearchTerm) <= 3;
        const countryMatch = destination.country && levenshtein(destination.country.toLowerCase(), normalizedSearchTerm) <= 3;
        const categoryMatch = destination.category && levenshtein(destination.category.toLowerCase(), normalizedSearchTerm) <= 3;

        return nameMatch || descriptionMatch || countryMatch || categoryMatch;
      });

      setDestinations(filteredDestinations);
      setFilterVisible(true); // Show filter section after search
      setResetItems(filteredDestinations);
    } catch (error) {
      console.error('Error fetching destinations: ', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleFilterChange = () => {
    let filtered = [...allDestinations];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(destination => destination.category === selectedCategory.toLowerCase());
    }

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(destination => destination.country === selectedCountry.toLowerCase());
    }

    setDestinations(filtered);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setDestinations(resetItems);
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

      {/* Filter section */}
      <View style={styles.filterContainer}>

        <View style={styles.filterTitleContainer}>
  <Text style={styles.filterTitle}>Filter</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity onPress={resetFilters} style={styles.filterToggle}>
      <AntDesign name={filterVisible ? 'reload1' : ''} size={18} color="#4CAF50" />
    </TouchableOpacity>
    <TouchableOpacity onPress={toggleFilter} style={styles.filterToggle}>
      <AntDesign name={filterVisible ? 'minus' : 'plus'} size={24} color="#4CAF50" />
    </TouchableOpacity>
  </View>
</View>


        {filterVisible && (
          <>
            {/* Filter fields */}
            <Picker
              selectedValue={selectedCountry}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedCountry(itemValue)}
            >
              <Picker.Item label="Select Country" value="" />
              <Picker.Item label="India" value="India" />
              <Picker.Item label="Australia" value="Australia" />
              <Picker.Item label="France" value="France" />
            </Picker>

            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Beach" value="Beach" />
              <Picker.Item label="Nature" value="Nature" />
              <Picker.Item label="Historical" value="Historical" />
              <Picker.Item label="Adventure" value="Adventure" />
              <Picker.Item label="Cultural" value="Cultural" />
              <Picker.Item label="Urban" value="Urban" />
              <Picker.Item label="Spiritual" value="Spiritual" />
              <Picker.Item label="Artistic" value="Artistic" />
              <Picker.Item label="Romantic" value="Romantic" />
              <Picker.Item label="Amusement Park" value="Amusement Park" />
              <Picker.Item label="Unique Stay" value="Unique Stay" />
            </Picker>

            {/* Apply button */}
            <TouchableOpacity onPress={handleFilterChange} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </>
        )}
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
