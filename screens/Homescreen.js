import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Picker } from '@react-native-picker/picker';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Button, FlatList,
  KeyboardAvoidingView,
  Platform, RefreshControl, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../App';

export default function Homescreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [prevMetrics, setPrevMetrics] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        
        if (!prevMetrics && parsedOrders.length > 0) {
          const initialMetrics = {
            totalOrders: parsedOrders.length,
            pendingOrders: parsedOrders.filter(o => o.status === 'pending').length,
            revenue: parsedOrders.reduce((sum, order) => sum + order.total, 0)
          };
          setPrevMetrics(initialMetrics);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrders = async (ordersToSave) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Failed to save orders', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleDeleteOrder = (id) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedOrders = orders.filter(order => order.id !== id);
            setOrders(updatedOrders);
            saveOrders(updatedOrders);
          }
        }
      ]
    );
  };

  const handleBulkStatusUpdate = (status) => {
    const updatedOrders = orders.map(order => ({
      ...order,
      status: status
    }));
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    loadOrders();
    return () => unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      saveOrders(orders);
      
      const currentMetrics = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        revenue: orders.reduce((sum, order) => sum + order.total, 0)
      };
      setPrevMetrics(currentMetrics);
    }
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
      {prevMetrics && (
        <Text style={[
          styles.metricChange,
          { 
            color: value > prevMetrics[label.toLowerCase().replace(' ', '')] ? '#2ecc71' : 
                  value < prevMetrics[label.toLowerCase().replace(' ', '')] ? '#e74c3c' : '#95a5a6'
          }
        ]}>
          {Math.round(
            ((value - prevMetrics[label.toLowerCase().replace(' ', '')]) / 
             prevMetrics[label.toLowerCase().replace(' ', '')]) * 100
          )}%
        </Text>
      )}
    </View>
  );

  const renderRightActions = (id) => (
    <View style={styles.rightActions}>
      <TouchableOpacity 
        style={styles.editAction}
        onPress={() => navigation.navigate('OrderForm', {
          orderToEdit: orders.find(o => o.id === id),
          onSaveOrder: (updatedOrder) => {
            setOrders(prev => prev.map(o => 
              o.id === updatedOrder.id ? updatedOrder : o
            ));
          }
        })}
      >
        <Icon name="pencil" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={() => handleDeleteOrder(id)}
      >
        <Icon name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.metricsRow}>
        {renderMetricCard(metrics.totalOrders, 'Total Orders', 'list-ol')}
        {renderMetricCard(metrics.pendingOrders, 'Pending', 'hourglass-half')}
        {renderMetricCard(metrics.revenue, 'Revenue', 'money')}
      </View>

      <View style={styles.bulkActions}>
        <Text style={styles.bulkActionTitle}>Bulk Update:</Text>
        <TouchableOpacity 
          style={styles.bulkActionButton}
          onPress={() => handleBulkStatusUpdate('pending')}
        >
          <Text style={styles.bulkActionText}>Mark All Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bulkActionButton}
          onPress={() => handleBulkStatusUpdate('completed')}
        >
          <Text style={styles.bulkActionText}>Mark All Completed</Text>
        </TouchableOpacity>
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

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id)}
              overshootRight={false}
            >
              <TouchableOpacity 
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', { 
                  order: item,
                  onStatusUpdate: (updatedOrder) => {
                    setOrders(prev => prev.map(o => 
                      o.id === updatedOrder.id ? updatedOrder : o
                    ));
                  },
                  onSaveOrder: (updatedOrder) => {
                    setOrders(prev => prev.map(o => 
                      o.id === updatedOrder.id ? updatedOrder : o
                    ));
                  }
                })}
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
            </Swipeable>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3498db']}
              tintColor={'#3498db'}
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="archive" size={50} color="#bdc3c7" />
          <Text style={styles.emptyText}>
            {searchQuery || filterStatus !== 'all' 
              ? 'No matching orders found' 
              : 'No orders yet'}
          </Text>
          {(searchQuery || filterStatus !== 'all') ? (
            <Button 
              title="Clear Filters" 
              onPress={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }} 
              color="#3498db"
            />
          ) : null}
          <TouchableOpacity
            style={styles.newOrderButtonSmall}
            onPress={() => navigation.navigate('OrderForm', {
              onSaveOrder: (newOrder) => {
                setOrders(prev => [...prev, newOrder]);
              }
            })}
          >
            <Text style={styles.newOrderButtonText}>Create First Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredOrders.length > 0 && (
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => navigation.navigate('OrderForm', {
            onSaveOrder: (newOrder) => {
              setOrders(prev => [...prev, newOrder]);
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
  metricChange: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  bulkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  bulkActionTitle: {
    marginRight: 10,
    color: '#7f8c8d'
  },
  bulkActionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5
  },
  bulkActionText: {
    fontSize: 12,
    color: '#2c3e50'
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
  rightActions: {
    flexDirection: 'row',
    width: 120,
    marginBottom: 10
  },
  editAction: {
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15
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
    borderRadius: 5
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
  },
  loader: {
    marginTop: 50
  }
});