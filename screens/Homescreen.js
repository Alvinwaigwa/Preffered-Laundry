import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Picker } from '@react-native-picker/picker';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';

export default function HomeScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (error) {
        Alert.alert('Error', 'Failed to load orders');
      }
    };

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    loadOrders();
    return () => unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Failed to save orders', error);
      }
    };
    saveOrders();
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  const renderMetricCard = (value, label, iconName) => (
    <View style={styles.metricCard}>
      <Icon name={iconName} size={20} color="#3498db" />
      <Text style={styles.metricValue}>
        {typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Laundry Dashboard</Text>
      
      <View style={styles.metricsRow}>
        {renderMetricCard(metrics.totalOrders, 'Total Orders', 'list-ol')}
        {renderMetricCard(metrics.pendingOrders, 'Pending', 'hourglass-half')}
        {renderMetricCard(metrics.revenue, 'Revenue', 'money')}
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={filterStatus}
          style={styles.statusPicker}
          onValueChange={setFilterStatus}>
          <Picker.Item label="All Orders" value="all" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
      </View>

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.customerName}>{item.customer?.name}</Text>
                <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
              </View>
              <View style={styles.orderFooter}>
                <Text style={[
                  styles.orderStatus,
                  { 
                    color: item.status === 'completed' ? '#2ecc71' : 
                          item.status === 'in_progress' ? '#3498db' : '#e67e22' 
                  }
                ]}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="archive" size={50} color="#bdc3c7" />
          <Text style={styles.emptyText}>No orders found</Text>
          <TouchableOpacity
            style={styles.newOrderButtonSmall}
            onPress={() => navigation.navigate('OrderForm', {
              onSaveOrder: (newOrder) => {
                setOrders(prevOrders => [...prevOrders, newOrder]);
              }
            })}
          >
            <Text style={styles.newOrderButtonText}>Create New Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredOrders.length > 0 && (
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => navigation.navigate('OrderForm', {
            onSaveOrder: (newOrder) => {
              setOrders(prevOrders => [...prevOrders, newOrder]);
            }
          })}
        >
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.newOrderButtonText}>New Order</Text>
        </TouchableOpacity>
      )}

      {isOffline && (
        <View style={styles.offlineBar}>
          <Icon name="wifi" size={16} color="white" />
          <Text style={styles.offlineText}>Offline Mode - Changes will sync when online</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // your existing styles...
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center'
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#2c3e50'
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d'
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 15
  },
  searchInput: {
    flex: 2,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  statusPicker: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50'
  },
  orderTotal: {
    fontWeight: 'bold',
    color: '#3498db',
    fontSize: 16
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderStatus: {
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  orderDate: {
    color: '#95a5a6',
    fontSize: 12
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    marginTop: 10,
    color: '#bdc3c7',
    fontSize: 16
  },
  newOrderButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10
  },
  newOrderButtonSmall: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 15
  },
  newOrderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10
  },
  offlineBar: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginTop: 10
  },
  offlineText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12
  }
});
