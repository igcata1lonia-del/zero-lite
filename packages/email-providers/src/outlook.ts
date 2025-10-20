import { EmailProvider, Folder, Message, MessageDetail } from './types';

export class OutlookProvider implements EmailProvider {
  constructor(private accessToken: string) {}

  async authenticate(): Promise<void> {
    // Token already provided
  }

  async getFolders(): Promise<Folder[]> {
    // Implement Microsoft Graph API call
    return [];
  }

  async getMessages(folderId: string, limit?: number): Promise<Message[]> {
    // Implement Microsoft Graph API call
    return [];
  }

  async getMessage(messageId: string): Promise<MessageDetail> {
    // Implement Microsoft Graph API call
    throw new Error('Not implemented');
  }

  async sendMessage(to: string, subject: string, body: string, html?: string): Promise<string> {
    // Implement Microsoft Graph API call
    throw new Error('Not implemented');
  }

  async markAsRead(messageId: string): Promise<void> {
    // Implement Microsoft Graph API call
  }

  async deleteMessage(messageId: string): Promise<void> {
    // Implement Microsoft Graph API call
  }

  async moveMessage(messageId: string, folderId: string): Promise<void> {
    // Implement Microsoft Graph API call
  }
}
