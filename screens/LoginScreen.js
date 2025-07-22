import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Carrefour', value: 'carrefour' },
    { label: 'Quickmart', value: 'quickmart' },
    { label: 'Naivas', value: 'naivas' },
    { label: 'Chandarana', value: 'chandarana' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Basic login simulation (replace with actual login logic)
    if ((email === 'name@example.com' && password === 'password') || (email === '' && password === '')) {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>

      {/* <ImageViewer placeholderImageSource={logo}/> */}
      
      <Text style={styles.title}>Preffered Laundry</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.dropdownContainer}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select your branch"
        listMode="SCROLLVIEW"
        style={styles.dropdown}
      />
       </View>

      

      

      <Button title={isLoading ? 'Logging in...' : 'Login'} onPress={handleLogin} />

      
    </View>
  );
}

LoginScreen.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#231942',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 18,
  },

  dropdown: {
    backgroundColor: 'light grey',
    borderColor: '#ccc',
  },


});
