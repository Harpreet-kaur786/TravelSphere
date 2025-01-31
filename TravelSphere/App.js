import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './components/HomeScreen/HomeScreen';
import DetailsScreen from './components/DetailsScreen/DetailsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import Footer from './components/Footer/Footer';


const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">

        <Drawer.Screen name="Home" component={HomeScreen} />

        <Drawer.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={({ route, navigation }) => ({
            drawerItemStyle: route?.params?.isActive ? {} : { display: 'none' },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ fontSize: 18, paddingLeft: 15 }}>← Back</Text>
              </TouchableOpacity>
            ),
          })} 
        />

        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
     <Footer />
     </>
  );
};

export default App;
