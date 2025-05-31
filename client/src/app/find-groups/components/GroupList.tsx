// src/app/find-groups/components/GroupList.tsx
"use client";

import { useState } from 'react';
import GroupCard from './GroupCard';
import {fetchGroupData} from '../../../firebase';

// This is mock data that would typically come from a backend API
const mockGroups = [
  {
    id: '1',
    name: 'Algorithms & Data Structures Study Group',
    description: 'Preparing for CSE 101 midterm exam focusing on dynamic programming and graph algorithms',
    creator: 'csprofessor',
    subject: 'Computer Science',
    capacity: 6,
    joined: 4,
    location: 'McHenry Library, 3rd Floor',
    dateTime: 'Tuesdays and Thursdays, 4-6 PM'
  },
  {
    id: '2',
    name: 'Calculus II Final Exam Prep',
    description: 'Studying for AM 20 final, focusing on integration techniques and series',
    creator: 'mathwhiz99',
    subject: 'Mathematics',
    capacity: 5,
    joined: 3,
    location: 'Science & Engineering Library, Room 215',
    dateTime: 'Monday, May 25, 2-5 PM'
  },
  {
    id: '3',
    name: 'Organic Chemistry Lab Preparation',
    description: 'Going over lab procedures and problem sets for CHEM 8L',
    creator: 'chemistryking',
    subject: 'Chemistry',
    capacity: 4,
    joined: 4,
    location: 'John\'s House (Off Campus)',
    dateTime: 'Wednesdays, 7-9 PM'
  },
  {
    id: '4',
    name: 'Physics Mechanics Group',
    description: 'Working through problem sets for PHYS 5A and reviewing lecture material',
    creator: 'physicsfan22',
    subject: 'Physics',
    capacity: 8,
    joined: 2,
    location: 'Online (Zoom)',
    dateTime: 'Saturdays, 10 AM - 12 PM'
  },
  {
    id: '5',
    name: 'Literature Analysis Group',
    description: 'Discussing themes and symbolism in novels for LIT 80K',
    creator: 'bookworm2024',
    subject: 'English Literature',
    capacity: 6,
    joined: 1,
    location: 'Perk Coffee Shop (Downtown)',
    dateTime: 'Fridays, 3-5 PM'
  },
  {
    id: '6',
    name: 'Social Psychology Study Group',
    description: 'Preparing for PSYC 40 final exam with concept reviews and practice questions',
    creator: 'psychstudent',
    subject: 'Psychology',
    capacity: 5,
    joined: 3,
    location: 'Student Center, Meeting Room 3',
    dateTime: 'Tuesdays, 1-3 PM'
  }
];

export default function GroupList() {
  const [groups, setGroups] = useState(mockGroups);

  // magic function
  // need to algorithmically fetch group data from firebase
  // Also need to fetch with filters
  fetchGroupData('TestGroupPleaseWork').then(importedGroup => {
    if (importedGroup) {
      setGroups(prevGroups => {
        // Check if the group already exists
        const groupExists = prevGroups.some(group => group.id === importedGroup.id);
        if (!groupExists) {
          return [...prevGroups, importedGroup];
        }
        return prevGroups; // Return the existing list if the group is already present
      });
    }
  });

  
  return (
    <div className="pb-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Study Groups</h2>
        <span className="text-gray-600 dark:text-gray-400">{groups.length} groups found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}