// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref,set} from "firebase/database";
import { get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";


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


//This is how you can add data to the database from scratch, we will have a more complex function
//for making the study group but the ideal will be the same
//This is just a test, REMOVE
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


//Function currently being used for the user email component
function getUserName() {
  const user = getAuth().currentUser;
  if (user) {
    return user.displayName || "No display name set";
  } else {
    return "No user signed in";
  }
}


// Funciton for adding study group data to database
// Not sure how to deal with unique idenifyers yet
function addStudyGroupData(groupId, data) {
  const groupRef = ref(db, 'studyGroups/' + groupId);
  return set(groupRef, data)
    .then(() => {
      console.log("Study group data added successfully");
    })
    .catch((error) => {
      console.error("Error adding study group data:", error);
    });
}

let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

//const reference = ref(db, 'users/'=userId);
export { app, analytics, auth, db,pingBackend,addData,getUserName,addStudyGroupData};

