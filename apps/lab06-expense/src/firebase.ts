import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNxJJ7DKGHyhPvZVN3Ee66sTku4zsWM4w",
  authDomain: "supermin-c2650.firebaseapp.com",
  projectId: "supermin-c2650",
  storageBucket: "supermin-c2650.firebasestorage.app",
  messagingSenderId: "830889173528",
  appId: "1:830889173528:web:db28ec1f635cceff90196d",
//   measurementId: "G-6RNF4SYPXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ สร้าง Firestore
export const db = getFirestore(app);
