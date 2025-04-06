import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import { firestore } from '../../firebase';  
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {Modal} from 'react-native';
import {Button} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { ScrollView } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';


//Storage
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
  const [checklist, setChecklist] = useState([]);
  const [favourites, setFavourites] = useState([]); // ✅ Add this line

  const categories = ['Beach', 'Mountain', 'Waterfall'];
  //Popular destinations
  const [popularDestinations, setPopularDestinations] = useState([]);
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const q = query(collection(firestore, "destinations"), where("isPopular", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPopularDestinations(fetchedData); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching popular destinations: ", error);
      }
    };
  
    fetchPopularDestinations();
  }, []);

  const popularImages = {
    "Banff National Park": require("../../assets/Banff.jpg"),
    "CN Tower": require("../../assets/CNtower.jpg"),
    "Golden Temple": require("../../assets/GoldenTemple.jpg"),
   "Mount Fuji": require("../../assets/MountFuji.jpg"),
    "Niagara Falls": require("../../assets/NiagraFalls.jpg"),
    Paris: require("../../assets/Paris.jpg"),
    "Taj Mahal": require("../../assets/TajMahal.jpg"),
  };

  //Feedback session
  const [modalVisible, setModalVisible] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [name, setName] = useState("");
    const [rating, setRating] = useState(0);
  
    const [anonymous, setAnonymous] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim()) {
        alert("Please enter feedback before submitting.");
        return;
    }

    setLoading(true);
    try {
        await addDoc(collection(firestore, "feedback"), {
            feedback: feedback.trim(),
            name: anonymous ? "Anonymous" : name || "Anonymous",
            rating: rating || "No Rating",
            timestamp: serverTimestamp(),
        });

        alert("Feedback submitted successfully!");
        setFeedback("");
        setName("");
        setRating(0);
        setAnonymous(false);
        setModalVisible(false);
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback. Please try again.");
    } finally {
        setLoading(false);
    }
};

   //Profile name and Profile photo functionality
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
    setNewName(userName); 
    setIsEditingProfile(true); 
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
         
          await saveUserProfile(newName, photoURL);
          setUserProfilePhoto(photoURL); 
        }
      );
    } else {
      
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
   
      const selectedUri = result.assets[0].uri;
      console.log('Selected Image URI:', selectedUri);
      
     
      setNewProfilePhoto(selectedUri); 
    }
  };

  const saveUserProfile = async (name, photoUrl) => {
    const profileData = { name, photoUrl };
    await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
    setUserName(name); 
    setUserProfilePhoto(photoUrl); 
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
        setFavourites(JSON.parse(favs)); 
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
    }
  };

  const toggleFavourite = async (item) => {
    try {
      let storedFavourites = await AsyncStorage.getItem('favourites');
      let favouritesArray = storedFavourites ? JSON.parse(storedFavourites) : [];
  
      if (!Array.isArray(favouritesArray)) favouritesArray = [];
  
      let updatedFavourites;
  
      // ✅ Add if not exists, remove if exists
      if (favouritesArray.some(fav => fav.name === item.name)) {
        updatedFavourites = favouritesArray.filter(fav => fav.name !== item.name);
      } else {
        updatedFavourites = [...favouritesArray, item];
      }
  
      setFavourites(updatedFavourites);
      await AsyncStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  
    } catch (error) {
      console.error('Error updating favourites:', error);
    }
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
        setChecklist(JSON.parse(storedChecklist));
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };
  const toggleChecklist = async (item) => {
    try {
      let storedChecklist = await AsyncStorage.getItem('checklist');
      let checklistArray = storedChecklist ? JSON.parse(storedChecklist) : [];
  
      if (!Array.isArray(checklistArray)) checklistArray = [];
  
      let updatedChecklist;
      if (checklistArray.some(chk => chk.name === item.name)) {
        updatedChecklist = checklistArray.filter(chk => chk.name !== item.name);
      } else {
        updatedChecklist = [...checklistArray, item];
      }
  
      setChecklist(updatedChecklist);
      await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };
  
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
  <AntDesign name="reload1" size={18} color="#4CAF50" />
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

                  {/* ✅ Checklist Toggle Button */}
          <TouchableOpacity onPress={() => toggleChecklist(item)} style={styles.actionButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign
              name={checklist.some(chk => chk.name === item.name) ? 'checksquare' : 'checksquareo'}
              size={20}
              color="#32CD32"
            />
            <Text style={{ marginLeft: 5, color: '#32CD32', fontWeight: 'bold' }}>Make Checklist</Text>
          </View>
          </TouchableOpacity>

                  {/* ✅ Favourite Button (Heart Icon) */}
          <TouchableOpacity onPress={() => toggleFavourite(item, checklist)} style={styles.actionButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign
              name={favourites.some(fav => fav.name === item.name) ? 'heart' : 'hearto'}
              size={20}
              color="red"
            />
            <Text style={{ marginLeft: 5, color: 'red', fontWeight: 'bold' }}>Add to Favourites</Text>
          </View>
          </TouchableOpacity>
          
          {/* ✅ View Details Button */}
          <TouchableOpacity onPress={() => navigation.navigate('Details', { item })} style={styles.detailsLink}>
            <AntDesign name="plus" size={16} color="#4CAF50" />
            <Text style={styles.detailsText}> View Details</Text>
          </TouchableOpacity>

                  {/* View Details */}
                  {/* <TouchableOpacity onPress={() => navigation.navigate('Details', { item })} style={styles.detailsLink}>
                    <AntDesign name="plus" size={16} color="#4CAF50" />
                    <Text style={styles.detailsText}> View Details</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>No destinations found</Text>
      )}



<View style={styles.categoryContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity key={index} style={styles.categoryButton}>
          {/* Display an image based on the category */}
          <Image
            source={
              category === 'Beach' 
                ? require('../../assets/Signup.jpg') 
                : category === 'Mountain' 
                ? require('../../assets/Banff.jpg') 
                : category === 'Waterfall' 
                ? require('../../assets/NiagraFalls.jpg') 
                : null
            }
            style={styles.categoryImage}
          />
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
      {/* <Text style={styles.sectionTitle}>Places to Travel</Text>
      <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false} 
  contentContainerStyle={styles.regionTabsContainer}
>
  {['USA', 'Europe', 'Asia', 'Australia', 'India'].map((region, index) => (
    <TouchableOpacity key={index} style={styles.regionButton}>
      <Text style={styles.regionText}>{region}</Text>
    </TouchableOpacity>
  ))}
</ScrollView> */}
<Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Popular</Text>
<FlatList
      data={popularDestinations}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={{ marginRight: 10 }} 
          onPress={() => {
            
            navigation.navigate('Details', {
              item: item, 
            });
          }}
        >
          {popularImages[item.name] ? (
            <Image
              source={popularImages[item.name]}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          ) : (
            <Text>No Image</Text> 
          )}
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
    {/* Floating Feedback Button */}
 {/* Floating Feedback Button */}
 <FAB 
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#007bff"
                }}
                icon="message-text"
                label="Feedback"
                onPress={() => setModalVisible(true)}
            />

            {/* Feedback Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Give Feedback</Text>

                        {/* Name Input */}
                        {!anonymous && (
                            <TextInput
                                style={styles.input}
                                placeholder="Your Name (Optional)"
                                value={name}
                                onChangeText={setName}
                            />
                        )}

                        {/* Feedback Input */}
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your feedback..."
                            multiline
                            value={feedback}
                            onChangeText={setFeedback}
                        />

                        {/* Rating Selection */}
                        <View style={styles.ratingContainer}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Rate Us:</Text>
                            <View style={{ flexDirection: "row" }}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <TouchableOpacity key={num} onPress={() => setRating(num)}>
                                        <MaterialIcons 
                                            name="star" 
                                            size={30} 
                                            color={rating >= num ? "#f4c542" : "#ccc"} 
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Anonymous Toggle */}
                        <TouchableOpacity 
                            style={styles.checkboxContainer} 
                            onPress={() => setAnonymous(!anonymous)}
                        >
                            <MaterialIcons 
                                name={anonymous ? "check-box" : "check-box-outline-blank"} 
                                size={24} 
                                color="#007bff" 
                            />
                            <Text style={styles.checkboxText}>Submit as Anonymous</Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.button, loading && { backgroundColor: "#ccc" }]} 
                            onPress={submitFeedback} 
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Submit</Text>}
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={{ fontSize: 16, color: "#007bff" }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

    </View>
  );
};

export default HomeScreen;
