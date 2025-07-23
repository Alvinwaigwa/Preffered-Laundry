import React, { useContext, useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App'; // Adjust path as needed

export default function HomeScreen({ navigation }) {
  // Get auth context
  const { setIsLoggedIn } = useContext(AuthContext);

  // Branch selection states
  const [branch, setBranch] = useState('No branch selected');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Suit', value: 'Suit' },
    { label: 'Trouser', value: 'Trouser' },
    { label: 'Shirt', value: 'Shirt' },
    { label: 'Tie', value: 'Tie' },
  ]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoggedIn(false);
      // Optional: Clear any stored data
      // await AsyncStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBranchSelect = (selectedValue) => {
    setValue(selectedValue);
    // Update the displayed branch name
    const selectedBranch = items.find(item => item.value === selectedValue);
    if (selectedBranch) {
      setBranch(selectedBranch.label);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Preferred Laundry</Text>
      <Text style={styles.subtitle}>Branch: {branch}</Text>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={handleBranchSelect}
          setItems={setItems}
          placeholder="Add clothing"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
        />
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={styles.logoutButtonContent}>
            <Icon name="sign-out" size={18} color="white" />
            <Text style={styles.logoutButtonText}> Logout</Text>
          </View>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#231942'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
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
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});