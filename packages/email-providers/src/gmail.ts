import { EmailProvider, Folder, Message, MessageDetail, Attachment } from './types';

export class GmailProvider implements EmailProvider {
  constructor(private accessToken: string) {}

  async authenticate(): Promise<void> {
    // Token already provided
  }

  async getFolders(): Promise<Folder[]> {
    // Implement Gmail API call
    return [];
  }

  async getMessages(folderId: string, limit?: number): Promise<Message[]> {
    // Implement Gmail API call
    return [];
  }

  async getMessage(messageId: string): Promise<MessageDetail> {
    // Implement Gmail API call
    throw new Error('Not implemented');
  }

  async sendMessage(to: string, subject: string, body: string, html?: string): Promise<string> {
    // Implement Gmail API call
    throw new Error('Not implemented');
  }

  async markAsRead(messageId: string): Promise<void> {
    // Implement Gmail API call
  }

  async deleteMessage(messageId: string): Promise<void> {
    // Implement Gmail API call
  }

  async moveMessage(messageId: string, folderId: string): Promise<void> {
    // Implement Gmail API call
  }
}
