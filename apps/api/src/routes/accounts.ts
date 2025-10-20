import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../auth';

const router = express.Router();

// Mock database
const accounts: Map<number, any> = new Map();
let accountIdCounter = 1;

router.use(authMiddleware);

router.post('/connect', async (req: AuthRequest, res: Response) => {
  try {
    const { provider, email, displayName, credentials } = req.body;

    if (!provider || !email || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['gmail', 'outlook', 'imap'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const accountId = accountIdCounter++;
    const account = {
      id: accountId,
      userId: req.userId,
      provider,
      email,
      displayName,
      status: 'connected',
      credentials,
      createdAt: new Date(),
    };

    accounts.set(accountId, account);

    res.json({ 
      id: accountId, 
      provider, 
      email, 
      displayName, 
      status: 'connected' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect account' });
  }
});

router.get('/', (req: AuthRequest, res: Response) => {
  const userAccounts = Array.from(accounts.values())
    .filter(a => a.userId === req.userId)
    .map(a => ({
      id: a.id,
      provider: a.provider,
      email: a.email,
      displayName: a.displayName,
      status: a.status,
      createdAt: a.createdAt,
    }));

  res.json(userAccounts);
});

router.get('/:accountId', (req: AuthRequest, res: Response) => {
  const account = accounts.get(parseInt(req.params.accountId));

  if (!account || account.userId !== req.userId) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json({
    id: account.id,
    provider: account.provider,
    email: account.email,
    displayName: account.displayName,
    status: account.status,
    createdAt: account.createdAt,
  });
});

router.delete('/:accountId', (req: AuthRequest, res: Response) => {
  const account = accounts.get(parseInt(req.params.accountId));

  if (!account || account.userId !== req.userId) {
    return res.status(404).json({ error: 'Account not found' });
  }

  accounts.delete(parseInt(req.params.accountId));
  res.json({ success: true });
});

export default router;
