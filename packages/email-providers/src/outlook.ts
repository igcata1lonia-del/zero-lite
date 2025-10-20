import axios, { AxiosInstance } from 'axios';
import { EmailProvider, Folder, Message, MessageDetail, Attachment } from './types';

export class OutlookProvider implements EmailProvider {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://graph.microsoft.com/v1.0/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async authenticate(): Promise<void> {
    try {
      await this.client.get('/mailFolders');
    } catch (error) {
      throw new Error('Failed to authenticate with Outlook');
    }
  }

  async getFolders(): Promise<Folder[]> {
    try {
      const response = await this.client.get('/mailFolders');
      return response.data.value.map((folder: any) => ({
        id: folder.id,
        name: folder.displayName,
        type: this.mapFolderType(folder.displayName),
      }));
    } catch (error) {
      throw new Error('Failed to fetch Outlook folders');
    }
  }

  async getMessages(folderId: string, limit: number = 20): Promise<Message[]> {
    try {
      const response = await this.client.get(`/mailFolders/${folderId}/messages`, {
        params: {
          $top: limit,
          $select: 'id,from,toRecipients,ccRecipients,subject,bodyPreview,receivedDateTime,isRead,hasAttachments',
        },
      });

      return response.data.value.map((msg: any) => ({
        id: msg.id,
        from: msg.from?.emailAddress?.address || '',
        to: msg.toRecipients?.map((r: any) => r.emailAddress?.address) || [],
        cc: msg.ccRecipients?.map((r: any) => r.emailAddress?.address) || [],
        subject: msg.subject,
        snippet: msg.bodyPreview,
        date: new Date(msg.receivedDateTime),
        isRead: msg.isRead,
        hasAttachments: msg.hasAttachments,
      }));
    } catch (error) {
      throw new Error('Failed to fetch Outlook messages');
    }
  }

  async getMessage(messageId: string): Promise<MessageDetail> {
    try {
      const response = await this.client.get(`/messages/${messageId}`, {
        params: {
          $select: 'id,from,toRecipients,ccRecipients,subject,body,receivedDateTime,isRead,hasAttachments',
        },
      });

      const msg = response.data;

      return {
        id: msg.id,
        from: msg.from?.emailAddress?.address || '',
        to: msg.toRecipients?.map((r: any) => r.emailAddress?.address) || [],
        cc: msg.ccRecipients?.map((r: any) => r.emailAddress?.address) || [],
        subject: msg.subject,
        snippet: msg.bodyPreview,
        date: new Date(msg.receivedDateTime),
        isRead: msg.isRead,
        hasAttachments: msg.hasAttachments,
        body: msg.body?.content || '',
        bodyHtml: msg.body?.contentType === 'html' ? msg.body?.content : undefined,
        attachments: await this.getAttachments(messageId),
      };
    } catch (error) {
      throw new Error('Failed to fetch Outlook message');
    }
  }

  async sendMessage(to: string, subject: string, body: string, html?: string): Promise<string> {
    try {
      const response = await this.client.post('/sendMail', {
        message: {
          subject,
          body: {
            contentType: html ? 'HTML' : 'Text',
            content: html || body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
        },
      });

      return messageId;
    } catch (error) {
      throw new Error('Failed to send Outlook message');
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      await this.client.patch(`/messages/${messageId}`, {
        isRead: true,
      });
    } catch (error) {
      throw new Error('Failed to mark Outlook message as read');
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await this.client.delete(`/messages/${messageId}`);
    } catch (error) {
      throw new Error('Failed to delete Outlook message');
    }
  }

  async moveMessage(messageId: string, folderId: string): Promise<void> {
    try {
      await this.client.post(`/messages/${messageId}/move`, {
        destinationId: folderId,
      });
    } catch (error) {
      throw new Error('Failed to move Outlook message');
    }
  }

  private async getAttachments(messageId: string): Promise<Attachment[]> {
    try {
      const response = await this.client.get(`/messages/${messageId}/attachments`);
      return response.data.value.map((att: any) => ({
        id: att.id,
        filename: att.name,
        mimeType: att.contentType,
        size: att.size,
      }));
    } catch (error) {
      return [];
    }
  }

  private mapFolderType(displayName: string): 'inbox' | 'sent' | 'draft' | 'trash' | 'archive' | 'custom' {
    const name = displayName.toLowerCase();
    if (name === 'inbox') return 'inbox';
    if (name === 'sent items') return 'sent';
    if (name === 'drafts') return 'draft';
    if (name === 'deleted items') return 'trash';
    if (name === 'archive') return 'archive';
    return 'custom';
  }
}
