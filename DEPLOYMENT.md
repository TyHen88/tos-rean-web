# GymMine PWA - Vercel Deployment Guide

## Pre-Deployment Checklist

✅ **Project Structure Verified**
- Next.js 15.2.4 with React 19
- PWA configuration with manifest.json
- Service Worker (sw.js) for offline functionality
- Tailwind CSS with proper configuration
- TypeScript configuration

✅ **Vercel Configuration**
- `vercel.json` created with proper headers for PWA
- Service Worker caching headers configured
- Static asset caching optimized

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from your project directory
```bash
# For production deployment
vercel --prod

# For preview deployment (optional)
vercel
```

### 4. Alternative: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure settings
5. Click "Deploy"

## Post-Deployment Configuration

### 1. Verify PWA Functionality
- [ ] Test app installation on mobile devices
- [ ] Verify offline functionality works
- [ ] Check service worker registration in browser dev tools
- [ ] Test manifest.json is accessible at `/manifest.json`

### 2. Domain Configuration (Optional)
- [ ] Configure custom domain in Vercel dashboard
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable if using custom domain

### 3. Analytics (Optional)
- [ ] Enable Vercel Analytics in project settings
- [ ] Verify analytics tracking is working

## Environment Variables

No environment variables are currently required, but you can add them in the Vercel dashboard under:
**Project Settings > Environment Variables**

## PWA-Specific Considerations

### Service Worker
- Service Worker is configured to cache main routes
- Cache version: `gymmine-v1`
- Automatically updates when new content is deployed

### Manifest
- App name: "GymMine - Your Personal Gym Manager"
- Short name: "GymMine"
- Theme color: #0ea5e9
- Icons: 192x192 and 512x512 available

### Offline Support
- Main routes are cached for offline access
- Offline indicator component included
- PWA install prompt component included

## Troubleshooting

### Common Issues

1. **Service Worker not updating**
   - Clear browser cache
   - Check cache version in sw.js

2. **PWA not installable**
   - Verify manifest.json is accessible
   - Check HTTPS is enabled (Vercel provides this automatically)
   - Ensure service worker is registered

3. **Build errors**
   - Check TypeScript errors are resolved
   - Verify all dependencies are installed
   - Run `npm run build` locally to test

### Performance Optimization
- Images are unoptimized in next.config.mjs for PWA compatibility
- Static assets are cached with appropriate headers
- Service Worker provides offline caching

## Monitoring

After deployment, monitor:
- [ ] Build logs in Vercel dashboard
- [ ] Function logs for any runtime errors
- [ ] Analytics data (if enabled)
- [ ] PWA installation rates

## Rollback Plan

If issues occur:
1. Use Vercel's deployment history to rollback
2. Or redeploy from a previous commit
3. Check Vercel dashboard for deployment status

---

**Ready for deployment!** 🚀

Your GymMine PWA is configured and ready for Vercel deployment.
