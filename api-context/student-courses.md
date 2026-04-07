# Student Courses API

**Base path:** `/api/student/courses`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/courses`

Fetch all published courses with the student's progress on each.

### Response `200`
```json
{
  "courses": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to Clinic Management",
      "subheading": "Learn the fundamentals",
      "about": "A comprehensive overview...",
      "thumbnail": "http://localhost:5000/uploads/thumb.jpg",
      "banner": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1775031850/cla/courses-backgrounds/CLA_ResourcesCEO_Mindset_svlk9l.jpg",
      "instructor": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0i1",
        "firstName": "Dr. Sarah",
        "lastName": "Johnson",
        "title": "Senior Consultant",
        "photo": "http://localhost:5000/uploads/instructor.jpg",
        "linkedin": "https://linkedin.com/in/drsarah",
        "instagram": null,
        "twitter": null,
        "website": "https://drsarah.com"
      },
      "status": "published",
      "comingSoon": false,
      "releaseDate": null,
      "order": 1,
      "totalLessons": 12,
      "completedLessons": 4,
      "progressPercent": 33
    }
  ]
}
```

### Field Descriptions
| Field | Description |
|-------|-------------|
| `totalLessons` | Total number of published lessons in the course |
| `completedLessons` | Number of lessons the student has marked complete |
| `progressPercent` | Rounded percentage completion (0–100) |
| `comingSoon` | If `true`, course is not yet available |
| `releaseDate` | When the course will be available (if `comingSoon: true`) |

### Notes
- Only `published` courses are returned (not drafts or unpublished)
- Courses with `comingSoon: true` are included but content may not be accessible

---

## GET `/api/student/courses/:courseId`

Fetch a single course with its full module/lesson structure and the student's progress per lesson.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course

### Response `200`
```json
{
  "course": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to Clinic Management",
    "subheading": "Learn the fundamentals",
    "about": "A comprehensive overview...",
    "thumbnail": "http://localhost:5000/uploads/thumb.jpg",
    "banner": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1775031850/cla/courses-backgrounds/CLA_ResourcesCEO_Mindset_svlk9l.jpg",
    "instructor": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0i1",
      "firstName": "Dr. Sarah",
      "lastName": "Johnson",
      "title": "Senior Consultant",
      "photo": "http://localhost:5000/uploads/instructor.jpg"
    },
    "status": "published",
    "comingSoon": false
  },
  "modules": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0m1",
      "title": "Module 1: Getting Started",
      "order": 1,
      "lessons": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
          "title": "Lesson 1: Welcome",
          "subheading": "Introduction to the course",
          "videoEmbed": "https://player.vimeo.com/video/123456789",
          "status": "published",
          "order": 1,
          "completed": true,
          "lastWatched": "2024-01-14T10:00:00.000Z"
        },
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0f2",
          "title": "Lesson 2: Core Concepts",
          "subheading": null,
          "videoEmbed": "https://player.vimeo.com/video/123456789",
          "status": "published",
          "order": 2,
          "completed": false,
          "lastWatched": null
        }
      ]
    }
  ]
}
```

---

## GET `/api/student/courses/:courseId/lessons/:lessonId`

Fetch a single lesson's content, resources, and sidebar navigation.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course
- `lessonId` — MongoDB ObjectId of the lesson

### Response `200`
```json
{
  "lesson": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
    "title": "Lesson 3: Advanced Billing",
    "subheading": "An in-depth look at billing codes",
    "videoEmbed": "https://player.vimeo.com/video/123456789",
    "status": "published",
    "order": 3
  },
  "resources": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
      "title": "Billing Code Reference Guide",
      "type": "pdf",
      "url": "https://example.com/guide.pdf",
      "description": "A comprehensive reference PDF",
      "status": "published",
      "order": 1
    }
  ],
  "sidebar": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0m1",
      "title": "Module 1: Getting Started",
      "lessons": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
          "title": "Lesson 1: Welcome",
          "completed": true,
          "lastWatched": "2024-01-14T10:00:00.000Z",
          "isActive": false
        },
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0f3",
          "title": "Lesson 3: Advanced Billing",
          "completed": false,
          "lastWatched": "2024-01-15T10:30:00.000Z",
          "isActive": true
        }
      ]
    }
  ]
}
```

### Side Effects
- Automatically records `lastWatched` timestamp for this lesson in the student's Progress
- Creates an ActivityLog entry with `action: "watched"`

### Notes
- `sidebar` contains all modules and lessons in the course — use it to build the course navigation panel
- `isActive: true` marks the current lesson being viewed
- Resource `type` values: `file` | `link` | `pdf` | `video`

---

## POST `/api/student/courses/:courseId/lessons/:lessonId/complete`

Mark a lesson as completed.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course
- `lessonId` — MongoDB ObjectId of the lesson

### Request Body
None

### Response `200`
```json
{
  "completed": true,
  "completedAt": "2024-01-15T11:00:00.000Z"
}
```

### Side Effects
- Creates or updates a Progress record with `completed: true`
- Creates an ActivityLog entry with `action: "completed"`

### Notes
- Safe to call multiple times — idempotent (won't create duplicates)
- Used to power the progress tracking shown on the course list page

---

## POST `/api/student/courses/:courseId/lessons/:lessonId/flag-video`

Flag a lesson video as having an issue (for review by admins).

### URL Parameters
- `courseId` — MongoDB ObjectId of the course
- `lessonId` — MongoDB ObjectId of the lesson

### Request Body
None

### Response `200`
```json
{
  "flaggedVideo": true
}
```

### Notes
- Sets `flaggedVideo: true` on the student's Progress record for this lesson
- Used so admins can identify videos that need attention
