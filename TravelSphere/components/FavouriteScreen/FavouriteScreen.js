import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouriteScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Favourites</Text>
      {favourites.length === 0 ? (
        <Text>No favourites added yet.</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
              <Text>{item.name}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
                <AntDesign name="plus" size={16} color="green" />
                <Text> View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavouriteScreen;
