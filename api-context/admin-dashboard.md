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
    "totalLessonsCompleted": 3450,
    "courseCompletionRate": 34
  }
}
```

### Field Descriptions
| Field | Description |
|-------|-------------|
| `activeLearnersLast30Days` | Distinct students with any activity log entry in the last 30 days |
| `newUsersThisWeek` | Students who joined in the last 7 days |
| `totalLessonsCompleted` | Platform-wide total of individual lesson completions |
| `courseCompletionRate` | Percentage of (student, course) enrollments where all published lessons are completed. `0` if no enrollments exist.
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

---

## GET `/api/admin/dashboard/weekly-signups`

Weekly new student signup counts for the past 12 weeks.

### Response `200`
```json
{
  "weeklySignups": [
    { "week": "2024-03", "count": 12 },
    { "week": "2024-04", "count": 18 }
  ]
}
```
`week` is formatted as `YYYY-WW` (ISO year and week number).

---

## GET `/api/admin/dashboard/popular-courses`

Top 5 courses ranked by unique student enrollment.

### Response `200`
```json
{
  "popularCourses": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to Clinic Management",
      "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
      "status": "published",
      "enrollmentCount": 84
    }
  ]
}
```

---

## GET `/api/admin/dashboard/activity-heatmap`

Activity event counts grouped by day-of-week and hour (for all students).

### Response `200`
```json
{
  "heatmap": [
    { "dayOfWeek": 2, "hour": 9, "count": 42 },
    { "dayOfWeek": 3, "hour": 14, "count": 67 }
  ]
}
```
`dayOfWeek`: 1 = Sunday … 7 = Saturday. `hour`: 0–23.

---

## GET `/api/admin/dashboard/at-risk-learners`

Students who have logged in at least once but not in the last 7 days.

### Response `200`
```json
{
  "atRiskLearners": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-05T10:30:00.000Z"
    }
  ]
}
```

---

## GET `/api/admin/dashboard/users/:userId/overview`

Full activity breakdown for a specific student.

### URL Parameters
- `userId` — MongoDB ObjectId of the student

### Response `200`
```json
{
  "user": { /* user object without password */ },
  "stats": {
    "enrolledCourses": 3,
    "completedLessons": 24,
    "inProgress": 8
  },
  "recentActivity": [
    {
      "_id": "...",
      "action": "watched",
      "lesson": { "_id": "...", "title": "Lesson 1" },
      "course": { "_id": "...", "title": "Course A" },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```
