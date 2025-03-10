import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { firestore, collection, getDocs, query } from '../../firebase';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {Modal} from 'react-native';
import {Button} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"

const storage = getStorage();
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSorting, setSelectedSorting] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allDestinations, setAllDestinations] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false); // Filter visibility state
  const [resetItems,setResetItems] = useState([]);
  const [selectedRating,setSelectedRating] = useState('');
  const [selectedPopularity, setSelectedPopularity] = useState('');
  const [searchFilterDestinations, setSearchFilterDestinations] = useState([]);
  const [userName, setUserName] = useState('Default Name');
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [favourites, setFavourites] = useState([]); // ✅ FIX: Define `setFavourites` state
  const [checklist, setChecklist] = useState([]);

  const user = auth.currentUser;
  // Request permission for image picker
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
    }
  };
  useEffect(() => {
    requestPermissions();
  }, []);
  // Fetch user data when the component mounts
  useEffect(() => {
    if (user) {
      // Fetch user data from Firestore or AsyncStorage
      // For example, using AsyncStorage or Firestore
      AsyncStorage.getItem('userProfile').then((profileData) => {
        if (profileData) {
          const profile = JSON.parse(profileData);
          setUserName(profile.name);
          setUserProfilePhoto(profile.photoUrl);
        }
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setNewName(userName); // Ensure the input field shows the current name
    setIsEditingProfile(true); // Enable editing mode
  };
  
    
  const handleSaveProfile = async () => {
    // Save the name first
    await saveUserProfile(newName, newProfilePhoto || userProfilePhoto);
  
    // If a new profile photo is selected, upload it
    if (newProfilePhoto) {
      const response = await fetch(newProfilePhoto);
      const blob = await response.blob();
    
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
    
      uploadTask.on(
        'state_changed',
        null,
        (error) => console.error('Upload error: ', error),
        async () => {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Save both name and photoURL
          await saveUserProfile(newName, photoURL);
          setUserProfilePhoto(photoURL); // Update the profile image state
        }
      );
    } else {
      // If no new photo, just save the current photo and name
      await saveUserProfile(newName, userProfilePhoto);
    }
    
    setIsEditingProfile(false);
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      // Update the state with the selected image URI
      const selectedUri = result.assets[0].uri;
      console.log('Selected Image URI:', selectedUri);
      
      // Set the preview URI for the profile photo
      setNewProfilePhoto(selectedUri); 
    }
  };


  const saveUserProfile = async (name, photoUrl) => {
    const profileData = { name, photoUrl };
    await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
    setUserName(name); // Update the name immediately in the state
    setUserProfilePhoto(photoUrl); // Update the photo immediately in the state
  };

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
          {/* ✅ Checklist Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Checklist')} style={{ marginRight: 15 }}>
            <AntDesign name="checksquareo" size={24} color="#32CD32" />
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
    loadChecklist();
    loadFavourites();
  }, []);
  
   const loadFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem('favourites');
      if (favs) {
        setFavourites(JSON.parse(favs)); // ✅ FIX: `setFavourites` now exists
      } else {
        setFavourites([]);
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
      setFavourites([]);
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
        // const popularity = destination.popularity;
        // const rating = destination.rating;

        return nameMatch || descriptionMatch || countryMatch || categoryMatch;
      });

      setDestinations(filteredDestinations);
      setSearchFilterDestinations(filteredDestinations);
      setFilterVisible(true); // Show filter section after search
      setResetItems(filteredDestinations);
    } catch (error) {
      console.error('Error fetching destinations: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    // let filtered = [...allDestinations];
    let filtered = [...searchFilterDestinations];

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(destination => destination.country === selectedCountry.toLowerCase());
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(destination => destination.category === selectedCategory.toLowerCase());
    }

    
    // Filter by popularity (if selected)
    if (selectedPopularity) {
      filtered = filtered.filter(destination => destination.popularity.toString() === selectedPopularity);
    }

    // Filter by rating (if selected)
    if (selectedRating) {
      filtered = filtered.filter(destination => destination.rating.toString() === selectedRating);
    }


    // // Sorting by rating or popularity
    // if (selectedSorting === 'rating') {
    //   filtered = filtered.sort((a, b) => b.rating - a.rating); // Descending order by rating
    // } else if (selectedSorting === 'popularity') {
    //   filtered = filtered.sort((a, b) => a.popularity - b.popularity); // Ascending order by popularity
    // }

    setDestinations(filtered);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedSorting('');
    setSelectedPopularity('');
    setSelectedRating('');
    //setDestinations(allDestinations);
    setDestinations(resetItems);
  };
  const resetSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedPopularity('');
    setSelectedRating('');
    setSelectedSorting('');
    setDestinations([]);
    setFilterVisible(false);
  };

  //checklist
  const loadChecklist = async () => {
    try {
        const storedChecklist = await AsyncStorage.getItem('checklist');
        if (storedChecklist) {
            setChecklist(JSON.parse(storedChecklist));  // ✅ Ensure it’s set correctly
        } else {
            setChecklist([]);  // ✅ Default to empty array
        }
    } catch (error) {
        console.error('Error loading checklist:', error);
        setChecklist([]);
    }
};

// ✅ Load checklist when component mounts
useEffect(() => {
    loadChecklist();
}, []);

// ✅ Load checklist on component mount
useEffect(() => {
    loadChecklist();
}, []);

const toggleChecklist = async (item) => {
  try {
      let updatedChecklist = Array.isArray(checklist) ? [...checklist] : [];

      const index = updatedChecklist.findIndex(chk => chk.name === item.name);
      if (index === -1) {
          updatedChecklist.push({ ...item, items: [] }); // ✅ Ensure `items` field is initialized
      } else {
          updatedChecklist.splice(index, 1);
      }

      setChecklist(updatedChecklist);
      await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));

      // ✅ Navigate to Checklist screen after adding
      navigation.navigate('Checklist');

  } catch (error) {
      console.error('Error updating checklist:', error);
  }
};

<TouchableOpacity 
  onPress={() => toggleChecklist(item)} 
  style={styles.actionButton}
>
  <AntDesign 
    name={Array.isArray(checklist) && checklist.some(chk => chk.name === item.name) ? 'checksquare' : 'checksquareo'} 
    size={20} 
    color="#32CD32" 
  />
</TouchableOpacity>

  return (
    <View style={styles.container}>
     
     <View style={styles.topContainer}>
  {/* Profile Section */}
  <View style={styles.profileSection}>
    <Image
      source={newProfilePhoto ? { uri: newProfilePhoto } : require('../../assets/character.jpg')}
      style={styles.profileImage}
    />
    <View style={styles.profileInfo}>
      <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
        {userName}
      </Text>
      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <AntDesign name="edit" size={20} color="blue" />
      </TouchableOpacity>
    </View>
  </View>

  {/* Search Container */}
  <View style={styles.searchContainer}>
  <TouchableOpacity onPress={resetSearch} style={styles.searchIcon}>
  <AntDesign 
  name={Array.isArray(checklist) && checklist.some(chk => chk.name === item.name) ? 'checksquare' : 'checksquareo'} 
  size={20} 
  color="#32CD32" 
/>
  </TouchableOpacity>
    <TextInput
      style={[styles.inputContainer, { color: '#000' }]}
      placeholder="Search for destinations"
       placeholderTextColor="#888"
      value={searchTerm}
      onChangeText={setSearchTerm}
    />
    <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
      <AntDesign name="search1" size={24} color="#4CAF50" />
    </TouchableOpacity>
  </View>
</View>
     
<Modal 
  visible={isEditingProfile} 
  animationType="slide" 
  transparent 
  onRequestClose={() => setIsEditingProfile(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>

      {/* Profile Image with Edit Icon */}
      <View style={styles.profileImagePreviewContainer}>
        <Image 
          source={{ uri: newProfilePhoto || userProfilePhoto || 'https://placekitten.com/200/200' }} 
          style={styles.profileImageModal}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
          <AntDesign name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={newName}
        onChangeText={setNewName} 
      />

      {/* Change Profile Picture */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
        <Text style={styles.uploadButtonText}>Change Profile Picture</Text>
      </TouchableOpacity>

      {/* Save & Cancel Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditingProfile(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  </View>
</Modal>
<View style={styles.line} />
      {/* Filter section */}
      <View style={styles.filterContainer}>
        {/* Filter title and toggle button
        <View style={styles.filterTitleContainer}>
          <Text style={styles.filterTitle}>Filter</Text>
          <TouchableOpacity onPress={toggleFilter} style={styles.filterToggle}>
            <AntDesign name={filterVisible ? 'minus' : 'plus'} size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View> */}
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

            <Picker
              selectedValue={selectedRating}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedRating(itemValue)}
            >
              <Picker.Item label="Select By Rating" value="" />
              <Picker.Item label="⭐⭐⭐⭐⭐" value="5" />
              <Picker.Item label="⭐⭐⭐⭐" value="4" />
              <Picker.Item label="⭐⭐⭐" value="3" />
              <Picker.Item label="⭐⭐" value="2" />
              <Picker.Item label="⭐" value="1" />
            </Picker>

            <Picker
              selectedValue={selectedPopularity}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedPopularity(itemValue)}
            >
              <Picker.Item label="Select By Popularity" value="" />
              <Picker.Item label="Trending" value="1" />
              <Picker.Item label="Famous Spots" value="2" />
              <Picker.Item label="Hidden Gems" value="3" />

            </Picker>

            {/* <Picker
              selectedValue={selectedSorting}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSorting(itemValue)}
            >
              <Picker.Item label="Sort By" value="" />
              <Picker.Item label="Rating" value="rating" />
              <Picker.Item label="Popularity" value="popularity" />
            </Picker> */}

            {/* Reset button with loading indicator
            <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
              {loading ? (
                <AntDesign name="loading1" size={24} color="#fff" />
              ) : (
                <Text style={styles.applyText}>Reset</Text>
              )}
            </TouchableOpacity> */}

            {/* Apply button */}
            <TouchableOpacity onPress={handleFilterChange} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Loading Indicator */}
      {loading ? <Text>Loading...</Text> : null}

      {/* List of destinations */}
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
                <View style={styles.actionRow}>
                  {/* ✅ Add to Checklist Button */}
                  <TouchableOpacity onPress={() => toggleChecklist(item)} style={styles.actionButton}>
                  <AntDesign 
  name={Array.isArray(checklist) && checklist.some(chk => chk.name === item.name) ? 'checksquare' : 'checksquareo'} 
  size={20} 
  color="#32CD32" 
/>
                  </TouchableOpacity>
                  {/* View Details */}
                  <TouchableOpacity onPress={() => navigation.navigate('Details', { item })} style={styles.detailsLink}>
                    <AntDesign name="plus" size={16} color="#4CAF50" />
                    <Text style={styles.detailsText}> View Details</Text>
                  </TouchableOpacity>
                </View>
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
