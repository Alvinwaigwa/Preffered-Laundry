import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const updateStatus = (newStatus) => {
    Alert.alert(
      'Confirm Status Change',
      `Change status to ${newStatus}?`,
      [
        { text: 'Cancel' },
        { 
          text: 'Confirm',
          onPress: () => {
            if (route.params?.onStatusUpdate) {
              route.params.onStatusUpdate({ ...order, status: newStatus });
            }
            navigation.goBack();
          }
        }
      ]
    );
  };

  const printReceipt = () => {
    Alert.alert('Print Receipt', 'Receipt sent to printer');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
        <Text style={[
          styles.statusBadge,
          { 
            backgroundColor: 
              order.status === 'completed' ? '#2ecc71' :
              order.status === 'in_progress' ? '#3498db' : '#f39c12'
          }
        ]}>
          {order.status.replace('_', ' ').toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <Text style={styles.detailText}>{order.customer?.name}</Text>
        <Text style={styles.detailText}>{order.customer?.phone}</Text>
        {order.customer?.address && (
          <Text style={styles.detailText}>{order.customer.address}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text style={styles.serviceName}>
              {item.quantity}x {item.name}
            </Text>
            <Text style={styles.servicePrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      {order.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.detailText}>{order.notes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Date</Text>
        <Text style={styles.detailText}>
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <Button 
          icon="print" 
          title="Print Receipt" 
          color="#9b59b6"
          onPress={printReceipt} 
        />
        <Button 
          icon="pencil" 
          title="Edit Order" 
          onPress={() => navigation.navigate('OrderForm', { 
            orderToEdit: order,
            onSaveOrder: route.params?.onSaveOrder
          })}
        />
        <Button 
          icon="check" 
          title="Mark Completed" 
          color="#2ecc71"
          onPress={() => updateStatus('completed')} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498db',
    fontSize: 16
  },
  detailText: {
    marginBottom: 5,
    color: '#34495e'
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  serviceName: {
    flex: 2
  },
  servicePrice: {
    flex: 1,
    textAlign: 'right'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  totalLabel: {
    fontWeight: 'bold'
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap'
  }
});

export default OrderDetailScreen;