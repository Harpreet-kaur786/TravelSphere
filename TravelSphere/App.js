import React from 'react';
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
import { TouchableOpacity, Text } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (Without Details)
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// Stack Navigator (Includes Details)
const App = () => {
  return (
    <>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ fontSize: 18, paddingLeft: 15 }}>← Back</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Footer />
    </>
  );
};

export default App;
