import React, { useState, useEffect, createContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from './styles/globalStyles';
import ImageViewer from './components/ImageViewer';
import LoginScreen from './screens/LoginScreen';
import Homescreen from './screens/Homescreen';

const Logo = require('./assets/cropped-headerfinal.jpg');

// Create Auth Context
export const AuthContext = createContext();

// Navigation structures
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Here you could check AsyncStorage for existing auth tokens
      // For now we'll just use the splash screen timer
      setTimeout(() => setIsLoading(false), 3000);
    };
    checkAuthStatus();
  }, []);

  // Home tabs component
  const HomeTabs = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'white' },
        tabBarActiveTintColor: '#231942',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Homescreen"
        component={Homescreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerTitle: 'Home',
        }}
      />
      {/* Add more tabs here as needed */}
    </Tab.Navigator>
  );

  // Splash screen
  if (isLoading) {
    return (
      <View style={globalStyles.splashContainer}>
        <ImageViewer placeholderImageSource={Logo} />
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}