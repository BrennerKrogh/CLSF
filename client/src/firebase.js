// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { getDatabase, ref,set} from "firebase/database";
import { get } from "firebase/database";
//import { onAuthStateChanged } from "firebase/auth";
import { sendPasswordResetEmail,onAuthStateChanged,setPersistence, browserLocalPersistence } from "firebase/auth";
import { query, orderByChild, equalTo } from "firebase/database";


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
let uid = null;
onAuthStateChanged(auth, (user) => {
  uid = user ? user.uid : null;
});
const db = getDatabase(app);

// Set session persistence to local storage
// This allows the user to stay signed in even after closing the browser
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });

// Auth state listener 
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
  } else {
    console.log("User is signed out.");
  }
});

console.log("Firebase initialized successfully");


//This is how you can add data to the database from scratch, we will have a more complex function
//for making the study group but the ideal will be the same
//This is just a test, REMOVE
function addData(userId, data) {
  const userRef = ref(db, 'users/' + userId);
  return set(userRef, data,auth.email)
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
  const user = getAuth().currentUser;
  const userEmail = user.email;
  
  const groupRef = ref(db, 'studyGroups/' + groupId);
  
  // Initialize the group with creator as first member and proper joined count
  const updatedData = { 
    ...data, 
    creator: userEmail,
    members: [user.uid], // Creator is automatically the first member
    joined: 1 // Start with 1 member (the creator)
  };

  return set(groupRef, updatedData)
    .then(() => {
      console.log("Study group data added successfully");
      return { id: groupId, ...updatedData };
    })
    .catch((error) => {
      console.error("Error adding study group data:", error);
      throw error;
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

function fetchGroupsByUID() {
  console.log("UID at this point:", uid);
  const studyGroupsRef = ref(db, 'studyGroups');
  return get(studyGroupsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const groups = snapshot.val();
        return Object.keys(groups).map((key) => ({
          id: key,
          ...groups[key],
        }));
      } else {
        console.log("No study groups available");
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching study groups:", error);
      return [];
    });

}

let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

// Function to join a group
function joinGroup(groupId, userId) {
  console.log('Attempting to join group:', groupId, 'with user:', userId);
  const groupRef = ref(db, `studyGroups/${groupId}`);
  
  return get(groupRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        console.log('Found group data:', groupData);
        
        // Ensure members is always an array
        const members = Array.isArray(groupData.members) ? groupData.members : [];
        
        // Check if user is already in the group
        if (members.includes(userId)) {
          throw new Error("User is already in this group");
        }
        
        // Check if group is full
        const currentJoined = groupData.joined || members.length;
        if (currentJoined >= groupData.capacity) {
          throw new Error("Group is full");
        }
        
        // Add user to members array and increment joined count
        const updatedMembers = [...members, userId];
        const updatedData = {
          ...groupData,
          members: updatedMembers,
          joined: updatedMembers.length
        };
        
        // Update the group in Firebase
        return set(groupRef, updatedData)
          .then(() => {
            console.log("Successfully joined group:", groupId);
            return { id: groupId, ...updatedData };
          });
      } else {
        console.log('Group not found in Firebase:', groupId);
        throw new Error("Group not found");
      }
    })
    .catch((error) => {
      console.error("Error joining group:", error);
      throw error;
    });
}

// Function to check if user is in a group
function checkIfUserInGroup(groupId, userId) {
  const groupRef = ref(db, `studyGroups/${groupId}`);
  
  return get(groupRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        // Ensure members is always an array
        const members = Array.isArray(groupData.members) ? groupData.members : [];
        return members.includes(userId);
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error checking user group status:", error);
      return false;
    });
}

// Function to leave a group (bonus functionality)
function leaveGroup(groupId, userId) {
  console.log('Attempting to leave group:', groupId, 'with user:', userId);
  const groupRef = ref(db, `studyGroups/${groupId}`);
  
  return get(groupRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        console.log('Found group data for leaving:', groupData);
        
        // Ensure members is always an array
        const members = Array.isArray(groupData.members) ? groupData.members : [];
        console.log('Current members:', members);
        
        // Check if user is actually in the group
        if (!members.includes(userId)) {
          throw new Error("User is not in this group");
        }
        
        // Remove user from members array
        const updatedMembers = members.filter(memberId => memberId !== userId);
        console.log('Updated members after removal:', updatedMembers);
        
        const updatedData = {
          ...groupData,
          members: updatedMembers,
          joined: updatedMembers.length
        };
        
        // Update the group in Firebase
        return set(groupRef, updatedData)
          .then(() => {
            console.log("Successfully left group:", groupId);
            return { id: groupId, ...updatedData };
          });
      } else {
        console.log('Group not found in Firebase when trying to leave:', groupId);
        throw new Error("Group not found");
      }
    })
    .catch((error) => {
      console.error("Error leaving group:", error);
      throw error;
    });
}

// Function to get groups that a user has joined
function getUserGroups(userId) {
  const groupsRef = ref(db, 'studyGroups');
  
  return get(groupsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const allGroups = snapshot.val();
        const userGroups = [];
        
        Object.entries(allGroups).forEach(([groupId, groupData]) => {
          const members = groupData.members || [];
          if (members.includes(userId)) {
            userGroups.push({ id: groupId, ...groupData });
          }
        });
        
        return userGroups;
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error("Error fetching user groups:", error);
      return [];
    });
}

// Updated exports at the bottom of firebase.js to include these new functions:
export { 
  app,
  analytics,
  auth,
  db,
  pingBackend,
  addData,
  getUserName,
  addStudyGroupData,
  fetchGroupData,
  resetPassword,
  saveUserProfile,
  loadUserProfile,
  fetchAllGroups,
  fetchGroupsByUID,
  joinGroup,
  checkIfUserInGroup,
  leaveGroup,
  getUserGroups
};