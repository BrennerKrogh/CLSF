// src/app/my-groups/components/MyGroupsList.tsx
"use client";

import { useState } from 'react';
import MyGroupCard from './MyGroupCard';
import GroupChat from './GroupChat';
import { fetchGroupsByUID, leaveGroup, auth } from '../../../firebase';
import { useEffect } from 'react';

// Simple group type that matches what we actually use
interface Group {
  id: string;
  name: string;
  description: string;
  creator: string;
  subject: string;
  capacity: number;
  joined: number;
  location: string;
  dateTime: string;
  members?: string[]; // Firebase stores user IDs
  nextMeeting: string;
  unreadMessages: number;
}

export default function MyGroupsList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase interface so we can have strict typing
  interface FirebaseGroup {
    id: string;
    name: string;
    description: string;
    creator: string;
    subject: string;
    capacity: number;
    joined: number;
    location: string;
    dateTime: string;
    members?: string[];
  }

  const convertToUIGroup = (firebaseGroup: FirebaseGroup): Group => {
    // Generate mock next meeting (tomorrow at 2 PM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    return {
      ...firebaseGroup,
      nextMeeting: tomorrow.toISOString(),
      unreadMessages: Math.floor(Math.random() * 5), // Random unread count for demo
    };
  };

  // Fetch groups when component mounts or user changes
  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUser) {
        setGroups([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedGroups = await fetchGroupsByUID();
        const uiGroups = (Array.isArray(fetchedGroups) ? fetchedGroups : [])
          .map(convertToUIGroup);
        setGroups(uiGroups);
        console.log("Groups fetched:", fetchedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  useEffect(() => {
    console.log("Updated Groups: ", groups);
    console.log("Number of groups: ", groups.length);
  }, [groups]);

  // Find the selected group
  const selectedGroup = Array.isArray(groups) ? groups.find(group => group.id === selectedGroupId) : undefined;

  // Handle opening the chat for a specific group
  const handleOpenChat = (groupId: string) => {
    setSelectedGroupId(groupId);
  };
  
  // Handle closing the chat
  const handleCloseChat = () => {
    setSelectedGroupId(null);
  };
  
  // Handle leaving a group
  const handleLeaveGroup = async (groupId: string) => {
    if (!currentUser) {
      return;
    }

    try {
      console.log(`Attempting to leave group: ${groupId} with user: ${currentUser}`);
      
      // Call the Firebase leaveGroup function
      await leaveGroup(groupId, currentUser);
      
      console.log('Successfully left group, updating local state');
      
      // Update the local state by removing the group
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      
      // If the group we're leaving is the selected group, close the chat
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
      
    } catch (error) {
      console.error('Error leaving group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave group. Please try again.';
      alert(`Failed to leave group: ${errorMessage}`);
    }
  };
  
  // Refresh groups function
  const refreshGroups = async () => {
    if (!currentUser) return;
    
    try {
      const fetchedGroups = await fetchGroupsByUID();
      const uiGroups = (Array.isArray(fetchedGroups) ? fetchedGroups : [])
        .map(convertToUIGroup);
      setGroups(uiGroups);
    } catch (error) {
      console.error('Error refreshing groups:', error);
    }
  };
  
  // The content to render
  console.log("Length", groups.length);
  const content = selectedGroup ? (
    // If a group is selected, show the chat interface
    <GroupChat 
      group={selectedGroup} 
      onBack={handleCloseChat} 
    />
  ) : loading ? (
    <div className="text-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p>Loading your groups...</p>
    </div>
  ) : !currentUser ? (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center mb-8">
      <h3 className="text-xl font-semibold mb-2">Please sign in</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        You need to be signed in to view your study groups.
      </p>
      <a 
        href="/login" 
        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
      >
        Sign In
      </a>
    </div>
  ) : groups.length === 0 ? (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center mb-8">
      <h3 className="text-xl font-semibold mb-2">You&apos;re not in any study groups yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Join existing groups or create a new one to get started.
      </p>
      <div className="flex justify-center space-x-4">
        <a 
          href="/find-groups" 
          className="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
        >
          Find Groups
        </a>
        <a 
          href="/create-group" 
          className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Create Group
        </a>
      </div>
      <div className="mt-4">
        <button 
          onClick={refreshGroups}
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Groups ({groups.length})</h2>
        <button 
          onClick={refreshGroups}
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
        >
          Refresh
        </button>
      </div>
      <div className="space-y-4">
        {groups.map(group => (
          <MyGroupCard 
            key={group.id} 
            group={group} 
            onOpenChat={handleOpenChat}
            onLeaveGroup={handleLeaveGroup}
          />
        ))}
      </div>
    </div>
  );
  
  // Return the content
  return content;
}