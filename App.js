import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Add this line
import Icon from 'react-native-vector-icons/FontAwesome';

import ImageViewer from './components/ImageViewer';
import Homescreen from './screens/Homescreen';
import LoginScreen from './screens/LoginScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import OrderFormScreen from './screens/OrderFormScreen';
import { globalStyles } from './styles/globalStyles';

const Logo = require('./assets/cropped-headerfinal.jpg');

export const AuthContext = createContext();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setTimeout(() => setIsLoading(false), 3000);
    };
    checkAuthStatus();
  }, []);

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
    </Tab.Navigator>
  );

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}> 
        <View style={globalStyles.splashContainer}>
          <ImageViewer placeholderImageSource={Logo} />
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
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
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OrderForm"
                  component={OrderFormScreen}
                  options={{ title: 'New Order' }}
                />
                <Stack.Screen 
                  name="OrderDetail" 
                  component={OrderDetailScreen}
                  options={{ title: 'Order Details' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
