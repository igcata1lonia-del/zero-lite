# Zero Lite - Unified Email Client

A self-hosted, unified email client supporting Gmail, Outlook, and ProtonMail with a modern web interface.

## Features

- **Unified Inbox**: Combine emails from multiple accounts (Gmail, Outlook, IMAP/Proton)
- **Email Operations**: Read, compose, reply, forward, and manage attachments
- **Search & Filters**: Server-side search with filters (from:, subject:, has:attachment, etc.)
- **Sync Engine**: Reliable syncing with webhook support and polling fallback
- **Responsive UI**: Modern, clean interface built with Next.js and TailwindCSS
- **Scalable**: Handles 500+ connected accounts with background job processing

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Node.js (Express), PostgreSQL, Redis
- **Email**: Gmail API, Microsoft Graph, IMAP/SMTP
- **Infrastructure**: Docker Compose, GitHub Actions

## Project Structure

```
zero-lite/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express backend
│   └── worker/       # Background job processor
├── packages/
│   ├── db/           # Database schema (Drizzle ORM)
│   ├── ui/           # Shared UI components
│   └── email-providers/  # Email provider integrations
└── docker-compose.yml    # Local development stack
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose (for full stack)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd zero-lite
   pnpm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

4. **Access the app**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Database: localhost:5432

### Development Commands

```bash
pnpm dev          # Start all services in dev mode
pnpm build        # Build all packages
pnpm test         # Run tests
pnpm lint         # Lint code
```

## Configuration

See `.env.example` for all available configuration options:

- **Gmail**: OAuth 2.0 credentials
- **Outlook**: Microsoft OAuth credentials
- **IMAP**: Generic IMAP/SMTP settings
- **Database**: PostgreSQL connection string
- **Redis**: Redis connection for job queue

## API Endpoints

- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /accounts/connect` - Connect email account
- `GET /accounts` - List connected accounts
- `GET /messages` - Get unified inbox
- `POST /messages/send` - Send email

## Deployment

### Docker Compose (Self-hosted)

```bash
docker-compose -f docker-compose.yml up -d
```

### Vercel (Frontend only)

```bash
pnpm build
vercel deploy
```

## Testing

```bash
pnpm test              # Run all tests
pnpm test:unit         # Unit tests
pnpm test:integration  # Integration tests
pnpm test:e2e          # End-to-end tests
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
