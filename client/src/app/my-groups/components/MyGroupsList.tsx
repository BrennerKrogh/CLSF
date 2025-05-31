// src/app/my-groups/components/MyGroupsList.tsx
"use client";

import { useState } from 'react';
import MyGroupCard from './MyGroupCard';
import GroupChat from './GroupChat';

// Define the member type
interface GroupMember {
  username: string;
  role: "creator" | "member";  // Using string literals for specific values
}

// Define the group type
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
  members: GroupMember[];
  nextMeeting: string;
  unreadMessages: number;
}

// This is mock data that would typically come from a backend API
const mockMyGroups: Group[] = [
  {
    id: '1',
    name: 'Algorithms & Data Structures Study Group',
    description: 'Preparing for CSE 101 midterm exam focusing on dynamic programming and graph algorithms',
    creator: 'csprofessor',
    subject: 'Computer Science',
    capacity: 6,
    joined: 4,
    location: 'McHenry Library, 3rd Floor',
    dateTime: 'Tuesdays and Thursdays, 4-6 PM',
    members: [
      { username: 'csprofessor', role: "creator" },
      { username: 'algomaster', role: "member" },
      { username: 'codingking', role: "member" },
      { username: 'currentUser', role: "member" }
    ],
    nextMeeting: '2025-05-21T16:00:00',
    unreadMessages: 5
  },
  {
    id: '2',
    name: 'Calculus II Final Exam Prep',
    description: 'Studying for AM 20 final, focusing on integration techniques and series',
    creator: 'mathwhiz99',
    subject: 'Mathematics',
    capacity: 5,
    joined: 3,
    location: 'Science & Engineering Library, Room 215',
    dateTime: 'Monday, May 25, 2-5 PM',
    members: [
      { username: 'mathwhiz99', role: "creator" },
      { username: 'derivativeking', role: "member" },
      { username: 'currentUser', role: "member" }
    ],
    nextMeeting: '2025-05-25T14:00:00',
    unreadMessages: 0
  },
  {
    id: '3',
    name: 'Physics Mechanics Group',
    description: 'Working through problem sets for PHYS 5A and reviewing lecture material',
    creator: 'physicsfan22',
    subject: 'Physics',
    capacity: 8,
    joined: 2,
    location: 'Online (Zoom)',
    dateTime: 'Saturdays, 10 AM - 12 PM',
    members: [
      { username: 'physicsfan22', role: "creator" },
      { username: 'currentUser', role: "member" }
    ],
    nextMeeting: '2025-05-24T10:00:00',
    unreadMessages: 1
  }
];

export default function MyGroupsList() {
  const [groups, setGroups] = useState<Group[]>(mockMyGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Find the selected group
  const selectedGroup = groups.find(group => group.id === selectedGroupId);
  
  // Handle opening the chat for a specific group
  const handleOpenChat = (groupId: string) => {
    setSelectedGroupId(groupId);
  };
  
  // Handle closing the chat
  const handleCloseChat = () => {
    setSelectedGroupId(null);
  };
  
  // Handle leaving a group
  const handleLeaveGroup = (groupId: string) => {
    const confirmLeave = window.confirm('Are you sure you want to leave this group?');
    
    if (confirmLeave) {
      // In a real app, this would make an API call to the backend
      console.log(`Leaving group: ${groupId}`);
      
      // Update the local state by removing the group
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      
      // If the group we're leaving is the selected group, close the chat
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    }
  };
  
  // The content to render
  const content = selectedGroup ? (
    // If a group is selected, show the chat interface
    <GroupChat 
      group={selectedGroup} 
      onBack={handleCloseChat} 
    />
  ) : (
    // Show the list of groups
    <div>
      {groups.length === 0 ? (
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
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Groups ({groups.length})</h2>
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
      )}
    </div>
  );
  
  // Return the content
  return content;
}