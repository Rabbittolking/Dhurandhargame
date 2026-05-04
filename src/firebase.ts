import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAn0dI8lFbIxkwNdCfxw0yxxU0NrFN8AQE",
  authDomain: "dhurandhar-ec0a0.firebaseapp.com",
  databaseURL: "https://dhurandhar-ec0a0-default-rtdb.firebaseio.com",
  projectId: "dhurandhar-ec0a0",
  storageBucket: "dhurandhar-ec0a0.firebasestorage.app",
  messagingSenderId: "675272696469",
  appId: "1:675272696469:web:30146c4982546224c0b19c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signOut = () => firebaseSignOut(auth);

export { onAuthStateChanged, type User };
