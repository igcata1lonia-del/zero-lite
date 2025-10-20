# Zero Lite - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- pnpm (for local development)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/zero-lite.git
cd zero-lite

# 2. Copy environment template
cp .env.example .env.local

# 3. Start all services
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# API: http://localhost:3001
# Database: localhost:5432
```

### Option 2: Local Development

```bash
# 1. Clone and install
git clone https://github.com/yourusername/zero-lite.git
cd zero-lite
pnpm install

# 2. Set up environment
cp .env.example .env.local

# 3. Start development servers
pnpm dev

# 4. Open in browser
# http://localhost:3000
```

## First Steps

### 1. Register an Account
- Go to http://localhost:3000/auth
- Click "Register"
- Enter email and password
- Click "Register"

### 2. Connect an Email Account
- Go to Dashboard
- Click "Add Email Account"
- Select provider (Gmail, Outlook, or IMAP)
- Follow OAuth flow or enter IMAP credentials

### 3. View Your Inbox
- Click "Inbox" in the sidebar
- Your unified inbox will load
- Click a message to view details

### 4. Send an Email
- Click "Compose" in the sidebar
- Select the account to send from
- Enter recipient, subject, and message
- Click "Send"

## Configuration

### Gmail Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Desktop app)
5. Copy Client ID and Secret to `.env.local`:
   ```
   GMAIL_CLIENT_ID=your-client-id
   GMAIL_CLIENT_SECRET=your-client-secret
   ```

### Outlook Setup
1. Go to [Azure Portal](https://portal.azure.com)
2. Register a new application
3. Create a client secret
4. Add redirect URI: `http://localhost:3000/auth/outlook/callback`
5. Copy credentials to `.env.local`:
   ```
   MS_CLIENT_ID=your-client-id
   MS_CLIENT_SECRET=your-client-secret
   ```

### IMAP Setup (ProtonMail, Gmail, etc.)
- Use your email provider's IMAP settings
- For Gmail: Generate an [App Password](https://myaccount.google.com/apppasswords)
- For ProtonMail: Use Proton Bridge

## Useful Commands

```bash
# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Run tests
pnpm test

# Lint code
pnpm lint

# Build for production
pnpm build
```

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env.local
# Or kill the process using the port
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### API Not Responding
```bash
# Check API logs
docker-compose logs api

# Test health endpoint
curl http://localhost:3001/health
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs web

# Clear browser cache and reload
# Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
```

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Review [PROJECT_STATUS.md](PROJECT_STATUS.md) for feature status
- Open an issue on GitHub for bugs or feature requests

## Support

- 📖 Documentation: See README.md
- 🐛 Bug Reports: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@zero-lite.local

Happy emailing! 📧
