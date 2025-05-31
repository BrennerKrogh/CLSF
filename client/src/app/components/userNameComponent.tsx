'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Adjust the path to firebase.js as needed

const styles = {
    userNameBox: {
        padding: '2px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
        backgroundColor: 'blue',
        width: 'fit-content',
    },
    userNameText: {
        fontSize: '8px',
        color: '#333',
    },
};

const UserNameComponent = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setEmail(user.email || 'No email available');
            } else {
                setEmail('Not signed in');
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    return (
        <div style={styles.userNameBox}>
            <p style={styles.userNameText}>{email}</p>
        </div>
    );
};

export default UserNameComponent;