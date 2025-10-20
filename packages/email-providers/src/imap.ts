import { EmailProvider, Folder, Message, MessageDetail } from './types';

export class ImapProvider implements EmailProvider {
  constructor(private host: string, private user: string, private password: string) {}

  async authenticate(): Promise<void> {
    // Implement IMAP connection
  }

  async getFolders(): Promise<Folder[]> {
    // Implement IMAP folder listing
    return [];
  }

  async getMessages(folderId: string, limit?: number): Promise<Message[]> {
    // Implement IMAP message fetch
    return [];
  }

  async getMessage(messageId: string): Promise<MessageDetail> {
    // Implement IMAP message detail fetch
    throw new Error('Not implemented');
  }

  async sendMessage(to: string, subject: string, body: string, html?: string): Promise<string> {
    // Implement SMTP send
    throw new Error('Not implemented');
  }

  async markAsRead(messageId: string): Promise<void> {
    // Implement IMAP flag update
  }

  async deleteMessage(messageId: string): Promise<void> {
    // Implement IMAP deletion
  }

  async moveMessage(messageId: string, folderId: string): Promise<void> {
    // Implement IMAP move
  }
}
