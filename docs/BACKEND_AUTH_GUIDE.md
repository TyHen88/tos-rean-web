# Backend Authentication Implementation Guide

## Overview
This document provides implementation details for the backend authentication system of the TosRean e-learning platform.

## Architecture

### Technology Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: 
  - Firebase Admin SDK (for Google Sign-In verification)
  - bcrypt (for password hashing)
  - jsonwebtoken (for session management)

---

## File Structure

```
src/
├── controllers/
│   └── auth.controller.ts       # Authentication business logic
├── routes/
│   └── auth.routes.ts           # API route definitions
├── middleware/
│   └── auth.middleware.ts       # JWT verification & role checks
└── utils/
    ├── firebase.ts              # Firebase Admin SDK initialization
    ├── prisma.ts                # Prisma client singleton
    ├── ApiResponse.ts           # Standardized API responses
    └── AppError.ts              # Custom error handling
```

---

## Controllers (`src/controllers/auth.controller.ts`)

### 1. sync() - Firebase Google Sign-In Handler

**Purpose**: Verify Firebase ID token and sync user to PostgreSQL database

**Flow**:
```typescript
1. Extract idToken from request body
2. Verify token using Firebase Admin SDK
3. Decode token to get user data (uid, email, name, picture)
4. Upsert user in database:
   - If exists: Update firebaseUid, name, avatar, lastLoginAt
   - If new: Create with firebaseUid, email, name, avatar, role=STUDENT
5. Generate JWT token
6. Return user + token
```

**Implementation**:
```typescript
export const sync = async (req: Request, res: Response, next: NextFunction) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError('idToken is required', 400, 'AUTH_001'));
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Upsert user in database
    let user = await prisma.user.upsert({
      where: { email: email || '' },
      update: {
        firebaseUid: uid,
        name: name || 'User',
        avatar: picture,
        lastLoginAt: new Date(),
        isActive: true,
      },
      create: {
        email: email || '',
        firebaseUid: uid,
        name: name || 'User',
        avatar: picture,
        role: 'STUDENT',
        lastLoginAt: new Date(),
        isActive: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );

    return ApiResponse.success(res, { user, token }, 'Sync successful');
  } catch (error: any) {
    // Handle Firebase errors
    let message = 'Invalid Firebase token';
    let code = 'AUTH_002';
    
    if (error.code === 'auth/argument-error') {
      message = 'Decoding Firebase ID token failed. Token is malformed or missing.';
      code = 'AUTH_003';
    } else if (error.code === 'auth/id-token-expired') {
      message = 'Firebase ID token has expired. Please refresh the token on the frontend.';
      code = 'AUTH_004';
    }

    return next(new AppError(message, 401, code));
  }
};
```

**Key Points**:
- Uses `upsert` to handle both new and existing users
- Stores Firebase UID in `firebaseUid` field
- `passwordHash` remains NULL for Google sign-ins
- Updates `lastLoginAt` on every login

---

### 2. register() - Manual Registration Handler

**Purpose**: Create new user with email/password (NO Firebase)

**Flow**:
```typescript
1. Extract email, password, name, role from request body
2. Check if user already exists
3. Hash password using bcrypt
4. Create user in database with passwordHash
5. Generate JWT token
6. Return user + token (exclude passwordHash)
```

**Implementation**:
```typescript
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('User already exists', 400, 'AUTH_006'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: role || 'STUDENT',
      },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        avatar: true 
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );

    return ApiResponse.success(res, { user, token }, 'User created successfully', 201);
  } catch (error) {
    return next(error);
  }
};
```

**Key Points**:
- Password is hashed with bcrypt (salt rounds = 10)
- `firebaseUid` remains NULL
- Never returns `passwordHash` in response
- Uses `select` to exclude sensitive fields

---

### 3. login() - Manual Login Handler

**Purpose**: Authenticate user with email/password

**Flow**:
```typescript
1. Extract email, password from request body
2. Find user by email
3. Compare password with stored hash
4. If valid: Generate JWT and return user + token
5. If invalid: Return error
```

**Implementation**:
```typescript
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('Invalid credentials', 400, 'AUTH_005'));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 400, 'AUTH_005'));
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return ApiResponse.success(res, { user: userWithoutPassword, token }, 'Logged in successfully');
  } catch (error) {
    return next(error);
  }
};
```

**Key Points**:
- Returns same error message for both "user not found" and "wrong password" (security best practice)
- Uses bcrypt.compare for password verification
- Excludes `passwordHash` from response

---

### 4. getMe() - Get Current User

**Purpose**: Return current authenticated user's profile

**Flow**:
```typescript
1. Extract user ID from JWT (set by authMiddleware)
2. Fetch user from database
3. Return user profile (exclude passwordHash)
```

**Implementation**:
```typescript
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      return next(new AppError('User not found', 404, 'USER_001'));
    }

    return ApiResponse.success(res, user);
  } catch (error) {
    return next(error);
  }
};
```

---

## Middleware (`src/middleware/auth.middleware.ts`)

### authMiddleware - JWT Verification

**Purpose**: Verify JWT token and attach user to request

**Implementation**:
```typescript
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token, user not found' 
      });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};
```

**Usage**:
```typescript
router.get('/me', authMiddleware, getMe);
```

---

### adminMiddleware - Admin Role Check

**Purpose**: Ensure user has ADMIN role

**Implementation**:
```typescript
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Requires Admin role' 
    });
  }
  next();
};
```

**Usage**:
```typescript
router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsers);
```

---

### instructorMiddleware - Instructor/Admin Role Check

**Purpose**: Ensure user has INSTRUCTOR or ADMIN role

**Implementation**:
```typescript
export const instructorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Requires Instructor role' 
    });
  }
  next();
};
```

---

## Routes (`src/routes/auth.routes.ts`)

```typescript
import { Router } from 'express';
import { register, login, getMe, sync } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Firebase Google Sign-In
router.post('/sync', sync);

// Manual Registration
router.post('/register', register);

// Manual Login
router.post('/login', login);

// Get Current User (Protected)
router.get('/me', authMiddleware, getMe);

export default router;
```

---

## Utilities

### Firebase Admin SDK (`src/utils/firebase.ts`)

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

export default admin;
```

---

### Prisma Client (`src/utils/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };
```

---

### API Response (`src/utils/ApiResponse.ts`)

```typescript
export class ApiResponse {
  static success(res: Response, data: any, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      code: 'SUCCESS',
      data,
    });
  }
}
```

---

### App Error (`src/utils/AppError.ts`)

```typescript
export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

---

## Security Best Practices

### Password Security
1. **Hashing**: bcrypt with 10 salt rounds
2. **Never log passwords**: Avoid logging request bodies containing passwords
3. **Never return passwords**: Always exclude `passwordHash` from responses
4. **Minimum length**: Enforce on frontend (6+ characters)

### JWT Security
1. **Secret**: Use strong, random JWT_SECRET (stored in .env)
2. **Expiration**: 7 days (configurable)
3. **Payload**: Only store user ID and role (minimal data)
4. **Verification**: Always verify signature and expiration

### Firebase Security
1. **Token verification**: Always verify tokens server-side
2. **Error handling**: Don't expose internal Firebase errors
3. **Token expiration**: Handle expired tokens gracefully

### Database Security
1. **Unique constraints**: Email and firebaseUid are unique
2. **Indexes**: Email and firebaseUid are indexed for performance
3. **Cascading deletes**: User deletion cascades to related records

---

## Error Codes Reference

| Code | Message | Status | Description |
|------|---------|--------|-------------|
| AUTH_001 | idToken is required | 400 | Missing Firebase ID token |
| AUTH_002 | Invalid Firebase token | 401 | Firebase token verification failed |
| AUTH_003 | Decoding Firebase ID token failed | 401 | Malformed Firebase token |
| AUTH_004 | Firebase ID token has expired | 401 | Expired Firebase token |
| AUTH_005 | Invalid credentials | 400 | Wrong email or password |
| AUTH_006 | User already exists | 400 | Email already registered |
| USER_001 | User not found | 404 | User ID doesn't exist |

---

## Testing

### Test Manual Registration
```bash
curl -X POST http://localhost:3300/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "STUDENT"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "code": "SUCCESS",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "name": "Test User",
      "role": "STUDENT",
      "avatar": null
    },
    "token": "jwt_token_here"
  }
}
```

---

### Test Manual Login
```bash
curl -X POST http://localhost:3300/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "code": "SUCCESS",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "name": "Test User",
      "role": "STUDENT",
      "firebaseUid": null
    },
    "token": "jwt_token_here"
  }
}
```

---

### Test Get Current User
```bash
curl -X GET http://localhost:3300/api/auth/me \
  -H "Authorization: Bearer <jwt_token>"
```

**Expected Response**:
```json
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "role": "STUDENT",
    "avatar": null,
    "bio": null,
    "createdAt": "2026-02-15T04:45:07.650Z",
    "updatedAt": "2026-02-15T04:45:07.650Z"
  }
}
```

---

## Database Queries

### Check User Type
```sql
-- Google sign-in users
SELECT * FROM "User" WHERE "firebaseUid" IS NOT NULL;

-- Manual registration users
SELECT * FROM "User" WHERE "passwordHash" IS NOT NULL;

-- All users with their auth method
SELECT 
  id, 
  email, 
  name, 
  role,
  CASE 
    WHEN "firebaseUid" IS NOT NULL THEN 'Google'
    WHEN "passwordHash" IS NOT NULL THEN 'Manual'
    ELSE 'Unknown'
  END as auth_method
FROM "User";
```

---

## Troubleshooting

### Issue: "User already exists" on registration
**Cause**: Email is already registered  
**Solution**: Use login endpoint or different email

### Issue: "Invalid credentials" on login
**Cause**: Wrong email or password  
**Solution**: Verify credentials or use password reset

### Issue: "Invalid Firebase token"
**Cause**: Firebase token expired or malformed  
**Solution**: Refresh token on frontend and retry

### Issue: "No token, authorization denied"
**Cause**: Missing or invalid Authorization header  
**Solution**: Include `Authorization: Bearer <token>` header

---

## Summary

### Authentication Methods

| Method | Firebase | Database | Password | FirebaseUID |
|--------|----------|----------|----------|-------------|
| Google Sign-In | ✅ Verify | ✅ Upsert | ❌ NULL | ✅ Set |
| Manual Sign-Up | ❌ None | ✅ Create | ✅ Hashed | ❌ NULL |
| Manual Login | ❌ None | ✅ Query | ✅ Verify | ❌ NULL |

### Security Layers
1. **Firebase Admin SDK**: Verifies Google sign-in tokens
2. **bcrypt**: Hashes and verifies passwords
3. **JWT**: Manages user sessions
4. **Middleware**: Protects routes and checks roles
5. **Prisma**: Prevents SQL injection
