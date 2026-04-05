# Admin Users API

**Base path:** `/api/admin/users`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/users`

Fetch paginated list of users with optional filters.

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |
| `search` | string | — | Search in firstName, lastName, email, username |
| `role` | string | — | Filter by role: `student` or `admin` |
| `status` | string | — | Filter by status: `active`, `banned`, or `inactive` |

### Response `200`
```json
{
  "users": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "role": "student",
      "status": "active",
      "is_whitelisted": true,
      "profilePhoto": "http://localhost:5000/uploads/photo.jpg",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## POST `/api/admin/users`

Create a new user (student or admin).

### Request Body
```json
{
  "username": "johndoe",             // required, must be unique
  "email": "john@example.com",       // required, valid email, must be unique
  "firstName": "John",               // required
  "lastName": "Doe",                 // required
  "password": "securepass123",       // required, min 8 characters
  "role": "student",                 // required: "student" or "admin"
  "sendWelcomeEmail": true           // optional boolean — if true, sends email with login credentials (email + plain password)
}
```

### Response `201`
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
    "is_whitelisted": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully."
}
```

### Errors
All error responses follow the standard structure: `{ "success": false, "error": "Human-readable message." }` — see `overview.md`.

| Status | Condition |
|--------|-----------|
| `400` | Email already registered |
| `400` | Username already taken |
| `400` | Validation error (missing required fields, password too short, etc.) |

### Welcome Email (on create)
When `sendWelcomeEmail: true`, the user receives an email containing:
- Their **first name**
- Their **email address**
- Their **plain text password** (only available at creation time)
- A **Login** button linking to `FRONTEND_URL/login`

---

## PUT `/api/admin/users/:userId`

Update an existing user's details.

### URL Parameters
- `userId` — MongoDB ObjectId of the user

### Request Body (all fields optional)
```json
{
  "username": "newusername",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "role": "admin",
  "password": "newpassword123",   // min 8 chars if provided
  "status": "active"              // "active" | "banned" | "inactive"
}
```

### Response `200`
```json
{
  "user": { /* updated user object */ },
  "message": "User updated successfully."
}
```

---

## PATCH `/api/admin/users/:userId/ban`

Ban a user account.

### URL Parameters
- `userId` — MongoDB ObjectId of the user

### Request Body
None

### Response `200`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "status": "banned",
  ...
}
```

---

## PATCH `/api/admin/users/:userId/unban`

Unban a user account (sets status back to `active`).

### URL Parameters
- `userId` — MongoDB ObjectId of the user

### Request Body
None

### Response `200`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "status": "active",
  ...
}
```

---

## POST `/api/admin/users/:userId/resend-email`

Resend the welcome email to a user. Since the original password is hashed and unrecoverable, this generates a **set-password link** instead and emails it to the user.

### URL Parameters
- `userId` — MongoDB ObjectId of the user

### Request Body
None

### Response `200`
```json
{
  "message": "Welcome email sent."
}
```

### Welcome Email (on resend)
The user receives an email containing:
- Their **first name**
- Their **email address**
- A **"Set Your Password"** button linking to `FRONTEND_URL/reset-password?token=<token>&welcome=true`
- The token expires in **1 hour**

### Notes
- The frontend `/reset-password` page should detect `?welcome=true` to show "Set Your Password" wording instead of "Reset Your Password"
- The user submits the form to `POST /api/auth/reset-password` with `{ token, password, confirmPassword }` — same endpoint as the forgot-password flow

---

## DELETE `/api/admin/users/:userId`

Permanently delete a user.

### URL Parameters
- `userId` — MongoDB ObjectId of the user

### Request Body
None

### Response `200`
```json
{
  "message": "User deleted."
}
```
