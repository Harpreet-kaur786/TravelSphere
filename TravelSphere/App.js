import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, TouchableOpacity, Text } from 'react-native';
import HomeScreen from './components/HomeScreen/HomeScreen';
import DetailsScreen from './components/DetailsScreen/DetailsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import GetStartedScreen from './components/GetStarted/GetStarted';
import LoginScreen from './components/LoginScreen/LoginScreen';
import SignUpScreen from './components/SignUpScreen/SignUp';
import FavouriteScreen from './components/FavouriteScreen/FavouriteScreen';
import ChecklistScreen from './components/ChecklistScreen/ChecklistScreen';
import FeedbackList from './components/FeedbackList/FeedbackList';
import BadgesScreen from './components/BadgesScreen/BadgesScreen';
import { ProgressProvider } from './components/ProgressContext/ProgressContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (Without Details)
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Favourite" component={FavouriteScreen} />
      <Drawer.Screen name="Checklist" component={ChecklistScreen} />
      <Drawer.Screen name="Feedback List" component={FeedbackList} />
      <Drawer.Screen name="BadgesScreen" component={BadgesScreen} />
    </Drawer.Navigator>
  );
}

// Stack Navigator (Includes Details)
const App = () => {
  return (
    <ProgressProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={DrawerNavigator} />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                <View style={{ paddingLeft: 15 }}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ fontSize: 18, paddingLeft: 15 }}>← Back</Text>
                </TouchableOpacity>
                </View>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProgressProvider>
  );
};

export default App;