import { pgTable, serial, text, timestamp, boolean, integer, varchar, enum as pgEnum, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Email accounts (Gmail, Outlook, IMAP)
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  provider: pgEnum('provider', ['gmail', 'outlook', 'imap'])('provider').notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  emailAddress: varchar('email_address', { length: 255 }).notNull(),
  status: pgEnum('status', ['connected', 'backfill', 'streaming', 'polling', 'error'])('status').notNull().default('connected'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Encrypted credentials
export const credentials = pgTable('credentials', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().references(() => accounts.id),
  encryptedAccessToken: text('encrypted_access_token'),
  encryptedRefreshToken: text('encrypted_refresh_token'),
  expiresAt: timestamp('expires_at'),
  encryptedImapPass: text('encrypted_imap_pass'),
  meta: jsonb('meta'),
});

// Folders/Labels
export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().references(() => accounts.id),
  providerFolderId: varchar('provider_folder_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
});

// Messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().references(() => accounts.id),
  providerMsgId: varchar('provider_msg_id', { length: 255 }).notNull(),
  threadId: varchar('thread_id', { length: 255 }),
  folderId: integer('folder_id').references(() => folders.id),
  subject: varchar('subject', { length: 500 }),
  from: varchar('from', { length: 255 }),
  to: text('to'),
  cc: text('cc'),
  date: timestamp('date'),
  snippet: text('snippet'),
  hasAttachments: boolean('has_attachments').default(false),
  isRead: boolean('is_read').default(false),
  size: integer('size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueMsg: uniqueIndex('unique_msg').on(table.accountId, table.providerMsgId),
}));

// Message bodies (HTML/Text)
export const bodies = pgTable('bodies', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id').notNull().references(() => messages.id),
  bodyHtml: text('body_html'),
  bodyText: text('body_text'),
});

// Attachments
export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id').notNull().references(() => messages.id),
  filename: varchar('filename', { length: 255 }).notNull(),
  mime: varchar('mime', { length: 100 }),
  size: integer('size'),
  storageUrl: text('storage_url'),
});

// Background jobs
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  status: pgEnum('job_status', ['pending', 'processing', 'completed', 'failed'])('status').notNull().default('pending'),
  attempts: integer('attempts').default(0),
  lastError: text('last_error'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  credentials: many(credentials),
  folders: many(folders),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  account: one(accounts, { fields: [messages.accountId], references: [accounts.id] }),
  folder: one(folders, { fields: [messages.folderId], references: [folders.id] }),
  body: one(bodies),
  attachments: many(attachments),
}));
