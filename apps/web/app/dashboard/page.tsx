'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const userResponse = await axios.get('http://localhost:3001/auth/me', { headers });
        setUser(userResponse.data);

        const accountsResponse = await axios.get('http://localhost:3001/accounts', { headers });
        setAccounts(accountsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h1>Zero Lite Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <h2>Connected Accounts</h2>
      {accounts.length === 0 ? (
        <p>No connected accounts. Add one to get started.</p>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              {account.displayName} ({account.email}) - {account.provider}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }}
        style={{
          padding: '10px 20px',
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
  );
}
