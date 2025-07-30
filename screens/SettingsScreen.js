import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';
;
;

const SettingsScreen = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => setIsLoggedIn(false)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="moon-o" size={20} color="#3498db" />
          <Text style={styles.settingLabel}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#bdc3c7', true: '#3498db' }}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="bell-o" size={20} color="#3498db" />
          <Text style={styles.settingLabel}>Notifications</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#bdc3c7', true: '#3498db' }}
        />
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50'
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingLabel: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#e74c3c'
  },
  versionText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#95a5a6'
  }
});

export default SettingsScreen;