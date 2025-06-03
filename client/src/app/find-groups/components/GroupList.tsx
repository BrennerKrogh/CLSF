// src/app/find-groups/components/GroupList.tsx
"use client";

import { useEffect, useState } from 'react';
import GroupCard from './GroupCard';
import { fetchAllGroups, auth } from '../../../firebase';

// Define the group type to match GroupCard
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
}

interface SearchFilters {
  subject: string;
  location: string;
}

interface GroupListProps {
  searchFilters?: SearchFilters;
  shouldRefresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function GroupList({ searchFilters, shouldRefresh, onRefreshComplete }: GroupListProps) {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Track current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadGroups();
  }, []);

  // Add refresh when user changes (sign in/out)
  useEffect(() => {
    if (currentUser !== null) { // Only refresh when we have a definitive user state
      loadGroups();
    }
  }, [currentUser]);

  // Handle external refresh trigger
  useEffect(() => {
    if (shouldRefresh) {
      loadGroups();
      if (onRefreshComplete) {
        onRefreshComplete();
      }
    }
  }, [shouldRefresh, onRefreshComplete]);

  // Apply filters when searchFilters change
  useEffect(() => {
    applyFilters();
  }, [searchFilters, allGroups]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const fetchedGroups = await fetchAllGroups();

      // This is my current method way of not showing dead groups
      // Pretty suboptimal, but I'd prefer to make a cleaning function on a real backend
      const groupsWithMembers = (fetchedGroups || []).filter(group => group.members && group.members.length > 0);
      const publicGroups = (groupsWithMembers || []).filter(group => group.isPublic === true);
      setAllGroups(publicGroups || []);
      console.log('Loaded groups:', publicGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!searchFilters || (!searchFilters.subject && !searchFilters.location)) {
      // No filters applied, show all groups
      setFilteredGroups(allGroups);
      return;
    }

    const filtered = allGroups.filter(group => {
      const matchesSubject = !searchFilters.subject || 
        group.subject.toLowerCase().includes(searchFilters.subject.toLowerCase());
      
      const matchesLocation = !searchFilters.location || 
        group.location.toLowerCase().includes(searchFilters.location.toLowerCase());

      return matchesSubject && matchesLocation;
    });

    setFilteredGroups(filtered);
    console.log('Applied filters:', searchFilters, 'Results:', filtered.length);
  };

  // Function to handle group updates when a user joins
  const handleGroupUpdate = (updatedGroup: Group) => {
    console.log('Updating group in list:', updatedGroup);
    setAllGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
    
    // Refresh after a short delay to ensure consistency
    // Is this needed? -BK
    setTimeout(() => {
      loadGroups();
    }, 1000);
  };

  // Add a manual refresh button for debugging
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    loadGroups();
  };

  const groupsToShow = filteredGroups;
  const isFiltered = searchFilters && (searchFilters.subject || searchFilters.location);

  if (loading) {
    return (
      <div className="pb-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Available Study Groups</h2>
          <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="p-4 space-y-3">
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isFiltered ? 'Filtered Study Groups' : 'Available Study Groups'}
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-400">
            {groupsToShow.length} group{groupsToShow.length !== 1 ? 's' : ''} found
            {isFiltered && ` (${allGroups.length} total)`}
          </span>
          <button 
            onClick={handleRefresh}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {isFiltered && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-blue-800 dark:text-blue-400 text-sm">
            <span className="font-medium">Active filters:</span>
            {searchFilters?.subject && ` Subject: ${searchFilters.subject}`}
            {searchFilters?.subject && searchFilters?.location && `, `}
            {searchFilters?.location && ` Location: ${searchFilters.location}`}
          </p>
        </div>
      )}
      
      {groupsToShow.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isFiltered ? 'No groups match your filters' : 'No study groups found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isFiltered 
              ? 'Try adjusting your search filters or create a new group.' 
              : 'Try adjusting your search filters or create a new group.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsToShow.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onGroupUpdate={handleGroupUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}