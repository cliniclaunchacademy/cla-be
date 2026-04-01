# Student Notifications API

**Base path:** `/api/student/notifications`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/notifications`

Fetch all notifications for the current student, with unread count.

### Response `200`
```json
{
  "unreadCount": 3,
  "notifications": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0un1",
      "notification": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0n1",
        "title": "New Course Available!",
        "message": "We just published a brand new course on advanced billing. Check it out!",
        "type": "new_course",
        "sentAt": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0un2",
      "notification": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0n2",
        "title": "Welcome to Clinic Launch Academy!",
        "message": "We're thrilled to have you on board.",
        "type": "welcome",
        "sentAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "read": true,
      "readAt": "2024-01-02T08:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `type` values
`new_course` | `new_lesson` | `system_alert` | `reminder` | `achievement` | `welcome` | `custom`

### Notes
- Each item in `notifications` is a `UserNotification` record (the junction between a notification and the user)
- The nested `notification` object contains the actual notification content
- `unreadCount` — display this as a badge on the notifications bell icon
- Notifications are ordered by most recent first

---

## PATCH `/api/student/notifications/read-all`

Mark all unread notifications as read.

### Request Body
None

### Response `200`
```json
{
  "updatedCount": 3
}
```

### Notes
- Use this when the student opens the notifications panel
- `updatedCount` is the number of notifications that were marked as read

---

## PATCH `/api/student/notifications/:notificationId/read`

Mark a single notification as read.

### URL Parameters
- `notificationId` — MongoDB ObjectId of the **UserNotification** record (the `_id` of the item in the `notifications` array, not the nested `notification._id`)

### Request Body
None

### Response `200`
```json
{
  "read": true,
  "readAt": "2024-01-15T11:30:00.000Z"
}
```

### Notes
- Use the `_id` from the top-level notification list item, not the nested `notification._id`
- Safe to call on an already-read notification (idempotent)
