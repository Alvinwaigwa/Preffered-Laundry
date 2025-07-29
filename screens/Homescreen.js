import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';

export default function HomeScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({
    customer: null,
    items: [],
    date: new Date().toISOString()
  });
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
  const [customers, setCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'view'
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleCustomers = [
      { id: '1', name: 'John Doe', phone: '555-1234' },
      { id: '2', name: 'Jane Smith', phone: '555-5678' }
    ];
    const sampleOrders = [
      {
        id: '1',
        customer: sampleCustomers[0],
        items: [
          { id: '1', name: 'Shirt', price: 7.99, quantity: 2 },
          { id: '2', name: 'Trouser', price: 8.99, quantity: 1 }
        ],
        date: '2023-05-15',
        status: 'completed'
      },
      {
        id: '2',
        customer: sampleCustomers[1],
        items: [
          { id: '3', name: 'Dress', price: 12.99, quantity: 1 }
        ],
        date: '2023-05-16',
        status: 'pending'
      }
    ];
    setCustomers(sampleCustomers);
    setOrders(sampleOrders);
  }, []);

  const handleAddClothing = (itemValue) => {
    if (!itemValue) return;
    if (!currentOrder.customer) {
      Alert.alert('Customer Required', 'Please select or create a customer first');
      setValue(null);
      return;
    }
    
    const selectedItem = items.find(item => item.value === itemValue);
    if (selectedItem) {
      setCurrentOrder(prev => ({
        ...prev,
        items: [...prev.items, {
          id: Date.now().toString(),
          name: selectedItem.label,
          type: selectedItem.value,
          price: selectedItem.price,
          quantity: 1,
          status: 'pending'
        }]
      }));
      setValue(null);
    }
  };

  const handleRemoveItem = (id) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSaveCustomer = () => {
    if (!customerName.trim()) {
      Alert.alert('Validation Error', 'Please enter customer name');
      return;
    }

    const newCustomer = {
      id: Date.now().toString(),
      name: customerName,
      phone: customerPhone,
    };

    setCustomers(prev => [...prev, newCustomer]);
    setCurrentOrder(prev => ({ ...prev, customer: newCustomer }));
    setShowCustomerForm(false);
    resetCustomerForm();
  };

  const resetCustomerForm = () => {
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleNewOrder = () => {
    setCurrentOrder({
      customer: null,
      items: [],
      date: new Date().toISOString()
    });
    setShowCustomerForm(true);
    setViewMode('create');
    setSelectedOrderId(null);
  };

  const handleSelectCustomer = (customer) => {
    setCurrentOrder(prev => ({ ...prev, customer }));
    setShowCustomerDropdown(false);
  };

  const handleSaveOrder = () => {
    if (!currentOrder.customer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }
    if (currentOrder.items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    const newOrder = {
      id: selectedOrderId || Date.now().toString(),
      customer: currentOrder.customer,
      items: currentOrder.items,
      date: currentOrder.date,
      status: 'pending'
    };

    if (selectedOrderId) {
      // Update existing order
      setOrders(prev => prev.map(order => 
        order.id === selectedOrderId ? newOrder : order
      ));
    } else {
      // Add new order
      setOrders(prev => [...prev, newOrder]);
    }

    Alert.alert('Success', `Order ${selectedOrderId ? 'updated' : 'saved'} successfully`);
    setViewMode('view');
  };

  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setSelectedOrderId(order.id);
    setViewMode('create');
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

  const renderOrderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemText}>{item.name} × {item.quantity}</Text>
        <Text style={styles.priceText}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      {viewMode === 'create' && (
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
          <Icon name="times" size={20} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => handleViewOrder(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderCustomer}>{item.customer.name}</Text>
        <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.orderStatus}>{item.status}</Text>
      <Text style={styles.orderTotal}>
        Total: ${item.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Prefferred Laundry</Text>
      
      {viewMode === 'view' ? (
        <>
          <Text style={styles.subtitle}>Your Orders</Text>
          <FlatList
            data={orders}
            renderItem={renderOrderCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.ordersList}
          />
          <TouchableOpacity
            style={styles.newOrderButton}
            onPress={handleNewOrder}
          >
            <Text style={styles.newOrderButtonText}>+ New Order</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            {selectedOrderId ? 'Edit Order' : 'Create New Order'}
          </Text>
          
          <ScrollView style={styles.scrollContainer}>
            {!showCustomerForm ? (
              <View style={styles.customerSection}>
                <View style={styles.customerHeader}>
                  <Text style={styles.sectionTitle}>Customer</Text>
                  <View style={styles.customerActions}>
                    <TouchableOpacity 
                      style={styles.smallButton}
                      onPress={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    >
                      <Text style={styles.smallButtonText}>Change</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.smallButton}
                      onPress={() => {
                        setShowCustomerForm(true);
                        resetCustomerForm();
                      }}
                    >
                      <Text style={styles.smallButtonText}>New</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {currentOrder.customer && (
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerText}>
                      {currentOrder.customer.name}
                    </Text>
                    {currentOrder.customer.phone && (
                      <Text style={styles.customerPhone}>
                        {currentOrder.customer.phone}
                      </Text>
                    )}
                  </View>
                )}

                {showCustomerDropdown && (
                  <View style={styles.customerDropdown}>
                    <FlatList
                      data={customers}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={styles.customerOption}
                          onPress={() => handleSelectCustomer(item)}
                        >
                          <Text>{item.name}</Text>
                          {item.phone && <Text style={styles.customerPhoneSmall}>{item.phone}</Text>}
                        </TouchableOpacity>
                      )}
                      ListFooterComponent={
                        <TouchableOpacity 
                          style={styles.customerOption}
                          onPress={() => {
                            setShowCustomerForm(true);
                            setShowCustomerDropdown(false);
                          }}
                        >
                          <Text style={styles.newCustomerText}>+ New Customer</Text>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                )}
              </View>
            ) : (
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
                <View style={styles.buttonRow}>
                  {customers.length > 0 && (
                    <TouchableOpacity
                      style={[styles.secondaryButton, { marginRight: 10 }]}
                      onPress={() => {
                        setShowCustomerForm(false);
                        resetCustomerForm();
                      }}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveCustomer}
                  >
                    <Text style={styles.saveButtonText}>Save Customer</Text>
                  </TouchableOpacity>
                </View>
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
                disabled={!currentOrder.customer}
              />
            </View>

            {currentOrder.items.length > 0 ? (
              <FlatList
                data={currentOrder.items}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <Text style={styles.emptyText}>
                {currentOrder.customer ? 'No items added yet' : 'Select or create a customer to add items'}
              </Text>
            )}

            {currentOrder.items.length > 0 && (
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  Total: ${currentOrder.items
                    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    .toFixed(2)}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setViewMode('view')}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveOrderButton]}
              onPress={handleSaveOrder}
            >
              <Text style={styles.actionButtonText}>
                {selectedOrderId ? 'Update Order' : 'Save Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  scrollContainer: {
    flex: 1,
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
  customerSection: {
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
  customerActions: {
    flexDirection: 'row',
  },
  smallButton: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  smallButtonText: {
    color: '#3498db',
    fontSize: 14,
  },
  customerInfo: {
    marginTop: 10,
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
  customerDropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerPhoneSmall: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  newCustomerText: {
    color: '#3498db',
    fontWeight: 'bold',
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
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: 'bold',
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
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  saveOrderButton: {
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    fontWeight: 'bold',
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
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#231942',
  },
  newOrderButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  newOrderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});