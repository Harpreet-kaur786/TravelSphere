import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../HomeScreen/HomeScreen';
import DetailsScreen from '../DetailsScreen/DetailsScreen';
import FavouriteScreen from '../FavouriteScreen/FavouriteScreen';
import BadgesScreen from '../BadgesScreen/BadgesScreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>

      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />  
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: true }} />
     <Stack.Screen name="Favourite" component={FavouriteScreen} options={{headerShown:true}}/>
     <Stack.Screen name="Badges" component={BadgesScreen} options={{ headerShown: true, title: "Your Badges" }} />
     </Stack.Navigator>
  );
};

export default StackNavigator;
