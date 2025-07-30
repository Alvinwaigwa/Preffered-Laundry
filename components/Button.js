import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Button = ({ title, onPress, icon, color = '#3498db' }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon && <Icon name={icon} size={16} color="white" style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 120
  },
  icon: {
    marginRight: 8
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default Button;