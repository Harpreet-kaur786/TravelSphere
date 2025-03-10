import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const ChecklistScreen = () => {
  const [checklist, setChecklist] = useState([]);
  const [todoLists, setTodoLists] = useState({});
  const [newTodo, setNewTodo] = useState({});

  useEffect(() => {
    loadChecklist();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadChecklist();
    }, [])
  );

  const loadChecklist = async () => {
    try {
      const storedChecklist = await AsyncStorage.getItem('checklist');
      const storedTodos = await AsyncStorage.getItem('todoLists');

      if (storedChecklist) setChecklist(JSON.parse(storedChecklist));
      if (storedTodos) setTodoLists(JSON.parse(storedTodos));
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };

  const removeItem = async (item) => {
    try {
      const updatedChecklist = checklist.filter(chk => chk.name !== item.name);
      setChecklist(updatedChecklist);
      await AsyncStorage.setItem('checklist', JSON.stringify(updatedChecklist));

      let favs = await AsyncStorage.getItem('favourites');
      let favArray = favs ? JSON.parse(favs) : [];
      const updatedFavourites = favArray.filter(fav => fav.name !== item.name);
      await AsyncStorage.setItem('favourites', JSON.stringify(updatedFavourites));

      const updatedTodos = { ...todoLists };
      delete updatedTodos[item.name];
      setTodoLists(updatedTodos);
      await AsyncStorage.setItem('todoLists', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addTodo = async (destination) => {
    if (!newTodo[destination]) return;
    const updatedTodos = { ...todoLists };
    if (!updatedTodos[destination]) updatedTodos[destination] = [];

    updatedTodos[destination].push(newTodo[destination]);
    setTodoLists(updatedTodos);
    await AsyncStorage.setItem('todoLists', JSON.stringify(updatedTodos));

    setNewTodo({ ...newTodo, [destination]: '' });
  };

  const removeTodo = async (destination, index) => {
    const updatedTodos = { ...todoLists };
    updatedTodos[destination].splice(index, 1);

    setTodoLists(updatedTodos);
    await AsyncStorage.setItem('todoLists', JSON.stringify(updatedTodos));
  };

  const updateTodo = async (destination, index, text) => {
    const updatedTodos = { ...todoLists };
    updatedTodos[destination][index] = text;

    setTodoLists(updatedTodos);
    await AsyncStorage.setItem('todoLists', JSON.stringify(updatedTodos));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Checklist</Text>
      <FlatList
        data={checklist}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cityName}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeItem(item)}>
                <AntDesign name="closecircle" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {/* Add Task Input (Always on Top) */}
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.todoInput}
                placeholder="New Task..."
                value={newTodo[item.name] || ''}
                onChangeText={(text) => setNewTodo({ ...newTodo, [item.name]: text })}
              />
              <TouchableOpacity onPress={() => addTodo(item.name)}>
                <AntDesign name="pluscircle" size={24} color="green" />
              </TouchableOpacity>
            </View>

            {/* ScrollView for To-Do List (Scrolls Down) */}
            <ScrollView style={styles.todoList}>
              {todoLists[item.name] &&
                todoLists[item.name].map((todo, index) => (
                  <View key={index} style={styles.todoItem}>
                    <TextInput
                      style={styles.todoText}
                      value={todo}
                      onChangeText={(text) => updateTodo(item.name, index, text)}
                    />
                    <TouchableOpacity onPress={() => removeTodo(item.name, index)}>
                      <AntDesign name="closecircle" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todoList: {
    maxHeight: 200, // Allows vertical scrolling
    marginTop: 10, // Space between Add Task and list
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5, // Stack items vertically
  },
  todoText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
    flex: 1,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 5,
  },
  todoInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});

export default ChecklistScreen;