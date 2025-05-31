// src/app/find-groups/components/GroupSearch.tsx
"use client";

import { useState } from 'react';

export default function GroupSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  
  // This function would typically trigger a search with the backend
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search params:', { searchTerm, subject, location });
    // Here you would fetch filtered results from your backend
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Find the perfect study group</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="col-span-1 md:col-span-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by group name, course, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Subject/Course filter */}
          <div className="col-span-1">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            >
              <option value="">All Subjects</option>
              <option value="computer-science">Computer Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="english">English</option>
              <option value="history">History</option>
              <option value="psychology">Psychology</option>
            </select>
          </div>
          
          {/* Location filter */}
          <div className="col-span-1">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            >
              <option value="">All Locations</option>
              <option value="mchenry-library">McHenry Library</option>
              <option value="science-library">Science & Engineering Library</option>
              <option value="coffee-shops">Coffee Shops</option>
              <option value="student-center">Student Center</option>
              <option value="online">Online</option>
              <option value="residence-halls">Residence Halls</option>
            </select>
          </div>
          
          {/* Search button */}
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              Search Groups
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}