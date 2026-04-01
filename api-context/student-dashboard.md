# Student Dashboard API

**Base path:** `/api/student/dashboard`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/dashboard/stats`

Fetch the student's learning statistics for their dashboard overview.

### Response `200`
```json
{
  "stats": {
    "enrolled": 5,
    "completed": 1,
    "inProgress": 3,
    "lessonsCompleted": 42
  }
}
```

### Field Descriptions
| Field | Description |
|-------|-------------|
| `enrolled` | Total number of courses the student has started or completed |
| `completed` | Number of courses where all lessons are completed |
| `inProgress` | Number of courses partially completed |
| `lessonsCompleted` | Total number of individual lessons marked as complete |

---

## GET `/api/student/dashboard/continue-learning`

Fetch the most recent lesson the student was watching (for the "Continue Learning" widget).

### Response `200` — with activity
```json
{
  "continueLearning": {
    "lessonId": "64f1a2b3c4d5e6f7a8b9c0f1",
    "lessonTitle": "Lesson 3: Advanced Billing",
    "courseId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "courseTitle": "Introduction to Clinic Management",
    "courseThumbnail": "http://localhost:5000/uploads/thumb.jpg",
    "lastWatched": "2024-01-15T10:30:00.000Z",
    "completed": false
  }
}
```

### Response `200` — no activity yet
```json
{
  "continueLearning": null
}
```

---

## GET `/api/student/dashboard/banners`

Fetch active banners for the dashboard carousel.

### Response `200`
```json
{
  "banners": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0b1",
      "imageUrl": "http://localhost:5000/uploads/banner.jpg",
      "label": "New Course Available!",
      "status": "active",
      "order": 1
    }
  ]
}
```

### Notes
- Only banners with `status: "active"` are returned
- Banners are ordered by their `order` field

---

## GET `/api/student/dashboard/community-banner`

Fetch the Discord community invite link for the community banner widget.

### Response `200`
```json
{
  "discordInviteUrl": "https://discord.gg/abc123"
}
```

### Response when not configured
```json
{
  "discordInviteUrl": null
}
```

---

## GET `/api/student/dashboard/recent-activity`

Fetch the student's recent learning activity (lessons watched and completed).

### Response `200`
```json
{
  "activities": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0ac1",
      "user": "64f1a2b3c4d5e6f7a8b9c0d1",
      "lesson": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
        "title": "Lesson 3: Advanced Billing"
      },
      "course": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "title": "Introduction to Clinic Management"
      },
      "action": "watched",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### `action` values
`watched` | `completed`
