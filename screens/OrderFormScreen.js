import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderFormScreen = ({ route, navigation }) => {
  const { orderToEdit, onSaveOrder } = route.params || {};
  
  const [order, setOrder] = useState({
    id: orderToEdit?.id || Date.now().toString(),
    customer: orderToEdit?.customer || { name: '', phone: '', address: '' },
    items: orderToEdit?.items || [],
    status: orderToEdit?.status || 'pending',
    total: orderToEdit?.total || 0,
    createdAt: orderToEdit?.createdAt || new Date().toISOString(),
    notes: orderToEdit?.notes || ''
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: 1
  });
  
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const savedCustomers = await AsyncStorage.getItem('customers');
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        }
      } catch (error) {
        console.error('Failed to load customers', error);
      }
    };
    
    loadCustomers();
  }, []);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please enter item name and price');
      return;
    }
    
    const item = {
      ...newItem,
      price: parseFloat(newItem.price),
      id: Date.now().toString()
    };
    
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, item],
      total: prev.total + (item.price * item.quantity)
    }));
    
    setNewItem({ name: '', price: '', quantity: 1 });
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = order.items.find(item => item.id === id);
    if (!itemToRemove) return;
    
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
      total: prev.total - (itemToRemove.price * itemToRemove.quantity)
    }));
  };

  const handleSave = () => {
    if (!order.customer.name || !order.customer.phone) {
      Alert.alert('Error', 'Please enter customer name and phone');
      return;
    }
    
    if (order.items.length === 0) {
      Alert.alert('Error', 'Please add at least one service item');
      return;
    }
    
    if (onSaveOrder) {
      onSaveOrder(order);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {orderToEdit ? 'Edit Order' : 'New Order'}
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={order.customer.name}
          onChangeText={(text) => setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, name: text }
          }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={order.customer.phone}
          onChangeText={(text) => setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, phone: text }
          }))}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Address (Optional)"
          value={order.customer.address}
          onChangeText={(text) => setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, address: text }
          }))}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        
        {order.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Icon name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Service Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
          />
          
          <TextInput
            style={[styles.input, { flex: 1, marginHorizontal: 10 }]}
            placeholder="Price"
            value={newItem.price}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, price: text }))}
            keyboardType="decimal-pad"
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddItem}
          >
            <Icon name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        
        <Picker
          selectedValue={order.status}
          onValueChange={(value) => setOrder(prev => ({ ...prev, status: value }))}
          style={styles.picker}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
        
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Notes (Optional)"
          value={order.notes}
          onChangeText={(text) => setOrder(prev => ({ ...prev, notes: text }))}
          multiline
        />
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {orderToEdit ? 'Update Order' : 'Save Order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 20,
    color: '#2c3e50'
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3498db',
    fontSize: 16
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemName: {
    flex: 2
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right'
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2c3e50'
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3498db'
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default OrderFormScreen;