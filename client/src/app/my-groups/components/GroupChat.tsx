// src/app/my-groups/components/GroupChat.tsx
"use client";

import { useState, useEffect, useRef } from 'react';

// Define the message type
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

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

interface GroupChatProps {
  group: Group;
  onBack: () => void;
}

// Mock message data - in a real app, this would come from an API
const getMockMessages = (groupId: string): Message[] => {
  return [
    {
      id: '1',
      sender: 'csprofessor',
      content: 'Hi everyone! Looking forward to our next session on Thursday. Please complete the problem set before we meet.',
      timestamp: '2025-05-19T10:30:00',
      isCurrentUser: false
    },
    {
      id: '2',
      sender: 'algomaster',
      content: 'I had a question about the dynamic programming problem (#3). Anyone want to discuss it?',
      timestamp: '2025-05-19T11:15:00',
      isCurrentUser: false
    },
    {
      id: '3',
      sender: 'currentUser',
      content: 'Sure! I can help with that one. The key insight is to build the solution recursively.',
      timestamp: '2025-05-19T11:20:00',
      isCurrentUser: true
    },
    {
      id: '4',
      sender: 'codingking',
      content: 'I\'m bringing my notes from last semester. They cover most of the topics for the midterm.',
      timestamp: '2025-05-19T13:45:00',
      isCurrentUser: false
    },
    {
      id: '5',
      sender: 'csprofessor',
      content: 'Great! Also, I just found out we can book the study room for an extra hour if we need it.',
      timestamp: '2025-05-20T09:10:00',
      isCurrentUser: false
    }
  ];
};

export default function GroupChat({ group, onBack }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages when component mounts
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchMessages = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(getMockMessages(group.id));
      setIsLoading(false);
    };
    
    fetchMessages();
  }, [group.id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Format date for messages
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the message is from today
    const isToday = date.toDateString() === now.toDateString();
    
    // Format time
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    const timeStr = date.toLocaleTimeString(undefined, timeOptions);
    
    if (isToday) {
      return timeStr;
    } else {
      // Format date
      const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const dateStr = date.toLocaleDateString(undefined, dateOptions);
      return `${dateStr}, ${timeStr}`;
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Create a new message object
    const message: Message = {
      id: Date.now().toString(),
      sender: 'currentUser',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };
    
    // Add the new message to the list
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Clear the input field
    setNewMessage('');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
      {/* Chat header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{group.joined} members</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Next meeting: {new Date(group.nextMeeting).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isCurrentUser 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {!message.isCurrentUser && (
                    <div className="font-semibold text-sm mb-1">{message.sender}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.isCurrentUser ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatMessageDate(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={newMessage.trim() === ''}
            className={`px-4 py-2 rounded-lg ${
              newMessage.trim() === '' 
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}