// src/app/page.tsx
//import Image from 'next/image';
import BottomNavigation from './components/BottomNavigation';

export default function Page() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Main content */}
      <main className="flex flex-col md:flex-row justify-center items-center w-full max-w-6xl mx-auto px-4 py-12 flex-grow">
        {/* Text section */}
        <div className="md:w-1/2 p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Group Finder</h1>
          <p className="text-xl mb-6">
            Find study groups for your courses, or create your own to connect with classmates.
          </p>
        </div>
        
        {/* Logo section */}
        <div className="md:w-1/2 flex justify-center p-6">
          <div className="w-48 h-48 bg-[#5a2ca0] clip-triangle"></div>
        </div>
      </main>
      
      {/* Add spacer to prevent content from being hidden behind the navigation bar */}
      <div className="h-16"></div>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}