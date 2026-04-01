# Admin Notifications API

**Base path:** `/api/admin/notifications`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## POST `/api/admin/notifications`

Send a notification to users. The notification is immediately delivered to targeted users.

### Request Body
```json
{
  "title": "New Course Available!",     // required
  "message": "Check out our latest...", // required
  "type": "new_course",                 // required — see type values below
  "targetType": "all",                  // required: "all" | "user" | "role"
  "targetUsers": [],                    // required (can be empty array) if targetType = "user", array of user ObjectIds
  "targetRole": "student"              // required if targetType = "role": "student" | "admin"
}
```

### `type` values
| Value | Description |
|-------|-------------|
| `new_course` | Announcing a new course |
| `new_lesson` | Announcing a new lesson |
| `system_alert` | System-wide alert |
| `reminder` | Reminder notification |
| `achievement` | Achievement unlocked |
| `welcome` | Welcome message |
| `custom` | Custom notification |

### `targetType` values
| Value | Behavior |
|-------|----------|
| `all` | Sends to all users |
| `user` | Sends to specific users listed in `targetUsers` |
| `role` | Sends to all users with the specified `targetRole` |

### Examples

**Send to all users:**
```json
{
  "title": "Site Maintenance",
  "message": "We'll be down for maintenance on Saturday from 2-4am.",
  "type": "system_alert",
  "targetType": "all"
}
```

**Send to specific users:**
```json
{
  "title": "Welcome!",
  "message": "Thanks for joining us.",
  "type": "welcome",
  "targetType": "user",
  "targetUsers": ["64f1a2b3c4d5e6f7a8b9c0d1", "64f1a2b3c4d5e6f7a8b9c0d2"]
}
```

**Send to all students:**
```json
{
  "title": "New Course Alert",
  "message": "A new course has been published!",
  "type": "new_course",
  "targetType": "role",
  "targetRole": "student"
}
```

### Response `201`
```json
{
  "notification": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0n1",
    "title": "New Course Available!",
    "message": "Check out our latest...",
    "type": "new_course",
    "targetType": "all",
    "targetUsers": [],
    "targetRole": null,
    "status": "sent",
    "sentAt": "2024-01-15T10:30:00.000Z",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "recipientCount": 250,
  "message": "Notification sent successfully."
}
```

---

## DELETE `/api/admin/notifications/:notificationId`

Delete a sent notification from the history.

### URL Parameters
- `notificationId` — MongoDB ObjectId of the notification

### Response `200`
```json
{ "message": "Notification deleted." }
```
