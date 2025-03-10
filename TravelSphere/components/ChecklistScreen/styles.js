// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 16,
//     color: '#000',
//   },
//   addButton: {
//     padding: 10,
//   },
//   listItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   listText: {
//     flex: 1,
//     fontSize: 18,
//     color: '#333',
//   },
//   completedText: {
//     textDecorationLine: 'line-through',
//     color: 'gray',
//   },
//   clearButton: {
//     backgroundColor: '#d9534f',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   clearButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 18,   
//     color: '#888',
//     marginTop: 20,
//   },
// });

// export default styles;


import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  todoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
});

export default styles;
