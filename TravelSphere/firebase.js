// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc 
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA56tuwcbLsDcYYSaXPUrR_FJTlayC_maE',
  authDomain: 'travelsphere-64705.firebaseapp.com',
  projectId: 'travelsphere-64705',
  storageBucket: 'travelsphere-64705.firebasestorage.app',
  messagingSenderId: '610542033934',
  appId: '1:610542033934:web:64da592e3f005260c7705f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

/* =================== Authentication Functions =================== */

const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return { 
      success: true, 
      message: "Account created! A verification email has been sent. Please verify your email before logging in." 
    };
  } catch (error) {
    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Please log in.";
    }
    return { success: false, message: errorMessage };
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (!user) {
      return { success: false, message: "User not found. Please sign up first." };
    }

    if (!user.emailVerified) {
      await signOut(auth);
      return { 
        success: false, 
        message: "Email not verified. Please check your inbox and verify your email before logging in." 
      };
    }

    return { success: true, message: "Logged in successfully!" };
  } catch (error) {
    let errorMessage = error.message;
    if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email. Please sign up.";
    }
    return { success: false, message: errorMessage };
  }
};

const checkAuthStatus = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, message: "Logged out successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/* =================== Firestore Functions (Destination Storage) =================== */

const addDestination = async (name, location, description) => {
  try {
    await addDoc(collection(firestore, 'destinations'), {
      name,
      location,
      description,
      createdAt: new Date(),
    });
    return { success: true, message: 'Destination added successfully!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getDestinations = async () => {
  try {
    const destinationsRef = collection(firestore, 'destinations');
    const destinationsSnapshot = await getDocs(destinationsRef);
    const destinations = destinationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { success: true, destinations };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const searchDestination = async (searchQuery) => {
  try {
    const destinationsRef = collection(firestore, 'destinations');
    const q = query(destinationsRef, where('name', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (results.length === 0) {
      return { success: false, message: 'No destinations found.' };
    }

    return { success: true, results };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const fetchDestinations = async () => {
  try {
    const q = query(collection(firestore, 'popularDestinations'), where('isPopular', '==', true));
    const querySnapshot = await getDocs(q);
    const destinations = querySnapshot.docs.map((doc) => doc.data());
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};

/* =================== Firestore Review Functions =================== */

const addReview = async (destinationName, reviewText, rating, userEmail) => {
  try {
    const ratingNumber = parseInt(rating, 10);
    if (!reviewText.trim() || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return { success: false, message: "Invalid review or rating. Rating must be between 1 and 5." };
    }

    await addDoc(collection(firestore, "reviews"), {
      destinationName,
      text: reviewText,
      rating: ratingNumber,
      createdAt: new Date(),
      userEmail,
    });

    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getReviews = async (destinationName) => {
  try {
    const q = query(
      collection(firestore, "reviews"), 
      where("destinationName", "==", destinationName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { success: true, reviews };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export { 
  auth, 
  firestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDestination, 
  getDestinations, 
  searchDestination, 
  signUpUser, 
  loginUser, 
  checkAuthStatus, 
  logoutUser, 
  fetchDestinations,
  addReview,
  getReviews
};
