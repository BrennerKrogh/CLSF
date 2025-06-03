// src/app/find-groups/components/GroupCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { auth, joinGroup, checkIfUserInGroup } from '../../../firebase';

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
  members?: string[]; // Array of user IDs who joined
}

interface GroupCardProps {
  group: Group;
  onGroupUpdate?: (updatedGroup: Group) => void; // Callback to update parent component
}

export default function GroupCard({ group, onGroupUpdate }: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [localGroup, setLocalGroup] = useState(group);
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const isFull = localGroup.joined >= localGroup.capacity;
  
  useEffect(() => {
    // Check if user is authenticated and get their ID
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
        // Check if current user is already in this group
        checkUserGroupStatus(user.uid);
      } else {
        setCurrentUser(null);
        setIsUserInGroup(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLocalGroup(group);
    // Always refresh user group status when group data changes
    if (currentUser) {
      checkUserGroupStatus(currentUser);
    }
  }, [group, currentUser]);

  // Function to check if current user is in the group
  const checkUserGroupStatus = async (userId: string) => {
    try {
      const isInGroup = await checkIfUserInGroup(localGroup.id, userId);
      setIsUserInGroup(isInGroup);
    } catch (error) {
      console.error('Error checking user group status:', error);
    }
  };

  // Function to join a group
  const handleJoinGroup = async () => {
    if (!currentUser) {
      alert('Please sign in to join a group');
      return;
    }

    if (isUserInGroup || isFull) {
      return;
    }

    setIsJoining(true);
    
    try {
      // Join the group using your Firebase function
      const updatedGroup = await joinGroup(localGroup.id, currentUser);
      
      // Update local state
      setLocalGroup(updatedGroup);
      setIsUserInGroup(true);
      
      // Notify parent component of the update
      if (onGroupUpdate) {
        onGroupUpdate(updatedGroup);
      }
      
      console.log(`Successfully joined group: ${localGroup.id}`);
      
    } catch (error) {
      console.error('Error joining group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join group. Please try again.';
      alert(`Failed to join group: ${errorMessage}`);
    } finally {
      setIsJoining(false);
    }
  };

  // Determine button state and text
  const getButtonState = () => {
    if (!currentUser) {
      return {
        disabled: true,
        text: 'Sign In to Join',
        className: 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
      };
    }
    
    if (isUserInGroup) {
      return {
        disabled: true,
        text: 'Group Joined',
        className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-not-allowed'
      };
    }
    
    if (isFull) {
      return {
        disabled: true,
        text: 'Group Full',
        className: 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
      };
    }
    
    return {
      disabled: false,
      text: 'Join Group',
      className: 'bg-purple-600 text-white hover:bg-purple-700'
    };
  };

  const buttonState = getButtonState();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200">
      {/* Group header with subject badge */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md mb-2">
              {localGroup.subject}
            </span>
            <h3 className="text-lg font-semibold line-clamp-1">{localGroup.name}</h3>
          </div>
          
          {/* Capacity indicator */}
          <div className="flex items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className={isFull ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                {localGroup.joined}/{localGroup.capacity}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Group details */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
          {localGroup.description}
        </p>
        
        {/* Creator */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            Created by <span className="font-medium text-gray-800 dark:text-gray-200">{localGroup.creator}</span>
          </p>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-1">{localGroup.location}</p>
        </div>
        
        {/* Date and time */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{localGroup.dateTime}</p>
        </div>
      </div>
      
      {/* Card footer with join button */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleJoinGroup}
          disabled={buttonState.disabled || isJoining}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition ${buttonState.className}`}
        >
          {isJoining ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </span>
          ) : (
            buttonState.text
          )}
        </button>
      </div>
    </div>
  );
}