import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../App'; // Adjust path as needed

export default function LoginScreen({ navigation }) {
  // Get auth context
  const { setIsLoggedIn } = useContext(AuthContext);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown states
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Carrefour', value: 'carrefour' },
    { label: 'Quickmart', value: 'quickmart' },
    { label: 'Naivas', value: 'naivas' },
    { label: 'Chandarana', value: 'chandarana' },
  ]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!email || !password || !value) {
        Alert.alert('Validation Error', 'Please fill all fields and select a branch');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      const isAuthenticated = email === 'name@example.com' && password === 'password';
      
      if (isAuthenticated) {
        setIsLoggedIn(true);
        // Optional: Save branch selection
        // await AsyncStorage.setItem('selectedBranch', value);
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferred Laundry</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
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
          dropDownContainerStyle={styles.dropdownList}
        />
      </View>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000, // Important for dropdown to appear above other elements
  },
  dropdown: {
    backgroundColor: 'lightgrey',
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: 'lightgrey',
    borderColor: '#ccc',
  },
  loginButton: {
    backgroundColor: '#231942',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});