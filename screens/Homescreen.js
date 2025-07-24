import React, { useContext, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView,
  Platform, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';

export default function HomeScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [clothingItems, setClothingItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Suit', value: 'suit', price: 15.99 },
    { label: 'Trouser', value: 'trouser', price: 8.99 },
    { label: 'Shirt', value: 'shirt', price: 7.99 },
    { label: 'Tie', value: 'tie', price: 5.99 },
    { label: 'Dress', value: 'dress', price: 12.99 },
    { label: 'Skirt', value: 'skirt', price: 9.99 },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerSaved, setCustomerSaved] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(true);

  const handleAddClothing = (itemValue) => {
    if (!itemValue) return;
    if (!customerSaved) {
      Alert.alert('Customer Required', 'Please save customer details first');
      setValue(null);
      return;
    }
    
    const selectedItem = items.find(item => item.value === itemValue);
    if (selectedItem) {
      setClothingItems(prev => [...prev, {
        id: Date.now().toString(),
        name: selectedItem.label,
        type: selectedItem.value,
        price: selectedItem.price,
        status: 'pending'
      }]);
      setValue(null);
    }
  };

  const handleRemoveItem = (id) => {
    setClothingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveCustomer = () => {
    if (!customerName.trim()) {
      Alert.alert('Validation Error', 'Please enter customer name');
      return;
    }
    setCustomerSaved(true);
    setShowCustomerForm(false);
  };

  const handleEditCustomer = () => {
    setCustomerSaved(false);
    setShowCustomerForm(true);
  };

  const handleLogout = async () => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert('Error', 'Logout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
        <Icon name="times" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Prefferred Laundry</Text>
      <Text style={styles.subtitle}>Add your clothing items</Text>

      {showCustomerForm ? (
        <View style={styles.customerForm}>
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
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCustomer}
          >
            <Text style={styles.saveButtonText}>Save Customer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.customerInfo}>
          <View style={styles.customerHeader}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <TouchableOpacity onPress={handleEditCustomer}>
              <Icon name="edit" size={18} color="#3498db" />
            </TouchableOpacity>
          </View>
          <Text style={styles.customerText}>{customerName}</Text>
          {customerPhone && <Text style={styles.customerPhone}>{customerPhone}</Text>}
        </View>
      )}

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          onChangeValue={handleAddClothing}
          setItems={setItems}
          placeholder="Select clothing type"
          listMode="MODAL"
          modalProps={{
            animationType: 'slide'
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          searchable={true}
          searchPlaceholder="Search clothing..."
          disabled={!customerSaved}
        />
      </View>

      {clothingItems.length > 0 ? (
        <FlatList
          data={clothingItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>No items added yet</Text>
      )}

      {clothingItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total: ${clothingItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.logoutButton, isProcessing && styles.disabledButton]}
        onPress={handleLogout}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={styles.buttonContent}>
            <Icon name="sign-out" size={18} color="white" />
            <Text style={styles.buttonText}> Logout</Text>
          </View>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#231942'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#231942',
    marginBottom: 10,
  },
  customerForm: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  customerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontSize: 16,
  },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#231942',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});