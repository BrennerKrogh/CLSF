'use client';

import React, { useEffect, useState } from 'react';
import { auth, loadUserProfile } from '../../firebase';
import { User } from 'firebase/auth';

const UserNameComponent = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Try to load the user profile to get the username
                    const profileData = await loadUserProfile(currentUser.uid);
                    if (profileData && profileData.username && profileData.username !== 'username') {
                        setUsername(profileData.username);
                    } else {
                        // Fallback to email if no username is set
                        const emailUsername = currentUser.email?.split('@')[0] || 'User';
                        setUsername(emailUsername);
                    }
                } catch (error) {
                    console.error('Error loading user profile:', error);
                    // Fallback to email username
                    const emailUsername = currentUser.email?.split('@')[0] || 'User';
                    setUsername(emailUsername);
                }
            } else {
                setUsername('');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md px-3 py-2">
                    <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md px-3 py-2">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        Not signed in
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md px-3 py-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {username}
                </span>
            </div>
        </div>
    );
};

export default UserNameComponent;
