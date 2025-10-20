'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://3001-i9gw4and8y3yu84g1ujxh-6bf8d723.manusvm.computer';

interface Message {
  id: number;
  to: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading messages...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <h2 style={{ padding: '15px' }}>Inbox ({messages.length})</h2>
        {messages.length === 0 ? (
          <p style={{ padding: '15px', color: '#666' }}>No messages</p>
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
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{msg.to}</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>{msg.subject}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMessage && (
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <h3>{selectedMessage.subject}</h3>
          <p style={{ color: '#666' }}>To: {selectedMessage.to}</p>
          <p style={{ color: '#666' }}>Status: {selectedMessage.status}</p>
          <p style={{ color: '#666' }}>Date: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
          <hr />
          <p>{selectedMessage.body}</p>
        </div>
      )}
    </div>
  );
}
