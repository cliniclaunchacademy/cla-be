# API Overview

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```
- Token is obtained from POST `/api/auth/login`
- Token expiry: 7 days
- Roles: `admin`, `student`

## Response Format

### Success
Success responses vary per endpoint but always return `2xx` and **never** include a `success` field. Example:
```json
{ "course": { ... }, "message": "Course created successfully." }
```

### Error
**All** error responses have this exact structure:
```json
{
  "success": false,
  "error": "Human-readable message describing what went wrong."
}
```

The `error` string is safe to display directly to the user in toasts or form error messages.

On the frontend, detect errors like this:
```js
if (response.data.success === false) {
  showToast(response.data.error);
}
// or with axios interceptor:
// error.response.data.error
```

## Common HTTP Status Codes
| Code | Meaning | When it happens |
|------|---------|-----------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation failed or invalid input |
| `401` | Unauthorized | Missing, expired, or invalid token |
| `403` | Forbidden | Valid token but insufficient permissions, or account suspended |
| `404` | Not Found | Resource does not exist |
| `500` | Server Error | Unexpected server-side failure |
| `503` | Maintenance | Platform is under maintenance (students only) |

## Route Groups
| File | Routes | Auth Required |
|------|--------|---------------|
| `auth.md` | `/api/auth/*` | No (public) |
| `webhooks-ghl.md` | `/api/webhooks/ghl/*` | No — verified via `x-ghl-secret` header |
| `admin-dashboard.md` | `/api/admin/dashboard/*` | Admin JWT |
| `admin-users.md` | `/api/admin/users/*` | Admin JWT |
| `admin-courses.md` | `/api/admin/courses/*` + modules + lessons | Admin JWT |
| `admin-resources.md` | `/api/admin/resources/*` | Admin JWT |
| `admin-instructors.md` | `/api/admin/instructors/*` | Admin JWT |
| `admin-recordings.md` | `/api/admin/recordings/*` | Admin JWT |
| `admin-labs.md` | `/api/admin/labs/*` | Admin JWT |
| `admin-lab-applications.md` | `/api/admin/lab-applications/*` | Admin JWT |
| `admin-banners.md` | `/api/admin/banners/*` | Admin JWT |
| `admin-notifications.md` | `/api/admin/notifications/*` | Admin JWT |
| `admin-settings.md` | `/api/admin/settings/*` | Admin JWT |
| `student-dashboard.md` | `/api/student/dashboard/*` | Student JWT |
| `student-profile.md` | `/api/student/me`, `/api/student/settings/*` | Student JWT |
| `student-courses.md` | `/api/student/courses/*` | Student JWT |
| `student-resources.md` | `/api/student/resources/*` | Student JWT |
| `student-recordings.md` | `/api/student/recordings/*` | Student JWT |
| `student-labs.md` | `/api/student/labs/*` | Student JWT |
| `student-notifications.md` | `/api/student/notifications/*` | Student JWT |

## File Uploads
- Content-Type: `multipart/form-data`
- Supported formats: JPEG, PNG, WebP
- Uploaded files are served from `/uploads/*`
