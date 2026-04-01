# Admin Dashboard API

**Base path:** `/api/admin/dashboard`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/dashboard/stats`

Fetch summary statistics for the admin dashboard.

### Request
No body or query parameters.

### Response `200`
```json
{
  "stats": {
    "activeLearnersLast30Days": 142,
    "newUsersThisWeek": 18,
    "totalLessonsCompleted": 3450
  }
}
```

---

## GET `/api/admin/dashboard/recently-joined`

Fetch a list of the most recently joined users.

### Request
No body or query parameters.

### Response `200`
```json
{
  "users": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "janesmith",
      "role": "student",
      "status": "active",
      "is_whitelisted": true,
      "profilePhoto": "http://localhost:5000/uploads/photo.jpg",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

---

## GET `/api/admin/dashboard/notification-history`

Fetch paginated history of sent notifications.

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |

### Response `200`
```json
{
  "notifications": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "New Course Available",
      "message": "Check out our new advanced course!",
      "type": "new_course",
      "targetType": "all",
      "targetUsers": [],
      "targetRole": null,
      "status": "sent",
      "sentAt": "2024-01-15T10:30:00.000Z",
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Notification `type` values
`new_course` | `new_lesson` | `system_alert` | `reminder` | `achievement` | `welcome` | `custom`

### Notification `targetType` values
`all` | `user` | `role`
