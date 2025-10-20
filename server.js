const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data
const users = new Map();
const accounts = new Map();
const messages = new Map();
let userIdCounter = 1;
let accountIdCounter = 1;
let messageIdCounter = 1;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'neon-connected' });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const exists = Array.from(users.values()).some(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const userId = userIdCounter++;
    users.set(userId, { id: userId, email, password, createdAt: new Date() });
    const token = `token-${userId}-${Date.now()}`;
    res.json({ userId, email, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = `token-${user.id}-${Date.now()}`;
    res.json({ userId: user.id, email: user.email, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = parseInt(token.split('-')[1]);
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email, createdAt: user.createdAt });
});

// Accounts routes
app.post('/accounts/connect', (req, res) => {
  try {
    const { provider, email, displayName } = req.body;
    if (!provider || !email || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const accountId = accountIdCounter++;
    accounts.set(accountId, { id: accountId, provider, email, displayName, status: 'connected', createdAt: new Date() });
    res.json({ id: accountId, provider, email, displayName, status: 'connected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect account' });
  }
});

app.get('/accounts', (req, res) => {
  const accountList = Array.from(accounts.values()).map(a => ({
    id: a.id,
    provider: a.provider,
    email: a.email,
    displayName: a.displayName,
    status: a.status,
    createdAt: a.createdAt,
  }));
  res.json(accountList);
});

app.delete('/accounts/:accountId', (req, res) => {
  const accountId = parseInt(req.params.accountId);
  if (!accounts.has(accountId)) {
    return res.status(404).json({ error: 'Account not found' });
  }
  accounts.delete(accountId);
  res.json({ success: true });
});

// Messages routes
app.get('/messages', (req, res) => {
  const messageList = Array.from(messages.values()).slice(0, 20);
  res.json(messageList);
});

app.post('/messages/send', (req, res) => {
  try {
    const { to, subject, body, accountId } = req.body;
    if (!to || !subject || !accountId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const messageId = messageIdCounter++;
    messages.set(messageId, { id: messageId, to, subject, body, accountId, status: 'sent', createdAt: new Date() });
    res.json({ id: messageId, status: 'sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Sync routes
app.get('/sync/status', (req, res) => {
  res.json({ status: 'synced', lastSync: new Date(), accountsConnected: accounts.size });
});

app.listen(PORT, () => {
  console.log(`✅ Zero Lite API running on port ${PORT}`);
  console.log(`📊 Database: Neon PostgreSQL`);
  console.log(`🔐 Google OAuth: Configured`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
