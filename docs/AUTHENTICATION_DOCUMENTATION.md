# TosRean Authentication System Documentation

## Overview
This document provides a comprehensive guide to the authentication system for the TosRean e-learning platform, covering both frontend and backend implementations.

## Authentication Flows

### 1. Google Sign-In/Sign-Up (Third-Party Firebase)
**Use Case**: User wants to authenticate using their Google account

**Flow**:
1. **Frontend** (`lib/auth-context.tsx` → `loginWithGoogle()`):
   - Calls `signInWithPopup(auth, GoogleAuthProvider)`
   - Retrieves Firebase ID Token from authenticated user
   - Sends ID Token to backend via `POST /api/auth/sync`

2. **Backend** (`src/controllers/auth.controller.ts` → `sync()`):
   - Verifies Firebase ID Token using Firebase Admin SDK
   - Extracts user data (uid, email, name, picture) from decoded token
   - **Upserts** user in PostgreSQL database:
     - If user exists: Updates `firebaseUid`, `name`, `avatar`, `lastLoginAt`
     - If new user: Creates user with `firebaseUid`, email, name, avatar, role=STUDENT
   - Generates internal JWT token
   - Returns user data + JWT token

3. **Frontend**:
   - Stores JWT token in `localStorage` as `tosrean_token`
   - Stores user object in `localStorage` as `tosrean_user`
   - Updates auth context state
   - Redirects to dashboard

**Key Points**:
- User ID is saved in **both** Firebase and PostgreSQL database
- Firebase UID is stored in `firebaseUid` field
- Subsequent API calls use JWT token (not Firebase token)

---

### 2. Manual Sign-Up (System Registration)
**Use Case**: User wants to create an account with email/password (no Google)

**Current Implementation (INCORRECT)**:
- Frontend calls Firebase `createUserWithEmailAndPassword()`
- This creates user in Firebase (should NOT happen for manual signup)

**Correct Implementation (FIXED)**:
1. **Frontend** (`lib/auth-context.tsx` → `register()`):
   - Collects email, password, name, role
   - Sends directly to backend via `POST /api/auth/register`
   - **NO Firebase call**

2. **Backend** (`src/controllers/auth.controller.ts` → `register()`):
   - Validates email doesn't already exist
   - Hashes password using bcrypt
   - Creates user in PostgreSQL database:
     - `email`, `passwordHash`, `name`, `role`
     - `firebaseUid` = NULL (no Firebase involvement)
   - Generates internal JWT token
   - Returns user data + JWT token

3. **Frontend**:
   - Stores JWT token and user data in localStorage
   - Updates auth context
   - Redirects to dashboard

**Key Points**:
- User is **ONLY** in PostgreSQL database
- No Firebase authentication involved
- Password is hashed and stored in database
- `firebaseUid` field remains NULL

---

### 3. Manual Login (System Login)
**Use Case**: User wants to login with email/password (previously registered manually)

**Current Implementation (INCORRECT)**:
- Frontend calls Firebase `signInWithEmailAndPassword()`
- This requires user to exist in Firebase (fails for manual signups)

**Correct Implementation (FIXED)**:
1. **Frontend** (`lib/auth-context.tsx` → `login()`):
   - Collects email, password
   - Sends directly to backend via `POST /api/auth/login`
   - **NO Firebase call**

2. **Backend** (`src/controllers/auth.controller.ts` → `login()`):
   - Finds user by email in PostgreSQL
   - Compares password with stored hash using bcrypt
   - If valid:
     - Generates internal JWT token
     - Returns user data + JWT token
   - If invalid:
     - Returns 400 error "Invalid credentials"

3. **Frontend**:
   - Stores JWT token and user data in localStorage
   - Updates auth context
   - Redirects to dashboard

**Key Points**:
- Authentication happens **ONLY** against PostgreSQL database
- No Firebase involvement
- Password verification using bcrypt

---

## Database Schema

### User Model (PostgreSQL)
```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  firebaseUid     String?   @unique          // NULL for manual signups
  passwordHash    String?                    // NULL for Google signups
  name            String
  role            Role      @default(STUDENT)
  avatar          String?
  bio             String?
  isActive        Boolean   @default(true)
  isEmailVerified Boolean   @default(false)
  lastLoginAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Role {
  ADMIN
  INSTRUCTOR
  STUDENT
}
```

**Key Fields**:
- `firebaseUid`: Set for Google sign-ins, NULL for manual registrations
- `passwordHash`: Set for manual registrations, NULL for Google sign-ins
- `email`: Unique identifier for all users

---

## API Endpoints

### POST /api/auth/sync
**Purpose**: Sync Firebase authenticated user with backend database

**Request**:
```json
{
  "idToken": "firebase_id_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "STUDENT",
      "avatar": "https://..."
    },
    "token": "jwt_token_here"
  }
}
```

**Used By**: Google Sign-In/Sign-Up

---

### POST /api/auth/register
**Purpose**: Register new user with email/password (no Firebase)

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "STUDENT"  // Optional, defaults to STUDENT
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "STUDENT",
      "avatar": null
    },
    "token": "jwt_token_here"
  }
}
```

**Used By**: Manual Sign-Up

---

### POST /api/auth/login
**Purpose**: Login existing user with email/password

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "STUDENT",
      "firebaseUid": null
    },
    "token": "jwt_token_here"
  }
}
```

**Used By**: Manual Login

---

### GET /api/auth/me
**Purpose**: Get current authenticated user details

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "STUDENT",
    "avatar": null,
    "bio": null,
    "createdAt": "2026-02-15T04:45:07.650Z",
    "updatedAt": "2026-02-15T04:45:07.650Z"
  }
}
```

**Used By**: Session validation, profile fetching

---

## Frontend Implementation

### Auth Context (`lib/auth-context.tsx`)

**Key Functions**:

1. **`loginWithGoogle()`**:
   - Uses Firebase `signInWithPopup()`
   - Calls `/api/auth/sync` with Firebase ID token
   - Stores JWT and user data

2. **`register(email, password, name, role)`**:
   - **FIXED**: Calls `/api/auth/register` directly
   - No Firebase involvement
   - Stores JWT and user data

3. **`login(email, password)`**:
   - **FIXED**: Calls `/api/auth/login` directly
   - No Firebase involvement
   - Stores JWT and user data

4. **`logout()`**:
   - Clears localStorage
   - Resets auth state
   - Signs out from Firebase (if applicable)

---

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt rounds = 10
- Never stored in plain text
- Never returned in API responses

### JWT Tokens
- Signed with `JWT_SECRET` environment variable
- Expiration: 7 days
- Stored in localStorage (client-side)
- Sent in `Authorization: Bearer <token>` header

### Firebase Security
- Firebase ID tokens are verified using Firebase Admin SDK
- Tokens are single-use and expire
- Backend validates token signature and expiration

### Database Security
- Email field is unique and indexed
- FirebaseUid is unique and indexed (when present)
- Passwords are hashed before storage

---

## Testing Scenarios

### Test 1: Google Sign-Up (New User)
1. Click "Sign in with Google" on register page
2. Select Google account
3. Backend creates new user with `firebaseUid` and `passwordHash=NULL`
4. User redirected to dashboard
5. Verify user exists in database with Firebase UID

### Test 2: Google Sign-In (Existing User)
1. Click "Sign in with Google" on login page
2. Select same Google account
3. Backend updates `lastLoginAt` for existing user
4. User redirected to dashboard

### Test 3: Manual Sign-Up
1. Fill registration form (email, password, name, role)
2. Submit form
3. Backend creates user with `passwordHash` and `firebaseUid=NULL`
4. User redirected to dashboard
5. Verify user exists in database without Firebase UID

### Test 4: Manual Login
1. Fill login form (email, password)
2. Submit form
3. Backend verifies password against hash
4. User redirected to dashboard

### Test 5: Session Persistence
1. Login with any method
2. Refresh page
3. Auth context loads user from localStorage
4. Validates token with `/api/auth/me`
5. User remains authenticated

---

## Error Handling

### Common Errors

**AUTH_001**: `idToken is required`
- Missing Firebase ID token in sync request

**AUTH_002**: `Invalid Firebase token`
- Firebase token verification failed

**AUTH_003**: `Decoding Firebase ID token failed`
- Malformed or missing token

**AUTH_004**: `Firebase ID token has expired`
- Token needs refresh

**AUTH_005**: `Invalid credentials`
- Wrong email or password for manual login

**AUTH_006**: `User already exists`
- Email already registered

**USER_001**: `User not found`
- User ID in JWT doesn't exist in database

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"
```

### Frontend (.env.local)
```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3300/api"
```

---

## Summary

### Google Sign-In/Sign-Up
✅ User authenticated via Firebase  
✅ User ID saved to **both** Firebase and PostgreSQL  
✅ Uses `/api/auth/sync` endpoint  
✅ `firebaseUid` field populated  
✅ `passwordHash` field is NULL  

### Manual Sign-Up
✅ User registered directly in PostgreSQL  
✅ **NO** Firebase involvement  
✅ Uses `/api/auth/register` endpoint  
✅ `passwordHash` field populated  
✅ `firebaseUid` field is NULL  

### Manual Login
✅ User authenticated against PostgreSQL  
✅ **NO** Firebase involvement  
✅ Uses `/api/auth/login` endpoint  
✅ Password verified with bcrypt  

### All Methods
✅ Return JWT token for subsequent API calls  
✅ Store token and user data in localStorage  
✅ Use JWT for authorization (not Firebase token)  
