import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuek23DPFdQmInmk4QFGdDlR_ITGS2iuA",
  authDomain: "todoapp-11598.firebaseapp.com",
  projectId: "todoapp-11598",
  storageBucket: "todoapp-11598.appspot.com",
  messagingSenderId: "732959130893",
  appId: "1:732959130893:web:145deb10fa95697e1b9c44",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

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

export { firestore, auth, signUpUser, loginUser, checkAuthStatus, logoutUser };
