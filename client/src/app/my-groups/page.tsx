// src/app/my-groups/page.tsx
import BottomNavigation from '../components/BottomNavigation';
import MyGroupsList from './components/MyGroupsList';

export default function MyGroups() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Study Groups</h1>
      <p className="text-lg mb-6">View and manage all your study groups in one place.</p>
      
      {/* My groups listing */}
      <MyGroupsList />
      
      {/* Bottom navigation placeholder to ensure proper spacing */}
      <div className="h-16"></div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}