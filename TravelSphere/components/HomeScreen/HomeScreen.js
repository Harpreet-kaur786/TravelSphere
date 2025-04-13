import React, { useState, useEffect } from "react";

import {
  TextInput,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { firestore, collection, getDocs, query, where } from "../../firebase";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { signOut } from "firebase/auth";

import { auth } from "../../firebase";

import styles from "./styles";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Picker } from "@react-native-picker/picker";

import { Modal } from "react-native";

import { Button } from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { serverTimestamp, addDoc } from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";

import { ScrollView } from "react-native-gesture-handler";

import { FAB } from "react-native-paper";

import { ImageBackground } from "react-native";

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
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");

  const [selectedSorting, setSelectedSorting] = useState("");

  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(false);

  const [allDestinations, setAllDestinations] = useState([]);

  const [filterVisible, setFilterVisible] = useState(false);

  const [resetItems, setResetItems] = useState([]);

  const [selectedRating, setSelectedRating] = useState("");

  const [selectedPopularity, setSelectedPopularity] = useState("");

  const [searchFilterDestinations, setSearchFilterDestinations] = useState([]);

  const [userName, setUserName] = useState("Default Name");

  const [userProfilePhoto, setUserProfilePhoto] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [newName, setNewName] = useState(userName);

  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  const [checklist, setChecklist] = useState([]);

  const [favourites, setFavourites] = useState([]);

  const categories = ["Beach", "Mountain", "Waterfall"];

  const [recommendations, setRecommendations] = useState([]);

  const [searchHistory, setSearchHistory] = useState([]);

  //Popular

  const [popularDestinations, setPopularDestinations] = useState([]);

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
    }
  };

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const q = query(
          collection(firestore, "destinations"),

          where("isPopular", "==", true)
        );

        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,

          ...doc.data(),
        }));

        setPopularDestinations(fetchedData);
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

  const user = auth.currentUser;

  // Request permission for image picker

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required!");
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

      AsyncStorage.getItem("userProfile").then((profileData) => {
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
        "state_changed",

        null,

        (error) => console.error("Upload error: ", error),

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

      console.log("Selected Image URI:", selectedUri);

      // Set the preview URI for the profile photo

      setNewProfilePhoto(selectedUri);
    }
  };

  const saveUserProfile = async (name, photoUrl) => {
    const profileData = { name, photoUrl };

    await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));

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

          <TouchableOpacity
            onPress={() => navigation.navigate("Favourite")}
            style={{ marginRight: 15 }}
          >
            <AntDesign name="heart" size={24} color="red" />
          </TouchableOpacity>

          {/* ✅ Checklist Icon */}

          <TouchableOpacity
            onPress={() => navigation.navigate("Checklist")}
            style={{ marginRight: 15 }}
          >
            <AntDesign name="checksquareo" size={24} color="#32CD32" />
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.replace("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    loadChecklist();

    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favourites");

      if (favs) {
        setFavourites(JSON.parse(favs)); // ✅ Ensure JSON data is parsed properly
      }
    } catch (error) {
      console.error("Error loading favourites:", error);
    }
  };

  const toggleFavourite = async (item) => {
    try {
      let storedFavourites = await AsyncStorage.getItem("favourites");

      let favouritesArray = storedFavourites
        ? JSON.parse(storedFavourites)
        : [];

      if (!Array.isArray(favouritesArray)) favouritesArray = [];

      let updatedFavourites;

      // ✅ Add if not exists, remove if exists

      if (favouritesArray.some((fav) => fav.name === item.name)) {
        updatedFavourites = favouritesArray.filter(
          (fav) => fav.name !== item.name
        );
      } else {
        updatedFavourites = [...favouritesArray, item];
      }

      setFavourites(updatedFavourites);

      await AsyncStorage.setItem(
        "favourites",

        JSON.stringify(updatedFavourites)
      );
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
  };

  // To store the search term

  const storeSearchTerm = async (searchTerm) => {
    try {
      let searchHistory = await AsyncStorage.getItem("searchHistory");

      searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

      // Add new search term to the beginning of the array

      searchHistory.unshift(searchTerm);

      // Keep only the last 5 search terms

      if (searchHistory.length > 5) {
        searchHistory = searchHistory.slice(0, 5);
      }

      // Save the updated search history to AsyncStorage

      await AsyncStorage.setItem(
        "searchHistory",

        JSON.stringify(searchHistory)
      );
    } catch (error) {
      console.error("Error storing search term: ", error);
    }
  };

  //To get the Search history

  const getSearchHistory = async () => {
    try {
      const searchHistory = await AsyncStorage.getItem("searchHistory");

      return searchHistory ? JSON.parse(searchHistory) : [];
    } catch (error) {
      console.error("Error retrieving search history: ", error);

      return [];
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const history = await getSearchHistory();

      console.log("Search Historyy:", history);

      setSearchHistory(history); // Ensure this updates the state after fetching
    } catch (error) {
      console.error("Error fetching search history: ", error);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchRecommendations = async (searchHistory) => {
    try {
      if (searchHistory.length === 0) return;

      // Remove duplicates in the search history

      const uniqueSearchHistory = [...new Set(searchHistory)];

      // Now query Firestore based on the unique search terms

      const q = query(collection(firestore, "destinations"));

      const querySnapshot = await getDocs(q); // Get the results of the query

      const recom = [];

      querySnapshot.forEach((doc) => {
        const destination = doc.data();

        // Check if any search term matches destination's name, country, or category

        uniqueSearchHistory.forEach((searchTerm) => {
          if (
            destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (destination.country &&
              destination.country

                .toLowerCase()

                .includes(searchTerm.toLowerCase())) ||
            (destination.category &&
              destination.category

                .toLowerCase()

                .includes(searchTerm.toLowerCase()))
          ) {
            recom.push(destination);
          }
        });
      });

      // Set recommendations, ensuring unique destinations

      setRecommendations([...new Set(recom)]);
    } catch (error) {
      console.error("Error fetching recommendations from Firestore: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const history = await getSearchHistory();

      if (history.length > 0) {
        await fetchRecommendations(history); // Fetch recommendations based on search history
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={{ marginRight: 10, marginBottom: 0, paddingBottom: 0 }}
          onPress={() => {
            // Navigate to DetailsScreen and pass destination item

            navigation.navigate("Details", { item: item });
          }}
        >
          {/* Check if item has an image URL from Firestore */}

          {item.image ? (
            <Image
              source={{ uri: item.image }} // Fetch image from Firestore URL
              style={{
                width: 100,

                height: 100,

                borderRadius: 10,

                marginBottom: 0,
              }}
            />
          ) : (
            <Text>No Image</Text> // Fallback if no image is found
          )}

          <Text style={{ marginBottom: 0 }}>{item.name}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(firestore, "destinations"));

      const querySnapshot = await getDocs(q);

      const destinationsData = querySnapshot.docs.map((doc) => doc.data());

      setAllDestinations(destinationsData);

      storeSearchTerm(searchTerm);

      const filteredDestinations = destinationsData.filter((destination) => {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        const nameMatch =
          levenshtein(destination.name.toLowerCase(), normalizedSearchTerm) <=
          2;

        const descriptionMatch =
          levenshtein(
            destination.description.toLowerCase(),

            normalizedSearchTerm
          ) <= 2;

        const countryMatch =
          destination.country &&
          levenshtein(
            destination.country.toLowerCase(),

            normalizedSearchTerm
          ) <= 2;

        const categoryMatch =
          destination.category &&
          levenshtein(
            destination.category.toLowerCase(),

            normalizedSearchTerm
          ) <= 2;

        // const popularity = destination.popularity;

        const rating = destination.rating;

        return nameMatch || descriptionMatch || countryMatch || categoryMatch;
      });

      setDestinations(filteredDestinations);

      setSearchFilterDestinations(filteredDestinations);

      //setFilterVisible(true); // Show filter section after search

      setResetItems(filteredDestinations);
    } catch (error) {
      console.error("Error fetching destinations: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    let filtered = [...searchFilterDestinations];

    // Filter by country

    if (selectedCountry) {
      filtered = filtered.filter(
        (destination) =>
          destination.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    // Filter by category

    if (selectedCategory) {
      filtered = filtered.filter(
        (destination) =>
          destination.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by popularity (if selected)

    if (selectedPopularity) {
      filtered = filtered.filter(
        (destination) => destination.popularity === Number(selectedPopularity)
      );
    }

    // Filter by rating (if selected)

    if (selectedRating) {
      filtered = filtered.filter(
        (destination) => destination.rating === Number(selectedRating)
      );
    }

    // Sorting by rating or descending order or proximity

    if (selectedSorting === "rating") {
      filtered = filtered.slice().sort((a, b) => b.rating - a.rating);
    } else if (selectedSorting === "reverse") {
      filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSorting === "proximity") {
      filtered = filtered.slice().sort((a, b) => a.proximity - b.proximity);
    }

    setDestinations(filtered);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const resetFilters = () => {
    setSelectedCategory("");

    setSelectedCountry("");

    setSelectedSorting("");

    setSelectedPopularity("");

    setSelectedRating("");

    setDestinations(resetItems);
  };

  const resetSearch = () => {
    setSearchTerm("");

    setSelectedCategory("");

    setSelectedCountry("");

    setSelectedPopularity("");

    setSelectedRating("");

    setSelectedSorting("");

    setDestinations([]);

    setFilterVisible(false);
  };

  //checklist

  const loadChecklist = async () => {
    try {
      const storedChecklist = await AsyncStorage.getItem("checklist");

      if (storedChecklist) {
        setChecklist(JSON.parse(storedChecklist));
      }
    } catch (error) {
      console.error("Error loading checklist:", error);
    }
  };

  const toggleChecklist = async (item) => {
    try {
      let storedChecklist = await AsyncStorage.getItem("checklist");

      let checklistArray = storedChecklist ? JSON.parse(storedChecklist) : [];

      if (!Array.isArray(checklistArray)) checklistArray = [];

      let updatedChecklist;

      if (checklistArray.some((chk) => chk.name === item.name)) {
        updatedChecklist = checklistArray.filter(
          (chk) => chk.name !== item.name
        );
      } else {
        updatedChecklist = [...checklistArray, item];
      }

      setChecklist(updatedChecklist);

      await AsyncStorage.setItem("checklist", JSON.stringify(updatedChecklist));
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/backgd.jpeg")} // 👈 Replace with your image path
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          data={destinations}
          keyExtractor={(item, index) => index.toString()}
          style={{ backgroundColor: "transparent" }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>

                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => toggleChecklist(item)}
                    style={styles.actionButton}
                  >
                    <AntDesign
                      name={
                        checklist.some((chk) => chk.name === item.name)
                          ? "checksquare"
                          : "checksquareo"
                      }
                      size={20}
                      color="#32CD32"
                    />

                    <Text
                      style={{
                        marginLeft: 5,

                        color: "#32CD32",

                        fontWeight: "bold",
                      }}
                    >
                      Make Checklist
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleFavourite(item)}
                    style={styles.actionButton}
                  >
                    <AntDesign
                      name={
                        favourites.some((fav) => fav.name === item.name)
                          ? "heart"
                          : "hearto"
                      }
                      size={20}
                      color="red"
                    />

                    <Text
                      style={{
                        marginLeft: 5,

                        color: "red",

                        fontWeight: "bold",
                      }}
                    >
                      Add to Favourites
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Details", { item })}
                    style={styles.detailsLink}
                  >
                    <AntDesign name="plus" size={16} color="#4CAF50" />

                    <Text style={styles.detailsText}> View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={
            <>
              {/* Profile and Search Section */}

              <View style={styles.topContainer}>
                <View style={styles.profileSection}>
                  <Image
                    source={
                      newProfilePhoto
                        ? { uri: newProfilePhoto }
                        : require("../../assets/character.jpg")
                    }
                    style={styles.profileImage}
                  />

                  <View style={styles.profileInfo}>
                    <Text
                      style={styles.profileName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {userName}
                    </Text>

                    <TouchableOpacity
                      onPress={handleEditProfile}
                      style={styles.editButton}
                    >
                      <AntDesign name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.searchContainer}>
                  <TouchableOpacity
                    onPress={resetSearch}
                    style={styles.searchIcon}
                  >
                    <AntDesign name="reload1" size={18} color="#4CAF50" />
                  </TouchableOpacity>

                  <TextInput
                    style={[styles.inputContainer, { color: "#000" }]}
                    placeholder="Destinations"
                    placeholderTextColor="#888"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />

                  <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchIcon}
                  >
                    <AntDesign name="search1" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filters */}

              <View style={styles.filterContainer}>
                <View style={styles.filterTitleContainer}>
                  <Text style={styles.filterTitle}>Filter</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={resetFilters}
                      style={styles.filterToggle}
                    >
                      <AntDesign
                        name={filterVisible ? "reload1" : ""}
                        size={18}
                        color="#4CAF50"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={toggleFilter}
                      style={styles.filterToggle}
                    >
                      <AntDesign
                        name={filterVisible ? "minus" : "plus"}
                        size={24}
                        color="#4CAF50"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {filterVisible && (
                  <>
                    {/* Filter fields */}

                    <Picker
                      selectedValue={selectedCountry}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setSelectedCountry(itemValue)
                      }
                    >
                      <Picker.Item label="Select Country" value="" />

                      <Picker.Item label="India" value="India" />

                      <Picker.Item label="Australia" value="Australia" />

                      <Picker.Item label="France" value="France" />

                      <Picker.Item label="Canada" value="Canada" />

                      <Picker.Item label="England" value="England" />

                      <Picker.Item label="Sweden" value="Sweden" />

                      <Picker.Item label="China" value="China" />

                      <Picker.Item label="USA" value="USA" />

                      <Picker.Item label="Japan" value="Japan" />
                    </Picker>

                    <Picker
                      selectedValue={selectedCategory}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setSelectedCategory(itemValue)
                      }
                    >
                      <Picker.Item label="Select Category" value="" />

                      <Picker.Item
                        label="Architectural"
                        value="Architectural"
                      />

                      <Picker.Item label="Nature" value="Nature" />

                      <Picker.Item label="Historical" value="Historical" />

                      <Picker.Item label="Adventure" value="Adventure" />

                      <Picker.Item label="Cultural" value="Cultural" />

                      <Picker.Item label="Urban" value="Urban" />

                      <Picker.Item label="Spiritual" value="Spiritual" />

                      <Picker.Item label="Artistic" value="Artistic" />

                      <Picker.Item label="Romantic" value="Romantic" />

                      <Picker.Item
                        label="Amusement Park"
                        value="Amusement Park"
                      />

                      <Picker.Item label="Unique Stay" value="Unique Stay" />
                    </Picker>

                    <Picker
                      selectedValue={selectedRating}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setSelectedRating(itemValue)
                      }
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
                      onValueChange={(itemValue) =>
                        setSelectedPopularity(itemValue)
                      }
                    >
                      <Picker.Item label="Select By Popularity" value="" />

                      <Picker.Item label="Trending" value="1" />

                      <Picker.Item label="Famous Spots" value="2" />

                      <Picker.Item label="Hidden Gems" value="3" />
                    </Picker>

                    <Picker
                      selectedValue={selectedSorting}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        setSelectedSorting(itemValue)
                      }
                    >
                      <Picker.Item label="Sort By" value="" />

                      <Picker.Item label="Rating" value="rating" />

                      <Picker.Item label="Reverse Order" value="reverse" />

                      <Picker.Item label="Proximity" value="proximity" />
                    </Picker>

                    <TouchableOpacity
                      onPress={handleFilterChange}
                      style={styles.applyButton}
                    >
                      <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          }
          ListFooterComponent={
            <>
              {/* Recommended Section */}

              <Text style={styles.sectionTitle}>Recommended</Text>

              {recommendations.length > 0 ? (
                <FlatList
                  data={recommendations}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 10 }}
                />
              ) : (
                <Text style={{ marginBottom: 10 }}>
                  No recommendations available.
                </Text>
              )}

              {/* Popular Section */}

              <Text style={styles.sectionTitle}>Popular</Text>

              <FlatList
                data={popularDestinations}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate("Details", { item })}
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
                showsHorizontalScrollIndicator={false}
              />

              {/* Tutorial Shortcut and Feedback Button in Same Row */}

              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-around",

                  alignItems: "center",

                  marginTop: 20,

                  marginBottom: 40,
                }}
              >
                {/* Tutorial Button */}

                <TouchableOpacity
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    padding: 10,

                    backgroundColor: "#007bff",

                    borderRadius: 25,

                    paddingHorizontal: 15,
                  }}
                  onPress={() => navigation.navigate("AppTutorial")}
                >
                  <Ionicons name="play-circle" size={24} color="#fff" />

                  <Text
                    style={{ color: "#fff", fontWeight: "bold", marginLeft: 8 }}
                  >
                    Tutorial
                  </Text>
                </TouchableOpacity>

                {/* Feedback Button - matching style */}

                <TouchableOpacity
                  style={{
                    flexDirection: "row",

                    alignItems: "center",

                    padding: 10,

                    backgroundColor: "#007bff",

                    borderRadius: 25,

                    paddingHorizontal: 15,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <MaterialIcons name="feedback" size={24} color="#fff" />

                  <Text
                    style={{ color: "#fff", fontWeight: "bold", marginLeft: 8 }}
                  >
                    Feedback
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          }
        />
      </ImageBackground>

      {/* Feedback Modal */}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Give Feedback</Text>

            {!anonymous && (
              <TextInput
                style={styles.input}
                placeholder="Your Name (Optional)"
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              style={styles.textArea}
              placeholder="Enter your feedback..."
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />

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

            <TouchableOpacity style={styles.button} onPress={submitFeedback}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ fontSize: 16, color: "#007bff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HomeScreen;
