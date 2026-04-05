# Student Profile API

**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/me`

Fetch the currently authenticated student's profile.

### Response `200`
```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "role": "student",
    "status": "active",
    "profilePhoto": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/profile-photos/abc123.jpg",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PATCH `/api/student/settings/profile`

Update the student's profile information.

### Request Body (all optional — only send fields to change)
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "username": "jon_doe"
}
```

### Response `200`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "email": "john@example.com",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "username": "jon_doe",
  "role": "student",
  "status": "active",
  "profilePhoto": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/profile-photos/abc123.jpg",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Errors
All error responses follow the standard structure: `{ "success": false, "error": "Human-readable message." }` — see `overview.md`.

| Status | Condition |
|--------|-----------|
| `400` | Username already taken by another user |

### Notes
- Email cannot be changed through this endpoint
- Password changes are handled through the forgot-password flow

---

## POST `/api/student/settings/photo`

Upload a profile photo for the student.

### Request
- **Content-Type:** `multipart/form-data`
- **Field name:** `photo`
- **Accepted formats:** JPEG, PNG, WebP

### Response `200`
```json
{
  "profilePhoto": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/profile-photos/abc123.jpg",
  "message": "Profile photo updated."
}
```

### Notes
- Image is uploaded to Cloudinary under the `cla/profile-photos` folder
- `profilePhoto` in the response is a full Cloudinary `https://` URL — use it directly as `<img src>`
- Max file size: 5MB. Accepted formats: JPEG, PNG, WebP
