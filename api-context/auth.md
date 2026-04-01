# Auth API

**Base path:** `/api/auth`
**Authentication:** None (all routes are public)

---

## POST `/api/auth/login`

Login with email and password.

### Request Body
```json
{
  "email": "user@example.com",   // required, valid email
  "password": "mypassword123"    // required
}
```

### Response `200`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "role": "student",
    "status": "active",
    "profilePhoto": "http://localhost:5000/uploads/photo.jpg",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Errors
| Status | Condition |
|--------|-----------|
| `400` | Missing fields or invalid email format |
| `401` | Wrong email or password |
| `403` | Account is banned, inactive, or not whitelisted |

### Notes
- Store the `token` in localStorage or a cookie for subsequent requests
- Set `Authorization: Bearer <token>` on all protected requests
- `role` will be either `"student"` or `"admin"` — use this to route the user to the correct dashboard

---

## POST `/api/auth/forgot-password`

Request a password reset email.

### Request Body
```json
{
  "email": "user@example.com"   // required, valid email
}
```

### Response `200`
```json
{
  "message": "If this email is registered, a reset link has been sent."
}
```

### Notes
- Always returns `200` regardless of whether the email exists (prevents email enumeration)
- Reset token is valid for 1 hour
- An email is sent with a reset link containing the token

---

## POST `/api/auth/reset-password`

Reset password using the token received in email.

### Request Body
```json
{
  "token": "abc123resettoken",          // required, token from reset email
  "password": "newpassword123",         // required, min 8 characters
  "confirmPassword": "newpassword123"   // required, must match password
}
```

### Response `200`
```json
{
  "message": "Password updated. Please log in."
}
```

### Errors
| Status | Condition |
|--------|-----------|
| `400` | Token is invalid or expired |
| `400` | Passwords do not match |
| `400` | Password too short (min 8 chars) |
