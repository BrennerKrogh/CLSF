// src/app/create-group/components/CreateGroupForm.tsx
"use client";

import { useState } from 'react';
import {addStudyGroupData} from '../../../firebase'

export default function CreateGroupForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    location: '',
    dateTime: '',
    capacity: 5,
    isPublic: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs separately
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } 
    // Handle radio buttons
    else if (type === 'radio') {
      const radioElement = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: radioElement.value === 'true' ? true : false
      });
    } 
    // Handle all other inputs
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Submitting form data:', formData);
      addStudyGroupData(formData.name, formData);
      //alert('Study group created successfully! (This would connect to a backend in a real app)');
      setIsSubmitting(false);
      
      // Reset form after submission
      setFormData({
        name: '',
        description: '',
        subject: '',
        location: '',
        dateTime: '',
        capacity: 5,
        isPublic: true
      });
    }, 1000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Basic Info Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Group Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Name */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Calculus II Study Group"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
            </div>
            
            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What will your group be studying? Include details about topics, courses, and goals."
                rows={4}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
            </div>
            
            {/* Subject/Course */}
            <div className="col-span-1">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject/Course*
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              >
                <option value="">Select a subject</option>
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
            
            {/* Capacity */}
            <div className="col-span-1">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Capacity*
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="2"
                max="20"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum number of participants, including you.
              </p>
            </div>
          </div>
        </div>
        
        {/* Meeting Details Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Meeting Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="col-span-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location*
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              >
                <option value="">Select a location</option>
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
            
            {/* Date/Time */}
            <div className="col-span-1">
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time*
              </label>
              <input
                type="text"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                placeholder="e.g., Tuesdays and Thursdays, 4-6 PM"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="public"
                  name="isPublic"
                  value="true"
                  checked={formData.isPublic === true}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="public" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Public (Anyone can join)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="private"
                  name="isPublic"
                  value="false"
                  checked={formData.isPublic === false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Private (By invitation only)
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-3 bg-purple-600 text-white font-medium rounded-lg transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Group...
              </span>
            ) : (
              'Create Study Group'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}