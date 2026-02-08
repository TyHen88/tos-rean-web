# Backend API Requirements - Status Update

The following status reflects the latest alignment with the `new-update.md` provided by the backend.

## ✅ Fulfilled & Implemented
- **Bulk Lesson Creation**: `POST /api/courses/:courseId/lessons/bulk-save` is ready and integrated into the Admin Course Wizard.
- **Reviews Service**: `GET /api/courses/:id/reviews` and `POST /api/courses/:id/reviews` are supported in the frontend service layer.
- **Dynamic Categories**: `GET /api/categories` is used to populate exploration filters.
- **Certificates**: `GET /api/enrollments/:courseId/certificate` alignment is complete.
- **Type Alignment**: Roles and Levels now support the Uppercase standard (`STUDENT`, `BEGINNER`, etc.).

## 🛠 Currently Missing / Pending Clarification
- **Lesson Content Deletion**: When calling `bulk-save`, confirm if the backend physically deletes old records or just marks them as inactive.
- **Payment Success Webhook**: We still need the backend to handle the `post_url` from ABA PayWay to update enrollment status automatically.
- **Video Hosting**: Clarify if `videoUrl` should be a YouTube/Vimeo link or if the backend will provide a custom streaming solution/S3 signed URL.

## 🚀 Future Roadmap
- **Wishlist Service**: `POST /api/wishlist` for students to save courses for later.
- **Notification Service**: Real-time alerts for course updates or student enrollments.
