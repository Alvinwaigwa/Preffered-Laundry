import React from 'react'; 
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
 
export default function ImageViewer({ placeholderImageSource }) {
  return (
    <Image source={placeholderImageSource} style={styles.image} />
  );
}

// Prop validation
ImageViewer.propTypes = {
  placeholderImageSource: PropTypes.oneOfType([
    PropTypes.number, // For static images (e.g., require('...'))
    PropTypes.shape({ uri: PropTypes.string }), // For remote images
  ]).isRequired,
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 400,
    borderRadius: 5,
  },
});
 
