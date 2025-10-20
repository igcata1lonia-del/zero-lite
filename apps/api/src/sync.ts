import { GmailProvider } from '@zero-lite/email-providers';
import { OutlookProvider } from '@zero-lite/email-providers';
import { ImapProvider } from '@zero-lite/email-providers';
import { EmailProvider } from '@zero-lite/email-providers';

export interface SyncJob {
  accountId: number;
  userId: number;
  provider: 'gmail' | 'outlook' | 'imap';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lastSync?: Date;
  nextSync?: Date;
  error?: string;
}

export class SyncEngine {
  private jobs: Map<number, SyncJob> = new Map();
  private providers: Map<number, EmailProvider> = new Map();

  async initializeAccount(accountId: number, userId: number, provider: string, credentials: any): Promise<void> {
    let emailProvider: EmailProvider;

    switch (provider) {
      case 'gmail':
        emailProvider = new GmailProvider(credentials.accessToken);
        break;
      case 'outlook':
        emailProvider = new OutlookProvider(credentials.accessToken);
        break;
      case 'imap':
        emailProvider = new ImapProvider(
          credentials.host,
          credentials.user,
          credentials.password,
          credentials.port,
          credentials.ssl
        );
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    await emailProvider.authenticate();
    this.providers.set(accountId, emailProvider);

    const job: SyncJob = {
      accountId,
      userId,
      provider: provider as any,
      status: 'pending',
      lastSync: undefined,
      nextSync: new Date(),
    };

    this.jobs.set(accountId, job);
  }

  async syncAccount(accountId: number): Promise<void> {
    const job = this.jobs.get(accountId);
    if (!job) throw new Error('Job not found');

    const provider = this.providers.get(accountId);
    if (!provider) throw new Error('Provider not initialized');

    try {
      job.status = 'processing';

      // Get folders
      const folders = await provider.getFolders();
      console.log(`Synced ${folders.length} folders for account ${accountId}`);

      // Get messages from each folder
      for (const folder of folders) {
        const messages = await provider.getMessages(folder.id, 50);
        console.log(`Synced ${messages.length} messages from ${folder.name}`);
      }

      job.status = 'completed';
      job.lastSync = new Date();
      job.nextSync = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      job.nextSync = new Date(Date.now() + 30 * 1000); // Retry in 30 seconds
    }
  }

  async syncAllAccounts(): Promise<void> {
    const now = new Date();
    for (const [accountId, job] of this.jobs) {
      if (job.nextSync && job.nextSync <= now) {
        await this.syncAccount(accountId);
      }
    }
  }

  getJobStatus(accountId: number): SyncJob | undefined {
    return this.jobs.get(accountId);
  }

  getAllJobs(): SyncJob[] {
    return Array.from(this.jobs.values());
  }
}

export const syncEngine = new SyncEngine();
