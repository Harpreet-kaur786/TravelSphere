import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';

const ChecklistScreen = () => {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      const storedChecklist = await AsyncStorage.getItem('checklist');
      if (storedChecklist) {
        setChecklist(JSON.parse(storedChecklist));
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };

  const removeItem = async (item) => {
    const updatedChecklist = checklist.filter(chk => chk.name !== item.name);
    setChecklist(updatedChecklist);
    await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Checklist</Text>
      <FlatList
        data={checklist}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeItem(item)}>
              <AntDesign name="closecircle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ChecklistScreen;