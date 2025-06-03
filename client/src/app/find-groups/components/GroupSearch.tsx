// src/app/find-groups/components/GroupSearch.tsx
"use client";

import { useState } from 'react';

interface SearchFilters {
  subject: string;
  location: string;
}

interface GroupSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

export default function GroupSearch({ onSearch, onReset }: GroupSearchProps) {
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params:', { subject, location });
    onSearch({ subject, location });
  };

  const handleReset = () => {
    setSubject('');
    setLocation('');
    onReset();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Find the perfect study group</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject/Course filter */}
          <div className="col-span-1">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            >
              <option value="">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Psychology">Psychology</option>
              <option value="Engineering">Engineering</option>
              <option value="Economics">Economics</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Sociology">Sociology</option>
            </select>
          </div>
          
          {/* Location filter */}
          <div className="col-span-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            >
              <option value="">All Locations</option>
              <option value="McHenry Library">McHenry Library</option>
              <option value="Science & Engineering Library">Science & Engineering Library</option>
              <option value="Coffee Shops">Coffee Shops</option>
              <option value="Student Center">Student Center</option>
              <option value="Online">Online</option>
              <option value="Residence Halls">Residence Halls</option>
              <option value="Study Rooms">Study Rooms</option>
              <option value="Campus">Campus</option>
              <option value="Off Campus">Off Campus</option>
            </select>
          </div>
          
          {/* Action buttons */}
          <div className="col-span-1 flex flex-col space-y-2">
            <button
              type="submit"
              className="flex-1 p-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              Search Groups
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}