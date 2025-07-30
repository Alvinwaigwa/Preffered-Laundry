import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import all screens
import ImageViewer from './components/ImageViewer';
import CustomersScreen from './screens/CustomersScreen';
import Homescreen from './screens/Homescreen';
import LoginScreen from './screens/LoginScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import OrderFormScreen from './screens/OrderFormScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { globalStyles } from './styles/globalStyles';

const Logo = require('./assets/cropped-headerfinal.jpg');

export const AuthContext = createContext();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: 'white' },
      tabBarActiveTintColor: '#231942',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Home"
      component={Homescreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Customers"
      component={CustomersScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="users" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Reports"
      component={ReportsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="bar-chart" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="cog" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Replace with actual auth check
      setTimeout(() => setIsLoading(false), 1500);
    };
    checkAuthStatus();
  }, []);

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
                  name="Main"
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