'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://3001-i9gw4and8y3yu84g1ujxh-6bf8d723.manusvm.computer';

interface Account {
  id: number;
  provider: string;
  email: string;
  displayName: string;
  status: string;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/accounts`);
        setAccounts(response.data);
      } catch (error) {
        console.error('Failed to load accounts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/accounts/connect`, {
        provider,
        email,
        displayName,
      });
      setAccounts([...accounts, response.data]);
      setEmail('');
      setDisplayName('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add account', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/auth';
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Zero Lite Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Connected Email Accounts</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p style={{ color: '#666' }}>No email accounts connected yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {accounts.map((account) => (
              <li
                key={account.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{account.displayName}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {account.email} ({account.provider})
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Status: <span style={{ color: '#28a745' }}>{account.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Add Email Account
          </button>
        ) : (
          <form onSubmit={handleAddAccount} style={{ maxWidth: '400px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>Connect Email Account</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>Provider:</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="imap">IMAP/Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Display Name:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Connect
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Quick Links</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/inbox" style={{ color: '#007bff', textDecoration: 'none' }}>📧 View Inbox</a></li>
          <li><a href="/compose" style={{ color: '#007bff', textDecoration: 'none' }}>✉️ Compose Email</a></li>
        </ul>
      </div>
    </div>
  );
}
