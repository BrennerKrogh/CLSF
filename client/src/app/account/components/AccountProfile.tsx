// src/app/account/components/AccountProfile.tsx
"use client";

import { useState } from 'react';
//import Image from 'next/image';

export default function AccountProfile() {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    profilePicture: '/placeholder-avatar.png', // This would be the path to your default avatar
    username: 'username',
    name: 'John Pork',
    major: 'Animal Studies',
    schoolYear: 'Junior',
    school: 'University of Listenbourg',
    location: 'Listenbourg City, LG',
    bio: 'Animal Studies major looking for help with Bird Studies 101 and Cat Economics 150'
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // Here you would typically save the data to your backend
    console.log('Saving profile data:', profileData);
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Profile Information</h2>
        
        {isEditing ? (
          <div className="space-x-3">
            <button 
              onClick={() => setIsEditing(false)} 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges} 
              className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-purple-100 dark:border-purple-900 mb-4">
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              {/* This would be replaced with an actual profile image */}
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          {isEditing && (
            <button className="px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700 transition">
              Change Photo
            </button>
          )}
        </div>
        
        {/* Profile Fields Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.username}</p>
            )}
          </div>
          
          {/* Full Name */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.name}</p>
            )}
          </div>
          
          {/* Major */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Major
            </label>
            {isEditing ? (
              <input
                type="text"
                name="major"
                value={profileData.major}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.major}</p>
            )}
          </div>
          
          {/* School Year */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              School Year
            </label>
            {isEditing ? (
              <select
                name="schoolYear"
                value={profileData.schoolYear}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.schoolYear}</p>
            )}
          </div>
          
          {/* School */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              School
            </label>
            {isEditing ? (
              <input
                type="text"
                name="school"
                value={profileData.school}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.school}</p>
            )}
          </div>
          
          {/* Location */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.location}</p>
            )}
          </div>
          
          {/* Bio - spans 2 columns */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profileData.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}