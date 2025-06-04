// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUxVvKTwiTWDe1PyDgjjworCGZgK5smSU",
  authDomain: "rellgov-fc4e2.firebaseapp.com",
  projectId: "rellgov-fc4e2",
  storageBucket: "rellgov-fc4e2.firebasestorage.app",
  messagingSenderId: "191853036789",
  appId: "1:191853036789:web:ac8d61084a17804ce2b1bc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db};