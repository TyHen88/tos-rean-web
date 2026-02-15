# Authentication Flow Diagrams

## Overview
This document provides visual representations of all authentication flows in the TosRean e-learning platform.

---

## Flow 1: Google Sign-In/Sign-Up (Firebase + Database)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GOOGLE SIGN-IN FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

User                Frontend              Firebase            Backend              Database
  │                    │                     │                   │                    │
  │  Click "Google"    │                     │                   │                    │
  ├───────────────────>│                     │                   │                    │
  │                    │                     │                   │                    │
  │                    │  signInWithPopup()  │                   │                    │
  │                    ├────────────────────>│                   │                    │
  │                    │                     │                   │                    │
  │  Google Login      │                     │                   │                    │
  │<──────────────────>│                     │                   │                    │
  │                    │                     │                   │                    │
  │                    │  Firebase User +    │                   │                    │
  │                    │  ID Token           │                   │                    │
  │                    │<────────────────────┤                   │                    │
  │                    │                     │                   │                    │
  │                    │  POST /auth/sync    │                   │                    │
  │                    │  { idToken }        │                   │                    │
  │                    ├─────────────────────┴──────────────────>│                    │
  │                    │                                          │                    │
  │                    │                                          │  Verify Token      │
  │                    │                                          │  (Admin SDK)       │
  │                    │                                          │                    │
  │                    │                                          │  UPSERT User       │
  │                    │                                          ├───────────────────>│
  │                    │                                          │  - firebaseUid: uid│
  │                    │                                          │  - email           │
  │                    │                                          │  - name            │
  │                    │                                          │  - avatar          │
  │                    │                                          │  - passwordHash: NULL
  │                    │                                          │                    │
  │                    │                                          │  User Record       │
  │                    │                                          │<───────────────────┤
  │                    │                                          │                    │
  │                    │                                          │  Generate JWT      │
  │                    │                                          │                    │
  │                    │  { user, token }                         │                    │
  │                    │<─────────────────────────────────────────┤                    │
  │                    │                                          │                    │
  │                    │  Store in localStorage:                  │                    │
  │                    │  - tosrean_token                         │                    │
  │                    │  - tosrean_user                          │                    │
  │                    │                                          │                    │
  │  Redirect to       │                                          │                    │
  │  Dashboard         │                                          │                    │
  │<───────────────────┤                                          │                    │
  │                    │                                          │                    │

Result in Database:
┌──────────────────────────────────────────────────────────────┐
│ User Record (PostgreSQL)                                     │
├──────────────────────────────────────────────────────────────┤
│ id:           "uuid-123"                                     │
│ email:        "user@gmail.com"                               │
│ firebaseUid:  "firebase-uid-abc123"  ← SET                   │
│ passwordHash: NULL                   ← NULL (Google user)    │
│ name:         "John Doe"                                     │
│ role:         "STUDENT"                                      │
│ avatar:       "https://googleusercontent.com/..."            │
└──────────────────────────────────────────────────────────────┘
```

---

## Flow 2: Manual Sign-Up (Database Only)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MANUAL SIGN-UP FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

User                Frontend              Backend              Database
  │                    │                     │                    │
  │  Fill Form:        │                     │                    │
  │  - Email           │                     │                    │
  │  - Password        │                     │                    │
  │  - Name            │                     │                    │
  │  - Role            │                     │                    │
  │                    │                     │                    │
  │  Click "Sign Up"   │                     │                    │
  ├───────────────────>│                     │                    │
  │                    │                     │                    │
  │                    │  POST /auth/register│                    │
  │                    │  {                  │                    │
  │                    │    email,           │                    │
  │                    │    password,        │                    │
  │                    │    name,            │                    │
  │                    │    role             │                    │
  │                    │  }                  │                    │
  │                    ├────────────────────>│                    │
  │                    │                     │                    │
  │                    │                     │  Check if email    │
  │                    │                     │  already exists    │
  │                    │                     ├───────────────────>│
  │                    │                     │                    │
  │                    │                     │  Not found         │
  │                    │                     │<───────────────────┤
  │                    │                     │                    │
  │                    │                     │  Hash password     │
  │                    │                     │  (bcrypt, 10 rounds)
  │                    │                     │                    │
  │                    │                     │  CREATE User       │
  │                    │                     ├───────────────────>│
  │                    │                     │  - email           │
  │                    │                     │  - passwordHash    │
  │                    │                     │  - name            │
  │                    │                     │  - role            │
  │                    │                     │  - firebaseUid: NULL
  │                    │                     │                    │
  │                    │                     │  User Record       │
  │                    │                     │<───────────────────┤
  │                    │                     │                    │
  │                    │                     │  Generate JWT      │
  │                    │                     │                    │
  │                    │  { user, token }    │                    │
  │                    │  (no passwordHash)  │                    │
  │                    │<────────────────────┤                    │
  │                    │                     │                    │
  │                    │  Store in localStorage:                  │
  │                    │  - tosrean_token                         │
  │                    │  - tosrean_user                          │
  │                    │                     │                    │
  │  Redirect to       │                     │                    │
  │  Dashboard         │                     │                    │
  │<───────────────────┤                     │                    │
  │                    │                     │                    │

Result in Database:
┌──────────────────────────────────────────────────────────────┐
│ User Record (PostgreSQL)                                     │
├──────────────────────────────────────────────────────────────┤
│ id:           "uuid-456"                                     │
│ email:        "user@example.com"                             │
│ firebaseUid:  NULL                       ← NULL (Manual)     │
│ passwordHash: "$2b$10$abc123..."        ← SET (Hashed)       │
│ name:         "Jane Smith"                                   │
│ role:         "STUDENT"                                      │
│ avatar:       NULL                                           │
└──────────────────────────────────────────────────────────────┘

⚠️ IMPORTANT: NO Firebase involvement in this flow!
```

---

## Flow 3: Manual Login (Database Only)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MANUAL LOGIN FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

User                Frontend              Backend              Database
  │                    │                     │                    │
  │  Fill Form:        │                     │                    │
  │  - Email           │                     │                    │
  │  - Password        │                     │                    │
  │                    │                     │                    │
  │  Click "Sign In"   │                     │                    │
  ├───────────────────>│                     │                    │
  │                    │                     │                    │
  │                    │  POST /auth/login   │                    │
  │                    │  {                  │                    │
  │                    │    email,           │                    │
  │                    │    password         │                    │
  │                    │  }                  │                    │
  │                    ├────────────────────>│                    │
  │                    │                     │                    │
  │                    │                     │  Find user by email│
  │                    │                     ├───────────────────>│
  │                    │                     │                    │
  │                    │                     │  User Record       │
  │                    │                     │  (with passwordHash)
  │                    │                     │<───────────────────┤
  │                    │                     │                    │
  │                    │                     │  bcrypt.compare(   │
  │                    │                     │    password,       │
  │                    │                     │    passwordHash    │
  │                    │                     │  )                 │
  │                    │                     │                    │
  │                    │                     │  ✓ Match           │
  │                    │                     │                    │
  │                    │                     │  Generate JWT      │
  │                    │                     │                    │
  │                    │  { user, token }    │                    │
  │                    │  (no passwordHash)  │                    │
  │                    │<────────────────────┤                    │
  │                    │                     │                    │
  │                    │  Store in localStorage:                  │
  │                    │  - tosrean_token                         │
  │                    │  - tosrean_user                          │
  │                    │                     │                    │
  │  Redirect to       │                     │                    │
  │  Dashboard         │                     │                    │
  │<───────────────────┤                     │                    │
  │                    │                     │                    │

⚠️ IMPORTANT: NO Firebase involvement in this flow!
```

---

## Flow 4: Protected Route Access (JWT Verification)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  PROTECTED ROUTE ACCESS FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

User                Frontend              Backend              Database
  │                    │                     │                    │
  │  Request protected │                     │                    │
  │  resource          │                     │                    │
  ├───────────────────>│                     │                    │
  │                    │                     │                    │
  │                    │  GET /auth/me       │                    │
  │                    │  Headers:           │                    │
  │                    │  Authorization:     │                    │
  │                    │  Bearer <JWT>       │                    │
  │                    ├────────────────────>│                    │
  │                    │                     │                    │
  │                    │                     │  authMiddleware    │
  │                    │                     │  - Extract token   │
  │                    │                     │  - Verify signature│
  │                    │                     │  - Check expiration│
  │                    │                     │                    │
  │                    │                     │  Decode JWT        │
  │                    │                     │  { userId: "..." } │
  │                    │                     │                    │
  │                    │                     │  Find user by ID   │
  │                    │                     ├───────────────────>│
  │                    │                     │                    │
  │                    │                     │  User Record       │
  │                    │                     │<───────────────────┤
  │                    │                     │                    │
  │                    │                     │  Attach user to    │
  │                    │                     │  request object    │
  │                    │                     │                    │
  │                    │  { user }           │                    │
  │                    │<────────────────────┤                    │
  │                    │                     │                    │
  │  Display data      │                     │                    │
  │<───────────────────┤                     │                    │
  │                    │                     │                    │
```

---

## Comparison Table

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION METHOD COMPARISON                        │
├──────────────┬─────────────┬─────────────┬─────────────┬──────────────────┤
│   Method     │   Firebase  │  Database   │  Password   │   FirebaseUID    │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────────────┤
│ Google       │  ✅ Verify  │  ✅ Upsert  │  ❌ NULL    │  ✅ Populated    │
│ Sign-In      │  ID Token   │  User       │             │                  │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────────────┤
│ Manual       │  ❌ None    │  ✅ Create  │  ✅ Hashed  │  ❌ NULL         │
│ Sign-Up      │             │  User       │  (bcrypt)   │                  │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────────────┤
│ Manual       │  ❌ None    │  ✅ Query   │  ✅ Verify  │  ❌ NULL         │
│ Login        │             │  User       │  (bcrypt)   │                  │
└──────────────┴─────────────┴─────────────┴─────────────┴──────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: Client-Side (Frontend)
┌────────────────────────────────────────┐
│  • Form validation                     │
│  • Password strength check             │
│  • HTTPS only                          │
│  • localStorage for token storage      │
└────────────────────────────────────────┘
                    ↓
Layer 2: Transport (HTTPS)
┌────────────────────────────────────────┐
│  • TLS encryption                      │
│  • Secure headers                      │
│  • CORS configuration                  │
└────────────────────────────────────────┘
                    ↓
Layer 3: Backend Authentication
┌────────────────────────────────────────┐
│  Google Sign-In:                       │
│  • Firebase Admin SDK verification     │
│  • Token signature check               │
│  • Token expiration check              │
│                                        │
│  Manual Auth:                          │
│  • bcrypt password hashing (10 rounds) │
│  • Constant-time comparison            │
│  • Rate limiting (TODO)                │
└────────────────────────────────────────┘
                    ↓
Layer 4: Session Management
┌────────────────────────────────────────┐
│  • JWT token generation                │
│  • HMAC signature (HS256)              │
│  • 7-day expiration                    │
│  • Minimal payload (userId + role)     │
└────────────────────────────────────────┘
                    ↓
Layer 5: Authorization
┌────────────────────────────────────────┐
│  • authMiddleware (JWT verification)   │
│  • adminMiddleware (role check)        │
│  • instructorMiddleware (role check)   │
└────────────────────────────────────────┘
                    ↓
Layer 6: Database
┌────────────────────────────────────────┐
│  • Unique constraints (email, uid)     │
│  • Indexes for performance             │
│  • Cascading deletes                   │
│  • No plain-text passwords             │
│  • Prisma ORM (SQL injection prevention)
└────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

Request
   │
   ├─> Try Block
   │      │
   │      ├─> Success ──> Return { success: true, data: ... }
   │      │
   │      └─> Error ──> Catch Block
   │                       │
   │                       ├─> Known Error (AppError)
   │                       │      │
   │                       │      └─> Return {
   │                       │            success: false,
   │                       │            message: "User-friendly message",
   │                       │            code: "AUTH_XXX"
   │                       │          }
   │                       │
   │                       └─> Unknown Error
   │                              │
   │                              └─> Return {
   │                                    success: false,
   │                                    message: "Internal server error",
   │                                    code: "SERVER_ERROR"
   │                                  }
   │
   └─> Response to Client
```

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SESSION LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────────┘

1. Login/Register
   │
   ├─> Backend generates JWT
   │   - Payload: { userId, role }
   │   - Signature: HMAC-SHA256
   │   - Expiration: 7 days
   │
   └─> Frontend stores:
       - localStorage.tosrean_token = JWT
       - localStorage.tosrean_user = User object

2. Subsequent Requests
   │
   ├─> Frontend reads token from localStorage
   │
   ├─> Sends request with header:
   │   Authorization: Bearer <JWT>
   │
   └─> Backend verifies:
       - Signature valid?
       - Not expired?
       - User still exists?

3. Token Expiration (7 days)
   │
   ├─> Backend returns 401 Unauthorized
   │
   └─> Frontend:
       - Clears localStorage
       - Redirects to login page

4. Logout
   │
   ├─> Frontend:
   │   - Clears localStorage
   │   - (Optional) Signs out from Firebase
   │
   └─> Redirects to login page
```

---

## Summary

### ✅ Google Sign-In
- Uses Firebase for authentication
- Syncs to database with `firebaseUid`
- No password stored

### ✅ Manual Sign-Up
- Direct database registration
- Password hashed with bcrypt
- No Firebase involvement

### ✅ Manual Login
- Direct database authentication
- Password verified with bcrypt
- No Firebase involvement

### ✅ All Methods
- Return JWT token
- Store in localStorage
- Use JWT for subsequent requests
