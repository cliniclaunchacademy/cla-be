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
```json
{ "data_key": "value", "message": "optional message" }
```

### Error
```json
{ "error": "error message" }
```

## Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Validation error / bad request
- `401` - Missing or invalid token
- `403` - Forbidden (wrong role or account banned/inactive)
- `404` - Not found
- `503` - Maintenance mode (students only)

## Route Groups
| File | Routes | Auth Required |
|------|--------|---------------|
| `auth.md` | `/api/auth/*` | No (public) |
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
