'use client';

import React, { useState } from 'react';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
      window.location.href = '/home';
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      window.location.href = '/home';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={mode === 'signup' ? handleRegister : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: mode === 'signup' ? 'blue' : 'green',
            color: 'white',
            padding: '8px 16px',
            marginRight: 10,
            border: 'none',
            borderRadius: 4,
          }}
        >
          {mode === 'signup' ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        {mode === 'signup' ? 'Already have an account?' : 'No account yet?'}{' '}
        <button
          onClick={() =>
            setMode((prev) => (prev === 'signup' ? 'login' : 'signup'))
          }
          style={{ background: 'none', color: 'blue', border: 'none' }}
        >
          Switch to {mode === 'signup' ? 'Login' : 'Register'}
        </button>
      </p>
      {error && (
        <p style={{ color: 'red', marginTop: 10 }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
