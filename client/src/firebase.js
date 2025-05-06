// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHRw0E0QyJdCKg3x6110qcCv6CN0aSpm0",
  authDomain: "clsf-100903.firebaseapp.com",
  projectId: "clsf-100903",
  storageBucket: "clsf-100903.firebasestorage.com",
  messagingSenderId: "771126443973",
  appId: "1:771126443973:web:65bb6d3e4a5205336a15ac",
  measurementId: "G-S72EE3YEDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}


export { app, analytics, auth };

