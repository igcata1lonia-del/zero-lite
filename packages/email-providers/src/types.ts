export interface EmailProvider {
  authenticate(): Promise<void>;
  getFolders(): Promise<Folder[]>;
  getMessages(folderId: string, limit?: number): Promise<Message[]>;
  getMessage(messageId: string): Promise<MessageDetail>;
  sendMessage(to: string, subject: string, body: string, html?: string): Promise<string>;
  markAsRead(messageId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  moveMessage(messageId: string, folderId: string): Promise<void>;
}

export interface Folder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'draft' | 'trash' | 'archive' | 'custom';
}

export interface Message {
  id: string;
  threadId?: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  snippet: string;
  date: Date;
  isRead: boolean;
  hasAttachments: boolean;
}

export interface MessageDetail extends Message {
  body: string;
  bodyHtml?: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: Buffer;
}
