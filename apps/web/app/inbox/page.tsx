'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  isRead: boolean;
  accountId: number;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        const response = await axios.get('http://localhost:3001/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <h2 style={{ padding: '15px' }}>Unified Inbox</h2>
        {error && <p style={{ color: 'red', padding: '15px' }}>{error}</p>}
        {messages.length === 0 ? (
          <p style={{ padding: '15px' }}>No messages</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {messages.map((msg) => (
              <li
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                style={{
                  padding: '12px 15px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor: selectedMessage?.id === msg.id ? '#f0f0f0' : 'white',
                  fontWeight: msg.isRead ? 'normal' : 'bold',
                }}
              >
                <div style={{ fontSize: '14px', color: '#666' }}>{msg.from}</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>{msg.subject}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{msg.snippet}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMessage && (
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h3>{selectedMessage.subject}</h3>
          <p style={{ color: '#666' }}>From: {selectedMessage.from}</p>
          <p style={{ color: '#666' }}>Date: {new Date(selectedMessage.date).toLocaleString()}</p>
          <hr />
          <p>{selectedMessage.snippet}</p>
        </div>
      )}
    </div>
  );
}

