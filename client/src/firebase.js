// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { getDatabase, ref,set} from "firebase/database";
import { get } from "firebase/database";
//import { onAuthStateChanged } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";


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


// Just a function for making sure the backend works
// Also a place to put some extra testing calls 
function pingBackend() {
  const user = getAuth().currentUser;
  if (user) {
    console.log("Email:", user.email);
  } else {
    console.log("No user signed in");
  }
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
  // Add username to data so group has creator in find groups tab

  const user = getAuth().currentUser;
  const userEmail = user.email;
  //const username = user ? user.displayName || "Anonymous" : "No user signed in";
  
  const groupRef = ref(db, 'studyGroups/' + groupId);
  const updatedData = { ...data, creator: userEmail };

  return set(groupRef, updatedData)
    .then(() => {
      console.log("Study group data added successfully");
    })
    .catch((error) => {
      console.error("Error adding study group data:", error);
    });
}

// Function to fetch group data, group list component needs to algorithmically call this
function fetchGroupData(groupId) {
  const groupRef = ref(db, 'studyGroups/' + groupId);
  return get(groupRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available for this group");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching group data:", error);
    });
}

function fetchAllGroups() {
  const groupsRef = ref(db, 'studyGroups/');
  return get(groupsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      return Object.entries(data).map(([id, group]) => ({id, ...group}));
    } else {
      console.log('No groups found');
      return [];
    }
  }).catch((error) => {
    console.error('Error fetching groups:', error);
    return [];
  })
}

function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
    });
}

function saveUserProfile(uid, profileData) {
  const profileRef = ref(db, `users/${uid}/profile`);
  return set(profileRef, profileData);
}

function loadUserProfile(uid) {
  const profileRef = ref(db, `users/${uid}/profile`);
  return get(profileRef).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
}

let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

//const reference = ref(db, 'users/'=userId);
export { app, analytics, auth, db,pingBackend,addData,getUserName,addStudyGroupData,fetchGroupData,fetchAllGroups,resetPassword,saveUserProfile, loadUserProfile};

