// src/app/create-group/page.tsx
import BottomNavigation from '../components/BottomNavigation';
import CreateGroupForm from './components/CreateGroupForm';

export default function CreateGroup() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create a Study Group</h1>
      <p className="text-lg mb-6">Set up a new study group and invite classmates to join.</p>
      
      <CreateGroupForm />
      
      {/* Bottom navigation placeholder to ensure proper spacing */}
      <div className="h-16"></div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}