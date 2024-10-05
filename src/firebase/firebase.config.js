// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3qGqQwjxo2uhDJb26FnYoaoVjHWYCMt8",
  authDomain: "smart-original-brand.firebaseapp.com",
  projectId: "smart-original-brand",
  storageBucket: "smart-original-brand.appspot.com",
  messagingSenderId: "489091082890",
  appId: "1:489091082890:web:e5ae4b5021de2d88305b73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

export { auth, storage }; // Export storage
