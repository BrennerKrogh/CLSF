'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, text: data.text || '' };
      }));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(db, 'messages'), {
      text: input,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Chat Room</h1>
      <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 10, marginBottom: 20 }}>
        {messages.map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ width: '80%' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
