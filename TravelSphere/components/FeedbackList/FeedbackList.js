import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firestore } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Update query to use timestamp field for sorting
        const q = query(collection(firestore, 'feedback'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const feedbacks = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        console.log(feedbacks); // Log to check the fetched data
        setFeedbackList(feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error); // Log any error
      }
    };

    fetchFeedback();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Feedback</Text>
      {feedbackList.length === 0 ? (
        <Text>No feedback available</Text>
      ) : (
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackText}>{item.feedback}</Text>
              <Text style={styles.ratingText}>Rating: {item.rating || 'N/A'}</Text>
              <Text style={styles.nameText}>Name: {item.name}</Text>
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
    backgroundColor: '#f7f7f7' // Light gray background
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#4A90E2' // Blue title for emphasis
  },
  noFeedbackText: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center'
  },
  feedbackItem: {
    padding: 15,
    backgroundColor: '#fff', // White background for each feedback item
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3, // For Android shadow effect
    borderLeftWidth: 5, 
    borderLeftColor: '#4A90E2' // Blue left border to highlight the feedback
  },
  userName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' // Dark gray for user name
  },
  feedbackText: { 
    fontSize: 16, 
    marginTop: 5, 
    color: '#555' // Slightly lighter gray for feedback text
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 5 
  },
  ratingText: { 
    fontSize: 14, 
    color: '#555' 
  },
  ratingStars: { 
    fontSize: 18, 
    color: '#FFD700' // Golden yellow for filled stars
  },
  separator: { 
    height: 1, 
    backgroundColor: '#ddd', // Light gray separator
    marginVertical: 10 
  },
});

export default FeedbackList;
