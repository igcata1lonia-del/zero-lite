'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ComposePage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        const response = await axios.get('http://localhost:3001/accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAccounts(response.data);
        if (response.data.length > 0) {
          setAccountId(response.data[0].id);
        }
      } catch (err: any) {
        setError('Failed to load accounts');
      }
    };

    fetchAccounts();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/messages/send',
        { to, subject, body, accountId: parseInt(accountId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Email sent successfully!');
      setTo('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h1>Compose Email</h1>
      <form onSubmit={handleSend}>
        <div style={{ marginBottom: '15px' }}>
          <label>From:</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.displayName} ({acc.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>To:</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Message:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={10}
            style={{ width: '100%', padding: '8px', marginTop: '5px', fontFamily: 'monospace' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

