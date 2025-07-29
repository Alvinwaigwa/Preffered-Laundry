import React, { useState } from 'react';
import {
    Alert, FlatList, StyleSheet, Text,
    TextInput,
    TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderFormScreen = ({ navigation, route }) => {
  const { onSaveOrder } = route.params || {};
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Dropdown state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [itemsDropdown, setItemsDropdown] = useState([
    { label: 'Suit - $15.99', value: 'suit', price: 15.99 },
    { label: 'Trouser - $8.99', value: 'trouser', price: 8.99 },
    { label: 'Shirt - $7.99', value: 'shirt', price: 7.99 },
    { label: 'Dress - $12.99', value: 'dress', price: 12.99 },
    { label: 'Jacket - $10.99', value: 'jacket', price: 10.99 },
  ]);

  const handleAddItem = (itemValue) => {
    if (!itemValue) return;
    
    const selectedItem = itemsDropdown.find(item => item.value === itemValue);
    if (selectedItem) {
      setItems(prev => [...prev, {
        id: Date.now().toString(),
        name: selectedItem.label.split(' - ')[0],
        price: selectedItem.price,
        quantity: 1
      }]);
      setValue(null); // Reset dropdown
    }
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: {
        name: customerName,
        phone: customerPhone
      },
      items,
      specialInstructions,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (onSaveOrder) {
      onSaveOrder(newOrder);
    }
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Laundry Order</Text>
      
      <Text style={styles.sectionTitle}>Customer Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={customerPhone}
        onChangeText={setCustomerPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Items</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={itemsDropdown}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItemsDropdown}
        onChangeValue={handleAddItem}
        placeholder="Select an item"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>${item.price.toFixed(2)} × {item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Icon name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items added yet</Text>
        }
      />

      <Text style={styles.sectionTitle}>Special Instructions</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any special requirements?"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        multiline
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#3498db'
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    marginBottom: 15
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: '#ddd'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  itemName: {
    fontWeight: '500'
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    marginVertical: 15
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'flex-end'
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default OrderFormScreen;