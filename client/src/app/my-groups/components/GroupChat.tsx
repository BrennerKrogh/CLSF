"use client";

import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue } from "firebase/database";
import { db } from "../../../firebase";

import { auth, loadUserProfile } from '../../../firebase';
// import { User } from 'firebase/auth';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

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
  members?: string[];
  nextMeeting: string;
  unreadMessages: number;
}

interface GroupChatProps {
  group: Group;
  onBack: () => void;
}




export default function GroupChat({ group, onBack }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const [username, setUsername] = useState('');

  // need to implement chat and user loading
  // const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
              // setUser(currentUser);
              try {
                  // Try to load the user profile to get the username
                  const profileData = await loadUserProfile(currentUser.uid);
                  if (profileData && profileData.username && profileData.username !== 'username') {
                      setUsername(profileData.username);
                  } else {
                      // Fallback to email if no username is set
                      const emailUsername = currentUser.email?.split('@')[0] || 'User';
                      setUsername(emailUsername);
                  }
              } catch (error) {
                  console.error('Error loading user profile:', error);
                  // Fallback to email username
                  const emailUsername = currentUser.email?.split('@')[0] || 'User';
                  setUsername(emailUsername);
              }
          } else {
              setUsername('');
              // setUser(null);
          }
          // setLoading(false);
      });

      return () => unsubscribe();
  }, []);


  // Fetch messages from Realtime Database
  useEffect(() => {
    const messagesRef = ref(db, `studyGroups/${group.id}/messages`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesObject = snapshot.val();
        const messagesArray = Object.keys(messagesObject).map((key) => ({
          id: key,
          ...messagesObject[key],
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
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
    const isToday = date.toDateString() === now.toDateString();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    const timeStr = date.toLocaleTimeString(undefined, timeOptions);

    if (isToday) {
      return timeStr;
    } else {
      const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const dateStr = date.toLocaleDateString(undefined, dateOptions);
      return `${dateStr}, ${timeStr}`;
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      sender: username, // Replace with actual user ID or name
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    const messagesRef = ref(db, `studyGroups/${group.id}/messages`);
    try {
      await push(messagesRef, message);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
                className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === username 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {message.sender !== username && (
                    <div className="font-semibold text-sm mb-1">{message.sender}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === username ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
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