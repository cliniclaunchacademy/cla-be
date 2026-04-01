# Student Resources API

**Base path:** `/api/student/resources`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/resources`

Fetch all published resources across all courses and lessons available to the student.

### Response `200`
```json
{
  "resources": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
      "lesson": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
        "title": "Lesson 3: Advanced Billing"
      },
      "title": "Billing Code Reference Guide",
      "type": "pdf",
      "url": "https://example.com/billing-guide.pdf",
      "description": "A comprehensive reference for all billing codes",
      "status": "published",
      "order": 1,
      "createdAt": "2024-01-10T00:00:00.000Z"
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r2",
      "lesson": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0f2",
        "title": "Lesson 5: Patient Management"
      },
      "title": "Patient Intake Template",
      "type": "file",
      "url": "https://example.com/intake-template.docx",
      "description": "A Word document template for patient intake",
      "status": "published",
      "order": 1,
      "createdAt": "2024-01-12T00:00:00.000Z"
    }
  ]
}
```

### `type` values
| Value | Description |
|-------|-------------|
| `file` | Generic downloadable file |
| `link` | External URL/website |
| `pdf` | PDF document |
| `video` | Video link |

### Notes
- Only `published` resources are returned
- Resources are from all courses — this is a global resources library view
- To get resources for a specific lesson, use the lesson endpoint: `GET /api/student/courses/:courseId/lessons/:lessonId`
