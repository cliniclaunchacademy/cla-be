# Admin Profile API

**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/me`

Fetch the currently authenticated admin's profile.

### Response `200`
```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "admin@cliniclaunch.com",
    "firstName": "Admin",
    "lastName": "User",
    "username": "adminuser",
    "role": "admin",
    "status": "active",
    "profilePhoto": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/profile-photos/abc123.jpg",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PATCH `/api/admin/profile`

Update the admin's profile information.

### Request Body (all optional — only send fields to change)
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_admin"
}
```

### Response `200`
```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "admin@cliniclaunch.com",
    "firstName": "John",
    "lastName": "Smith",
    "username": "john_admin",
    "role": "admin",
    "status": "active",
    "profilePhoto": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/profile-photos/abc123.jpg",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Profile updated successfully."
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

## POST `/api/admin/photo`

Upload a profile photo for the admin.

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
- Image is uploaded to Cloudinary under the `cla/profile-photos` folder (same folder as student photos)
- `profilePhoto` in the response is a full Cloudinary `https://` URL — use it directly as `<img src>`
- Max file size: 5MB. Accepted formats: JPEG, PNG, WebP
