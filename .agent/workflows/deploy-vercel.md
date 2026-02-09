---
description: Deploy frontend and backend to Vercel
---

# Deploy to Vercel

This workflow automates the deployment of the frontend and backend to Vercel.

## Prerequisites

1. Vercel API token must be set in `.env.local` as `VERCEL_TOKEN`
2. Vercel CLI must be installed globally (`npm i -g vercel`)

## Steps

// turbo
1. **Install Vercel CLI globally** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy Frontend to Vercel**:
```bash
cd frontend && vercel --prod --token $VERCEL_TOKEN
```

3. **Deploy Backend to Vercel**:
```bash
cd backend && vercel --prod --token $VERCEL_TOKEN
```

## Alternative: Deploy Preview (Staging)

For preview deployments (non-production):

```bash
# Frontend preview
cd frontend && vercel --token $VERCEL_TOKEN

# Backend preview
cd backend && vercel --token $VERCEL_TOKEN
```

## Environment Variables

Make sure to configure your environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Any other backend environment variables

## Troubleshooting

If deployment fails:
1. Verify API token is correct: `echo $VERCEL_TOKEN`
2. Check Vercel project configuration: `vercel link`
3. Review build logs in Vercel dashboard
