# API Data Mapping Guide

## Course Data Mapping

This document explains how the API response fields map to the frontend Course type.

### API Response → Frontend Type Mapping

| API Field | Frontend Field | Type | Notes |
|-----------|---------------|------|-------|
| `id` | `id` | string | ✅ Direct mapping |
| `title` | `title` | string | ✅ Direct mapping |
| `slug` | `slug` | string | ✅ Added to type |
| `description` | `description` | string | ✅ Direct mapping |
| `thumbnail` | `thumbnail` | string | ✅ Direct mapping |
| `videoUrl` | `videoUrl` | string | ✅ Direct mapping |
| `price` | `price` | string/number | ✅ Can be "0" or number |
| `level` | `level` | enum | ✅ Direct mapping |
| `category` | `category` | string | ✅ Direct mapping |
| `tags` | `tags` | string[] | ✅ Direct mapping |
| `duration` | `duration` | string | ✅ Direct mapping |
| `status` | `status` | enum | ✅ Direct mapping |
| **`averageRating`** | **`rating`** | string/number | ⚠️ **Normalized in component** |
| `totalRatings` | `totalRatings` | number | ✅ Added to type |
| **`enrollmentCount`** | **`studentsCount`** | number | ⚠️ **Normalized in component** |
| `instructorId` | `instructorId` | string | ✅ Direct mapping |
| `instructorName` | `instructorName` | string | ✅ Direct mapping |
| `publishedAt` | `publishedAt` | string | ✅ Added to type |
| `createdAt` | `createdAt` | string | ✅ Direct mapping |
| `updatedAt` | `updatedAt` | string | ✅ Direct mapping |
| `lessons` (array length) | `lessonsCount` | number | ⚠️ **Computed from lessons array** |

### Lesson Data Mapping

| API Field | Frontend Field | Type | Notes |
|-----------|---------------|------|-------|
| `id` | `id` | string | ✅ Direct mapping |
| `title` | `title` | string | ✅ Direct mapping |
| `slug` | `slug` | string | ✅ Added to type |
| `description` | `description` | string | ✅ Direct mapping |
| `videoUrl` | `videoUrl` | string | ✅ Direct mapping |
| `videoProvider` | `videoProvider` | string | ✅ Added to type |
| `content` | `content` | string | ✅ Direct mapping |
| `duration` | `duration` | number | ✅ Direct mapping (seconds or minutes) |
| `order` | `order` | number | ✅ Direct mapping |
| `isFree` | `isFree` | boolean | ✅ Direct mapping |
| `isPublished` | `isPublished` | boolean | ✅ Added to type |
| `attachments` | `attachments` | array/null | ✅ Direct mapping |
| `courseId` | `courseId` | string | ✅ Direct mapping |
| `createdAt` | `createdAt` | string | ✅ Direct mapping |
| `updatedAt` | `updatedAt` | string | ✅ Added to type |

## Data Normalization

The course detail page (`app/(authenticated)/courses/[id]/page.tsx`) performs the following normalizations:

```typescript
const normalizedCourse = {
  ...courseRes.data,
  // Map averageRating to rating for display
  rating: courseRes.data.rating ?? (
    typeof courseRes.data.averageRating === 'string' 
      ? parseFloat(courseRes.data.averageRating) 
      : courseRes.data.averageRating
  ),
  // Map enrollmentCount to studentsCount for display
  studentsCount: courseRes.data.studentsCount ?? courseRes.data.enrollmentCount ?? 0,
  // Compute lessonsCount from lessons array
  lessonsCount: courseRes.data.lessonsCount ?? lessons.length ?? 0,
}
```

## Example API Response

```json
{
  "data": {
    "id": "3a716f52-c07f-4a7d-a5e2-00bfd985b7c3",
    "title": "Introduction to Web Development",
    "slug": "introduction-to-web-development",
    "description": "Learn the fundamentals...",
    "thumbnail": "https://images.unsplash.com/...",
    "videoUrl": "https://www.youtube.com/watch?v=example1",
    "price": "0",
    "level": "BEGINNER",
    "category": "Web Development",
    "tags": ["HTML", "CSS", "JavaScript", "Frontend"],
    "duration": "8 hours",
    "status": "PUBLISHED",
    "averageRating": "4.5",      // → mapped to rating
    "totalRatings": 125,
    "enrollmentCount": 450,      // → mapped to studentsCount
    "instructorId": "406d70fc-3bfa-4a94-8d7d-6c722aefa898",
    "instructorName": "John Doe",
    "createdAt": "2026-02-14T22:00:09.035Z",
    "updatedAt": "2026-02-14T22:00:09.035Z",
    "publishedAt": "2024-01-15T00:00:00.000Z",
    "lessons": [...]             // → lessons.length mapped to lessonsCount
  }
}
```

## Changes Made

### 1. Updated Type Definitions (`lib/types.ts`)
- ✅ Added `slug` field to Course
- ✅ Changed `price` to accept both string and number
- ✅ Made `lessonsCount`, `studentsCount`, `rating` optional
- ✅ Added `averageRating`, `totalRatings`, `enrollmentCount` fields
- ✅ Added `publishedAt` field
- ✅ Added uppercase status variants ("PUBLISHED", "DRAFT", "ARCHIVED")
- ✅ Added `slug`, `videoProvider`, `isPublished`, `updatedAt` to Lesson
- ✅ Made `attachments` nullable

### 2. Updated Course Detail Page (`app/(authenticated)/courses/[id]/page.tsx`)
- ✅ Added data normalization logic in `useEffect`
- ✅ Maps `averageRating` → `rating` with type conversion
- ✅ Maps `enrollmentCount` → `studentsCount`
- ✅ Computes `lessonsCount` from lessons array
- ✅ Added safe rendering with fallbacks (e.g., `|| 0`, `|| 'N/A'`)
- ✅ Updates `lessonsCount` after lessons are loaded

## Testing Checklist

- [ ] Course displays correct rating (from `averageRating`)
- [ ] Course displays correct student count (from `enrollmentCount`)
- [ ] Course displays correct lesson count (from lessons array)
- [ ] Price displays correctly (handles both "0" string and number)
- [ ] All lesson fields render without errors
- [ ] No TypeScript compilation errors
