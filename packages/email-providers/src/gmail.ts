import axios, { AxiosInstance } from 'axios';
import { EmailProvider, Folder, Message, MessageDetail, Attachment } from './types';

export class GmailProvider implements EmailProvider {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://www.googleapis.com/gmail/v1/users/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async authenticate(): Promise<void> {
    try {
      await this.client.get('/profile');
    } catch (error) {
      throw new Error('Failed to authenticate with Gmail');
    }
  }

  async getFolders(): Promise<Folder[]> {
    try {
      const response = await this.client.get('/labels');
      return response.data.labels.map((label: any) => ({
        id: label.id,
        name: label.name,
        type: this.mapLabelType(label.type),
      }));
    } catch (error) {
      throw new Error('Failed to fetch Gmail folders');
    }
  }

  async getMessages(folderId: string, limit: number = 20): Promise<Message[]> {
    try {
      const response = await this.client.get('/messages', {
        params: {
          labelIds: folderId,
          maxResults: limit,
        },
      });

      const messages: Message[] = [];
      for (const item of response.data.messages || []) {
        const msg = await this.client.get(`/messages/${item.id}`, {
          params: { format: 'metadata', metadataHeaders: ['From', 'To', 'Cc', 'Subject', 'Date'] },
        });

        const headers = msg.data.payload.headers;
        messages.push({
          id: msg.data.id,
          threadId: msg.data.threadId,
          from: this.getHeader(headers, 'From'),
          to: [this.getHeader(headers, 'To')],
          cc: this.getHeader(headers, 'Cc') ? [this.getHeader(headers, 'Cc')] : [],
          subject: this.getHeader(headers, 'Subject'),
          snippet: msg.data.snippet,
          date: new Date(parseInt(msg.data.internalDate)),
          isRead: !msg.data.labelIds?.includes('UNREAD'),
          hasAttachments: this.hasAttachments(msg.data.payload),
        });
      }

      return messages;
    } catch (error) {
      throw new Error('Failed to fetch Gmail messages');
    }
  }

  async getMessage(messageId: string): Promise<MessageDetail> {
    try {
      const response = await this.client.get(`/messages/${messageId}`, {
        params: { format: 'full' },
      });

      const msg = response.data;
      const headers = msg.payload.headers;

      const body = this.extractBody(msg.payload);

      return {
        id: msg.id,
        threadId: msg.threadId,
        from: this.getHeader(headers, 'From'),
        to: [this.getHeader(headers, 'To')],
        cc: this.getHeader(headers, 'Cc') ? [this.getHeader(headers, 'Cc')] : [],
        subject: this.getHeader(headers, 'Subject'),
        snippet: msg.snippet,
        date: new Date(parseInt(msg.internalDate)),
        isRead: !msg.labelIds?.includes('UNREAD'),
        hasAttachments: this.hasAttachments(msg.payload),
        body: body.text || '',
        bodyHtml: body.html,
        attachments: this.extractAttachments(msg.payload),
      };
    } catch (error) {
      throw new Error('Failed to fetch Gmail message');
    }
  }

  async sendMessage(to: string, subject: string, body: string, html?: string): Promise<string> {
    try {
      const email = this.createEmail(to, subject, html || body);
      const response = await this.client.post('/messages/send', {
        raw: Buffer.from(email).toString('base64'),
      });

      return response.data.id;
    } catch (error) {
      throw new Error('Failed to send Gmail message');
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      await this.client.post(`/messages/${messageId}/modify`, {
        removeLabelIds: ['UNREAD'],
      });
    } catch (error) {
      throw new Error('Failed to mark Gmail message as read');
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await this.client.delete(`/messages/${messageId}`);
    } catch (error) {
      throw new Error('Failed to delete Gmail message');
    }
  }

  async moveMessage(messageId: string, folderId: string): Promise<void> {
    try {
      await this.client.post(`/messages/${messageId}/modify`, {
        addLabelIds: [folderId],
      });
    } catch (error) {
      throw new Error('Failed to move Gmail message');
    }
  }

  private mapLabelType(type: string): 'inbox' | 'sent' | 'draft' | 'trash' | 'archive' | 'custom' {
    const typeMap: Record<string, any> = {
      INBOX: 'inbox',
      SENT: 'sent',
      DRAFT: 'draft',
      TRASH: 'trash',
      ARCHIVE: 'archive',
    };
    return typeMap[type] || 'custom';
  }

  private getHeader(headers: any[], name: string): string {
    return headers.find(h => h.name === name)?.value || '';
  }

  private hasAttachments(payload: any): boolean {
    return payload.parts?.some((part: any) => part.filename) || false;
  }

  private extractBody(payload: any): { text: string; html?: string } {
    if (payload.mimeType === 'text/plain') {
      return { text: Buffer.from(payload.body.data || '', 'base64').toString() };
    }
    if (payload.mimeType === 'text/html') {
      return { html: Buffer.from(payload.body.data || '', 'base64').toString() };
    }
    if (payload.parts) {
      let text = '';
      let html = '';
      for (const part of payload.parts) {
        const body = this.extractBody(part);
        if (body.text) text = body.text;
        if (body.html) html = body.html;
      }
      return { text, html };
    }
    return { text: '' };
  }

  private extractAttachments(payload: any): Attachment[] {
    const attachments: Attachment[] = [];
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.filename) {
          attachments.push({
            id: part.partId,
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.size || 0,
          });
        }
      }
    }
    return attachments;
  }

  private createEmail(to: string, subject: string, body: string): string {
    return `To: ${to}\nSubject: ${subject}\n\n${body}`;
  }
}
