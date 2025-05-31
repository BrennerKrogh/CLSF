// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref,set} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCHRw0E0QyJdCKg3x6110qcCv6CN0aSpm0",
  authDomain: "clsf-100903.firebaseapp.com",
  projectId: "clsf-100903",
  databaseURL: "https://clsf-100903-default-rtdb.firebaseio.com",
  storageBucket: "clsf-100903.firebasestorage.com",
  messagingSenderId: "771126443973",
  appId: "1:771126443973:web:65bb6d3e4a5205336a15ac",
  measurementId: "G-S72EE3YEDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const db = getFirestore(app);
const db = getDatabase(app);

console.log("Firebase initialized successfully");
function setUserData(userId, data) {
  const userRef = ref(db, 'users/' + userId);
  return set(userRef, data);
}

setUserData("testUser", {
  name: "Random User",
  age: Math.floor(Math.random() * 100),
  email: "randomuser@example.com"
});


//This is how you can add data to the database from scratch, we will have a more complex function
//for making the study group but the ideal will be the same
function addData(userId, data) {
  const userRef = ref(db, 'users/' + userId);
  return set(userRef, data)
    .then(() => {
      console.log("Data added successfully");
    })
    .catch((error) => {
      console.error("Error adding data:", error);
    });
}

//just a function for making sure the backend works
function pingBackend() {
  console.log("Pinging backend...");
  const testRef = ref(db, 'ping');
  set(testRef, { timestamp: Date.now() })
    .then(() => {
      console.log("Ping successful");
    })
    .catch((error) => {
      console.error("Ping failed:", error);
    });
}


let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

//const reference = ref(db, 'users/'=userId);
export { app, analytics, auth, db,pingBackend,addData};

