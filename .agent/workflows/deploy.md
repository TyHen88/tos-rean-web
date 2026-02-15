---
description: how to deploy the Tos-Rean application
---

This workflow outlines the steps to build and deploy the Tos-Rean platform for production.

### Phase 1: Pre-deployment Checks
1. Ensure all environment variables are set in your production environment (e.g., `.env.production`).
   - `DATABASE_URL`
   - `NEXT_PUBLIC_API_URL`
   - Firebase configurations
   - PayWay API keys

// turbo
2. Install fresh dependencies
```bash
npm install --force
```

### Phase 2: Build & Optimization
// turbo
1. Run the production build to verify there are no type errors or linting issues.
```bash
npm run build
```

### Phase 3: Deployment
Depending on your hosting provider, follow the relevant step:

#### Option A: Vercel (Recommended)
// turbo
1. Deploy to Vercel
```bash
npx vercel --prod
```

#### Option B: Standalone VPS (Docker/PM2)
1. Ensure the `output: 'standalone'` is set in `next.config.ts` if using Docker.
2. Restart your process manager:
```bash
pm2 restart tos-rean
```

### Phase 4: Post-deployment
1. Verify the `/login` and `/dashboard` routes are accessible.
2. Run a smoke test on role-based navigation (Admin/Instructor/Student).
3. Check the "Audit Logs" in the Admin panel to ensure the system is tracking actions correctly.
