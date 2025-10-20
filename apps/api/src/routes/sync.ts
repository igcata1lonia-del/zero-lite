import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../auth';
import { syncEngine } from '../sync';

const router = express.Router();

router.use(authMiddleware);

router.get('/status', (req: AuthRequest, res: Response) => {
  const jobs = syncEngine.getAllJobs();
  const userJobs = jobs.filter(j => j.userId === req.userId);
  res.json(userJobs);
});

router.get('/status/:accountId', (req: AuthRequest, res: Response) => {
  const job = syncEngine.getJobStatus(parseInt(req.params.accountId));
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

router.post('/trigger/:accountId', async (req: AuthRequest, res: Response) => {
  try {
    await syncEngine.syncAccount(parseInt(req.params.accountId));
    const job = syncEngine.getJobStatus(parseInt(req.params.accountId));
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
