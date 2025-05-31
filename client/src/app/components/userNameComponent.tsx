'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Adjust the path to firebase.js as needed

const styles: { [key: string]: React.CSSProperties } = {
    userNameBox: {
        padding: '2px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
        backgroundColor: 'blue',
        width: 'fit-content',
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
    userNameText: {
        fontSize: '14px',
        color: 'white',
        fontWeight: 'bold',
        WebkitTextStroke: '.5px black',
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