import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTa2pRwYR3WCrvUWq2qjOuIOBFY0YYa0Q",
  authDomain: "fir-pinia-3f810.firebaseapp.com",
  projectId: "fir-pinia-3f810",
  storageBucket: "fir-pinia-3f810.firebasestorage.app",
  messagingSenderId: "58183537250",
  appId: "1:58183537250:web:c8fae71669846847d7f73b"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };