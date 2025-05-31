'use client';

import React, { useState } from 'react';
import { addData } from '../../firebase';

const AddDataButton: React.FC = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const handleAddData = () => {
        if (name && number) {
            addData(name, number);
            setName('');
            setNumber('');
        } else {
            alert('Please fill out both fields.');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <button onClick={handleAddData}>Add Data</button>
        </div>
    );
};

export default AddDataButton;