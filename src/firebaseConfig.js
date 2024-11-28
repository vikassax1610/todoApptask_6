// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKzOD9V_RC3q3o0nliHxkI2uZu5dvKXFY",
  authDomain: "todoapp-bfd63.firebaseapp.com",
  databaseURL: "https://todoapp-bfd63-default-rtdb.firebaseio.com",
  projectId: "todoapp-bfd63",
  storageBucket: "todoapp-bfd63.firebasestorage.app",
  messagingSenderId: "275023274489",
  appId: "1:275023274489:web:6fd40e3681d908e9ba5d28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
