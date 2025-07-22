import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { globalStyles } from './styles/globalStyles';
import ImageViewer from './components/ImageViewer';

import LoginScreen from './screens/LoginScreen';
import Homescreen from './screens/Homescreen';

// const PlaceholderImage = require('./assets/background-img.png');
const Logo = require('./assets/cropped-headerfinal.jpg')

// Tab and Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Only valid during the current session

  useEffect(() => {
    // Show splash screen for 3 seconds
    const splashTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  // Display splash screen while loading
  if (isLoading) {
    return (
      <View style={globalStyles.splashContainer}>
        {/* <View style={globalStyles.imageContainer}>
          <ImageViewer placeholderImageSource={PlaceholderImage} />
        </View>
        <View style={globalStyles.textContainer}>
          <Text style={globalStyles.welcomeText}>Welcome to Centsible!</Text>
        </View> */}
        <ImageViewer placeholderImageSource={Logo}/>
      </View>
    );
  }

  // Home tab screens
  const HomeTabs = () => (
    <Tab.Navigator initialRouteName="Homescreen"
      screenOptions={{
        tabBarStyle: { backgroundColor: 'white' }, // Optional: Set the background color of the tab bar
        tabBarActiveTintColor: '#231942', // Active icon and label color
        tabBarInactiveTintColor: 'gray', // Inactive icon and label color
      }}>
        <Tab.Screen
        name="Homescreen"
        component={Homescreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
          headerTitle: 'Home',
        }}
      />
           
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
             name="Login"
             options={{ headerShown: false }}
            >
            {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen
            name="Home"
            children={(props) => <Homescreen {...props} setIsLoggedIn={setIsLoggedIn} /> }
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}