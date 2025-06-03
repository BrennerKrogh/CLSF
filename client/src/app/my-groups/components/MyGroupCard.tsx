// src/app/my-groups/components/MyGroupCard.tsx
"use client";

import { useState } from 'react';

// Define the member type
interface GroupMember {
  username: string;
  role: "creator" | "member";  // Use string literals for specific values
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

interface MyGroupCardProps {
  group: Group;
  onOpenChat: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

export default function MyGroupCard({ group, onOpenChat, onLeaveGroup }: MyGroupCardProps) {
  // console.log("Rendering MyGroupCard for group:", group.name);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the next meeting date
  const formatNextMeeting = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the meeting is today
    const isToday = date.toDateString() === now.toDateString();
    
    // Format time
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    const timeStr = date.toLocaleTimeString(undefined, timeOptions);
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else {
      // Format date
      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const dateStr = date.toLocaleDateString(undefined, dateOptions);
      return `${dateStr} at ${timeStr}`;
    }
  };
  
  // Calculate if the next meeting is soon (within 24 hours)
  const isNextMeetingSoon = () => {
    const meetingDate = new Date(group.nextMeeting);
    const now = new Date();
    const hoursDiff = (meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 0 && hoursDiff <= 24;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200">
      {/* Group header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md">
                {group.subject}
              </span>
              
              {group.unreadMessages > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none bg-red-500 text-white rounded-full">
                  {group.unreadMessages}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold line-clamp-1">{group.name}</h3>
          </div>
          
          {/* Toggle expand button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse group details" : "Expand group details"}
          >
            <svg className={`w-5 h-5 transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Group details - visible when expanded */}
      {isExpanded && (
        <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {group.description}
          </p>
          
          {/* Meeting time */}
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Regular schedule: {group.dateTime}</p>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{group.location}</p>
          </div>
          
          {/* Members */}
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              {group.joined}/{group.capacity} members
            </p>
          </div>
        </div>
      )}
      
      {/* Next meeting and action buttons */}
      <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        {/* Next meeting */}
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isNextMeetingSoon() ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            Next: {formatNextMeeting(group.nextMeeting)}
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onLeaveGroup(group.id)} 
            className="px-3 py-1.5 border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition text-sm"
          >
            Leave Group
          </button>
          
          <button 
            onClick={() => onOpenChat(group.id)} 
            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
            {group.unreadMessages > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none bg-red-500 text-white rounded-full">
                {group.unreadMessages}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}