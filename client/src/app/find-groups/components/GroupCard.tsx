// src/app/find-groups/components/GroupCard.tsx
"use client";

import { useState } from 'react';

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
}

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const isFull = group.joined >= group.capacity;
  
  // This function would typically connect to your backend to join a group
  const handleJoinGroup = () => {
    setIsJoining(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      console.log(`Joining group: ${group.id}`);
      alert(`You've requested to join ${group.name}! (This would connect to a backend in a real app)`);
      setIsJoining(false);
    }, 1000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200">
      {/* Group header with subject badge */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md mb-2">
              {group.subject}
            </span>
            <h3 className="text-lg font-semibold line-clamp-1">{group.name}</h3>
          </div>
          
          {/* Capacity indicator */}
          <div className="flex items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className={isFull ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                {group.joined}/{group.capacity}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Group details */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
          {group.description}
        </p>
        
        {/* Creator */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            Created by <span className="font-medium text-gray-800 dark:text-gray-200">{group.creator}</span>
          </p>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-1">{group.location}</p>
        </div>
        
        {/* Date and time */}
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{group.dateTime}</p>
        </div>
      </div>
      
      {/* Card footer with join button */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleJoinGroup}
          disabled={isFull || isJoining}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition ${
            isFull 
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isJoining ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </span>
          ) : isFull ? 'Group Full' : 'Join Group'}
        </button>
      </div>
    </div>
  );
}