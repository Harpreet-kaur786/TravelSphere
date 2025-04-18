import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/HomeScreen/HomeScreen';
import DetailsScreen from './components/DetailsScreen/DetailsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import Footer from './components/Footer/Footer';
import GetStartedScreen from './components/GetStarted/GetStarted';
import LoginScreen from './components/LoginScreen/LoginScreen';
import SignUpScreen from './components/SignUpScreen/SignUp';
import { TouchableOpacity, Text, View } from 'react-native';
import FavouriteScreen from './components/FavouriteScreen/FavouriteScreen';
import ChecklistScreen from './components/ChecklistScreen/ChecklistScreen';
import FeedbackList from './components/FeedbackList/FeedbackList';
import AppTutorialScreen from './components/AppTutorial/AppTutorial';
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
      <Drawer.Screen name='Favourite' component={FavouriteScreen}/>
      <Drawer.Screen name="Checklist" component={ChecklistScreen} />
      <Drawer.Screen name='Feedback List' component={FeedbackList}/>
      <Drawer.Screen name='BadgesScreen' component={BadgesScreen}/>
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
          <Stack.Screen name="AppTutorial" component={AppTutorialScreen} />
          <Stack.Screen 
  name="Details" 
  component={DetailsScreen} 
  options={({ navigation }) => ({
    headerShown: true,
    title: "Destination Details",
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerLeft: () => (
      <TouchableOpacity 
        onPress={() => navigation.navigate("Home")} 
        style={{
          paddingLeft: 15,
        }}
      >
        <Ionicons name="home-outline" size={34} color="#63c9e5" marginLeft={10} />
      </TouchableOpacity>
    ),
  })}
/>

        </Stack.Navigator>
      </NavigationContainer>
    </ProgressProvider>
  );
};
export default App;