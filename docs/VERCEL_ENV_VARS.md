# Vercel Environment Variables Configuration

This file documents the required environment variables for the Tos-Rean platform deployment on Vercel.

## 🔧 Required Environment Variables

Add these to your Vercel project settings under **Settings > Environment Variables**:

### Backend API Configuration
```bash
NEXT_PUBLIC_API_URL=https://tos-reans-api.onrender.com/api
```

### Firebase Admin SDK (Server-side)
```bash
FIREBASE_PROJECT_ID=cambonexthub
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cambonexthub.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Firebase Client SDK (Client-side)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBZdkzC7_Un0rHLa-b2dvoEWL3nuGasc9E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cambonexthub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cambonexthub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cambonexthub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=855492999328
NEXT_PUBLIC_FIREBASE_APP_ID=1:855492999328:web:761f22df590dbd0db2b1c5
```

## 📝 Important Notes

1. **NEXT_PUBLIC_* Variables**: These are exposed to the browser and should NOT contain secrets.
2. **Server-only Variables**: Variables without `NEXT_PUBLIC_` prefix are only accessible on the server.
3. **FIREBASE_PRIVATE_KEY**: Must include literal `\n` characters for line breaks (not actual newlines).
4. **Environment Scope**: Set variables for Production, Preview, and Development as needed.

## 🚀 How to Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each variable with its value
4. Select the appropriate environments (Production/Preview/Development)
5. Click **Save**
6. Redeploy your project for changes to take effect

## 🔒 Security Best Practices

- Never commit `.env` files to Git (already in `.gitignore`)
- Rotate Firebase keys if they are ever exposed
- Use Vercel's encrypted environment variable storage
- Limit access to production environment variables
