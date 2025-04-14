import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../../firebase';
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'feedback'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const feedbacks = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setFeedbackList(feedbacks);
    }, (error) => {
      console.error('Error fetching feedbacks:', error);
    });

    return () => unsubscribe();
  }, []);

  // Delete feedback function
  const deleteFeedback = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this feedback?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'feedback', id));
              console.log('Feedback deleted with ID:', id);
            } catch (error) {
              console.error('Error deleting feedback:', error);
              Alert.alert('Error', 'Could not delete feedback. Please try again.');
            }
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Feedback</Text>
      {feedbackList.length === 0 ? (
        <Text style={styles.noFeedbackText}>No feedback available</Text>
      ) : (
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackText}>{item.feedback}</Text>
              <Text style={styles.ratingText}>Rating: {item.rating || 'N/A'}</Text>
              <Text style={styles.nameText}>Name: {item.name}</Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFeedback(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f7f7f7'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#4A90E2'
  },
  noFeedbackText: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center'
  },
  feedbackItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5, 
    borderLeftColor: '#4A90E2'
  },
  feedbackText: { 
    fontSize: 16, 
    marginTop: 5, 
    color: '#555'
  },
  ratingText: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 5 
  },
  nameText: { 
    fontSize: 14, 
    fontStyle: 'italic', 
    color: '#777', 
    marginTop: 5
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF4C4C',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FeedbackList;
