import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomersScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const savedCustomers = await AsyncStorage.getItem('customers');
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        }
      } catch (error) {
        console.error('Failed to load customers', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomers();
  }, []);

  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.customerItem}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
      <Icon name="chevron-right" size={16} color="#95a5a6" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={customers}
          renderItem={renderCustomerItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="users" size={50} color="#bdc3c7" />
              <Text style={styles.emptyText}>No customers yet</Text>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CustomerForm')}
      >
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  customerItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  customerInfo: {
    flex: 1
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50'
  },
  customerPhone: {
    color: '#7f8c8d',
    marginTop: 5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    marginTop: 15,
    color: '#bdc3c7',
    fontSize: 16
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});

export default CustomersScreen;