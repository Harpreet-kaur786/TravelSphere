import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuek23DPFdQmInmk4QFGdDlR_ITGS2iuA",
  authDomain: "todoapp-11598.firebaseapp.com",
  projectId: "todoapp-11598",
  storageBucket: "todoapp-11598.appspot.com",
  messagingSenderId: "732959130893",
  appId: "1:732959130893:web:145deb10fa95697e1b9c44"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, collection, getDocs, query, where }; // Export necessary functions
