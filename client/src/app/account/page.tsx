// src/app/account/page.tsx
import BottomNavigation from '../components/BottomNavigation';
import AccountProfile from './components/AccountProfile';
import UserNameComponent from '../components/userNameComponent';

import { Suspense } from 'react';
//suspense boundary added to make build happy
export default function Account() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
        <UserNameComponent />
        <h1 className="text-3xl font-bold mb-4">Account</h1>
        <p className="text-lg mb-6">Manage your profile information and preferences.</p>
        
        <AccountProfile />
        
        {/* Bottom navigation placeholder to ensure proper spacing */}
        <div className="h-16"></div>
        
        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
    </Suspense>
  );
}