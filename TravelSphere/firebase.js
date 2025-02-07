import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD23yBu4fTj5FXQO-msY2LWmjgCIntVy2Y",
  authDomain: "travelsphere-2266b.firebaseapp.com",
  projectId: "travelsphere-2266b",
  storageBucket: "travelsphere-2266b.firebasestorage.app",
  messagingSenderId: "736800148391",
  appId: "1:736800148391:web:e730ef2083fd3b9bf48482"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, collection, getDocs, query, where }; // Export necessary functions