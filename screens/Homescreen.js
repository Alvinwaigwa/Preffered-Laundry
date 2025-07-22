import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, setIsLoggedIn }) {
  const branch = 'No branch selected'; 

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Preferred Laundry</Text>
      <Text style={styles.subtitle}>Branch: {branch}</Text>

      <Button
        title="Add New Clothing Item"
        onPress={() => navigation.navigate('AddClothes', { branch })}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'purple'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
});
