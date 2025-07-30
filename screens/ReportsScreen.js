import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);

  const getStatusData = () => {
    const statusCount = {
      pending: 0,
      in_progress: 0,
      completed: 0
    };
    
    orders.forEach(order => {
      statusCount[order.status]++;
    });
    
    return {
      labels: ['Pending', 'In Progress', 'Completed'],
      data: Object.values(statusCount),
      colors: ['#F39C12', '#3498DB', '#2ECC71'],
    };
  };

  const getRevenueData = () => {
    const revenueByDay = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      revenueByDay[date] = (revenueByDay[date] || 0) + order.total;
    });
    
    return {
      labels: Object.keys(revenueByDay),
      datasets: [{
        data: Object.values(revenueByDay)
      }]
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      
      {!loading && orders.length > 0 ? (
        <>
          <Text style={styles.chartTitle}>Order Status Distribution</Text>
          <PieChart
            data={getStatusData().labels.map((label, index) => ({
              name: label,
              population: getStatusData().data[index],
              color: getStatusData().colors[index],
              legendFontColor: '#7F7F7F',
              legendFontSize: 15
            }))}
            width={screenWidth - 30}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          
          <Text style={styles.chartTitle}>Daily Revenue</Text>
          <BarChart
            data={getRevenueData()}
            width={screenWidth - 30}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Orders</Text>
              <Text style={styles.summaryValue}>{orders.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={styles.summaryValue}>
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {loading ? 'Loading...' : 'No orders data available'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#34495e'
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    elevation: 2
  },
  summaryLabel: {
    color: '#7f8c8d',
    fontSize: 14
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    color: '#bdc3c7',
    fontSize: 16
  }
});

export default ReportsScreen;