# New API Updates for Frontend

The following updates have been implemented to support the latest frontend requirements.

---

## 1. Course & Lesson Management
- **Bulk Lesson Creation**:
    - **Endpoint**: `POST /api/courses/:courseId/lessons/bulk-save`
    - **Description**: Replaces all existing lessons for a course with the provided array. Perfect for the final save in the Course Wizard.
    - **Payload**:
      ```json
      {
        "lessons": [
          {
            "title": "Lesson 1",
            "description": "...",
            "duration": 10,
            "order": 1,
            "attachments": [{ "name": "File", "url": "..." }]
          }
        ]
      }
      ```
- **Attachments**: The `Lesson` object now includes an `attachments` field (Type: `Json`).

---

## 2. Reviews Service
- **List Reviews**:
    - **Endpoint**: `GET /api/courses/:id/reviews`
- **Submit Review**:
    - **Endpoint**: `POST /api/courses/:id/reviews`
    - **Auth**: Required (Enrolled students only).
    - **Payload**: `{ "rating": 5, "comment": "Great course!" }`

---

## 3. Categories
- **Fetch Categories**:
    - **Endpoint**: `GET /api/categories`
    - **Description**: Returns all unique categories currently tagged to courses. Use this to populate filters.

---

## 4. Certificates
- **Path Alignment**:
    - **New Endpoint**: `GET /api/enrollments/:courseId/certificate`
    - **Description**: Returns certificate data if course progress is 100%.

---

## 5. Type & Role Clarifications
- **Roles**: Strictly Uppercase in responses (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- **Course Level**: Matches Prisma Enums: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `ALL_LEVELS`.
- **Response Format**: All success responses follow `{ "success": true, "data": ... }`.

---

## 6. Connection Info
- **Port**: `3300`
- **Base URL**: `http://localhost:3300/api`
