// src/app/find-groups/page.tsx
import BottomNavigation from '../components/BottomNavigation';
import GroupSearch from './components/GroupSearch';
import GroupList from './components/GroupList';
import UserNameComponent from '../components/userNameComponent';

export default function FindGroups() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Find Study Groups</h1>
      <p className="text-lg mb-6">Join a study group to collaborate with classmates and improve your academic performance.</p>
      
      {/* Search and filter component */}
      <UserNameComponent />

      <GroupSearch />
      
      {/* Group listings */}
      <GroupList />
      
      {/* Bottom navigation placeholder to ensure proper spacing */}
      <div className="h-16"></div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}