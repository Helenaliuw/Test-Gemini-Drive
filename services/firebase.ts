// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, deleteDoc, updateDoc, query, orderBy, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, getBytes } from "firebase/storage";
import { 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6x4TJzTPH9mSyYfqngRd0J28dDxzBEUY",
  authDomain: "gemini-drive-41d11.firebaseapp.com",
  projectId: "gemini-drive-41d11",
  storageBucket: "gemini-drive-41d11.firebasestorage.app",
  messagingSenderId: "90763919099",
  appId: "1:90763919099:web:b7d1a3e41e313742db7a5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup,
    type User,
    // Firestore
    doc,
    setDoc,
    onSnapshot,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    collection,
    // Storage
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    getBytes,
};