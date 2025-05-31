'use client';
import React, { useState } from 'react';
import { pingBackend } from '../../firebase';

const PingBackendButton: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handlePing = async () => {
        setLoading(true);
        try {
            await pingBackend();
        } catch (error) {
            console.error('Error pinging backend:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePing}
            disabled={loading}
            style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease',
            }}
        >
            {loading ? 'Pinging...' : 'Ping Backend'}
        </button>
    );
};

export default PingBackendButton;
