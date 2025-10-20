import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../auth';

const router = express.Router();

// Mock database
const messages: Map<number, any> = new Map();
let messageIdCounter = 1;

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => {
  const { accountId, folder, search, limit = 20 } = req.query;

  // Mock: return sample messages
  const userMessages = Array.from(messages.values())
    .filter(m => m.userId === req.userId)
    .slice(0, parseInt(limit as string));

  res.json(userMessages);
});

router.get('/:messageId', (req: AuthRequest, res: Response) => {
  const message = messages.get(parseInt(req.params.messageId));

  if (!message || message.userId !== req.userId) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json(message);
});

router.post('/:messageId/read', (req: AuthRequest, res: Response) => {
  const message = messages.get(parseInt(req.params.messageId));

  if (!message || message.userId !== req.userId) {
    return res.status(404).json({ error: 'Message not found' });
  }

  message.isRead = true;
  res.json({ success: true });
});

router.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, body, accountId } = req.body;

    if (!to || !subject || !accountId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messageId = messageIdCounter++;
    const message = {
      id: messageId,
      userId: req.userId,
      accountId,
      to,
      subject,
      body,
      status: 'sent',
      createdAt: new Date(),
    };

    messages.set(messageId, message);

    res.json({ id: messageId, status: 'sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
