import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const FavouriteScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [])
  );

  const loadFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favourites");
      if (favs) {
        setFavourites(JSON.parse(favs));
      }
    } catch (error) {
      console.error("Error loading favourites:", error);
    }
  };

  const toggleFavourite = async (item) => {
    try {
      let updatedFavourites = [...favourites];
      const index = updatedFavourites.findIndex((fav) => fav.name === item.name);

      if (index === -1) {
        updatedFavourites.push(item);
      } else {
        updatedFavourites.splice(index, 1);
      }

      setFavourites(updatedFavourites);
      await AsyncStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Favourites</Text>

      {favourites.length === 0 ? (
        <Text>No favourites added yet.</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Details", { item })}>
                  <AntDesign name="eye" size={16} color="blue" />
                  <Text> View Details</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => toggleFavourite(item)}>
                <AntDesign
                  name="heart"
                  size={20}
                  color={favourites.some((fav) => fav.name === item.name) ? "red" : "gray"}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* ✅ Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  homeButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FavouriteScreen;