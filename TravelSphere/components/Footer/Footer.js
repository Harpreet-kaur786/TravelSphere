import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2025 TravelSphere. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default Footer;
