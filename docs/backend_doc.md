# Tos Rean Backend Architecture & Resources Documentation

This document serves as the comprehensive blueprint for the **Tos Rean** backend system. 

## 1. System Overview
Tos Rean is a professional e-learning platform. The backend is designed as a standalone RESTful API that handles authentication, course management, student progress, payments, and admin auditing.

- **Frontend**: Next.js 15 (App Router)
- **Backend API**: Node.js + Express.js
- **Database**: PostgreSQL (Managed via Prisma)
- **Authentication**: Google/Email via Firebase + JWT Sessioning
- **Payment Gateway**: ABA PayWay (QR & Form)

---

## 2. Technology Stack & Configuration

### Core Stack
- **Language**: TypeScript
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Prisma
- **Auth**: Firebase Admin SDK (Third-party) + JWT (Internal)
- **Validation**: Zod (Type-safe request/response)
- **Logging**: Winston/Morgan

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://mac_pg:12345678@localhost:5432/camnextgenhub_db?schema=public"

# Auth & Firebase
FIREBASE_PROJECT_ID="cambonexthub"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@cambonexthub.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." # Secret

# JWT Configuration
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="cambonexthub.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="cambonexthub"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="cambonexthub.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# ABA PayWay
ABA_PAYWAY_API_URL="..."
ABA_PAYWAY_MERCHANT_ID="..."
ABA_PAYWAY_API_KEY="..."
```

---

## 3. Database Schema (Prisma)

### Enums
- `Role`: `ADMIN`, `INSTRUCTOR`, `STUDENT`
- `Level`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `ALL_LEVELS`
- `Status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `TxStatus`: `PENDING`, `SUCCESS`, `FAILED`

### Models
- **User**: Stores profile, role, and Firebase UID.
- **Course**: Title, description, thumbnail, price, category, tags, and status.
- **Lesson**: Curriculum items with video URLs, duration, order, and free-preview flag.
- **Resource**: Standalone learning materials (PDFs, Code, Links) not bound to a specific course.
- **Enrollment**: Many-to-Many join for Users & Courses. Tracks `progress` and `completedLessons`.
- **Review**: Star ratings and feedback associated with courses.
- **Transaction**: Payment records linked to ABA PayWay sessions.

---

## 4. Core Features & API Endpoints

### 4.1 Authentication Flow (Firebase + JWT)
The system uses Firebase for identity and Google Login, with an internal JWT for session authorization.
- `POST /api/auth/sync`: Frontend sends Firebase ID Token -> Backend verifies via Firebase Admin SDK -> Upserts User in PostgreSQL -> Returns JWT + User Role.
- `GET /api/auth/me`: Verifies internal JWT and returns current user data.

### 4.2 Course Management (Wizard Logic)
Supports the multi-step "Course Wizard" in the Admin panel.
- `GET /api/courses`: Paginated list with filters (`search`, `category`, `level`, `price`).
- `GET /api/courses/:id`: Detailed view including lessons and instructor info.
- `POST /api/courses`: Initial creation (Step 1).
- `PATCH /api/courses/:id`: Update basic info, media, or status (Steps 2-4).
- `POST /api/courses/:id/lessons`: Bulk add or single add curriculum items.
- `DELETE /api/admin/courses/:id`: Soft delete/Archive courses.

### 4.3 Student Learning Experience & Resources
- `GET /api/my-learning`: Lists courses where `Enrollment` exists for the current user.
- `GET /api/courses/:id/learn`: Returns course content restricted to enrolled students.
- `POST /api/enrollments/:courseId/progress`: Marks a lesson as complete/incomplete and recalculates % progress.
- `GET /api/certificates/:courseId`: Generates/Returns a completion certificate if `progress == 100`.
- `GET /api/resources`: Fetches global learning materials (PDFs, Code samples, links).
- `POST /api/admin/resources`: (Admin) Manage the resource library.

### 4.4 Payment Gateway (ABA PayWay)
- `POST /api/payments/checkout`: 
  1. Creates a `Transaction` (PENDING).
  2. Generates ABA HMAC Hash.
  3. Returns ABA form data/QR code to frontend.
- `POST /api/payments/webhook`: 
  1. Verifies ABA signature.
  2. Updates `Transaction` status.
  3. If SUCCESS: Creates `Enrollment` record automatically.

### 4.5 Admin & Analytics
- `GET /api/admin/users`: Full user list with management (Role updates, Deletion).
- `GET /api/admin/stats`: General dashboard metrics:
  - Total Revenue (Sum of SUCCESS Transactions).
  - Monthly Active Users (MAU).
  - Top Performing Courses (by sales/enrollments).
- `GET /api/admin/audit-logs`: (Future) Track changes to courses/prices.

---

## 5. Storage & Media
- **Image/Thumbnail Upload**: Backend exposes `POST /api/upload` (Multer -> S3/Cloudinary) for course thumbnails and user avatars.
- **Video Content**: Supports both Embedded URLs (YouTube/Vimeo) and direct storage links.

---

## 6. Frontend-Backend Data Mapping

| Frontend (UI) | API Response / DB Field | Logic Note |
|---|---|---|
| `course.lessonsCount` | `_count: { lessons: true }` | Aggregated on `GET /courses` |
| `course.studentsCount` | `_count: { enrollments: true }` | Aggregated on `GET /courses` |
| `course.rating` | `AVG(reviews.rating)` | Calculated on the fly |
| `lesson.isFree` | `lesson.isFree` (bool) | Guards `videoUrl` if not enrolled |
| `user.role` | `user.role` (ENUM) | Determines Admin Dashboard access |

---

## 7. Implementation Priorities

1. **Phase 1 (Sync)**: Sync Firebase Auth with PostgreSQL.
2. **Phase 2 (Content)**: Full CRUD for Courses and Lessons.
3. **Phase 3 (Learning)**: Enrollment logic and Progress tracking.
4. **Phase 4 (Payments)**: ABA Hash generation and Webhook listener.
5. **Phase 5 (Polish)**: User management and Analytics dashboard.
