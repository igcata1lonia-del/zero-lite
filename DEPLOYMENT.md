# Zero Lite Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm

### Quick Start

1. **Clone and install**:
   ```bash
   git clone <repo>
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

4. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Database: localhost:5432

### Development Commands

```bash
pnpm dev          # Start all services
pnpm build        # Build all packages
pnpm test         # Run tests
pnpm lint         # Lint code
```

## Production Deployment

### Docker Compose (Self-Hosted)

1. **Build images**:
   ```bash
   docker build -f Dockerfile.api -t zero-lite-api:latest .
   docker build -f Dockerfile.web -t zero-lite-web:latest .
   ```

2. **Run with production config**:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Set up SSL/TLS**:
   - Use Nginx reverse proxy with Let's Encrypt
   - Update environment variables for production URLs

### Vercel Deployment (Frontend Only)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Import the `apps/web` directory
   - Set environment variables (NEXT_PUBLIC_API_URL)
   - Deploy

3. **Configure API URL**:
   - Point `NEXT_PUBLIC_API_URL` to your API server

## Environment Variables

See `.env.example` for all available options:

- **APP_URL**: Application URL
- **DATABASE_URL**: PostgreSQL connection string
- **REDIS_URL**: Redis connection string
- **GMAIL_CLIENT_ID/SECRET**: Gmail OAuth credentials
- **MS_CLIENT_ID/SECRET**: Microsoft OAuth credentials
- **ENCRYPTION_KEY**: Secret key for encrypting credentials

## Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Sync Status
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3001/sync/status
```

## Backup & Restore

### Database Backup
```bash
docker exec zero-lite-db pg_dump -U zero_lite zero_lite > backup.sql
```

### Database Restore
```bash
docker exec -i zero-lite-db psql -U zero_lite zero_lite < backup.sql
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `docker ps | grep postgres`
- View logs: `docker logs zero-lite-db`

### API Not Starting
- Check logs: `docker logs zero-lite-api`
- Verify environment variables are set
- Ensure port 3001 is available

### Frontend Not Loading
- Check browser console for errors
- Verify NEXT_PUBLIC_API_URL is correct
- Check API is accessible from frontend

## Support

For issues, check the GitHub repository or contact support.
