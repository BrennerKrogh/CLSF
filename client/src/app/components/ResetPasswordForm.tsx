'use client';
import React, { useState } from 'react';
import { resetPassword } from '../../firebase';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Password reset email sent.');
    } catch (err) {
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reset Password
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ResetPasswordForm;
