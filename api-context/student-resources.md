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
      "_id": "65f1a2b3c4d5e6f7a8b9c051",
      "course": {
        "_id": "65f1a2b3c4d5e6f7a8b9c021",
        "title": "Clinical Phlebotomy Programme",
        "thumbnail": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1774942953/cla/courses-thumbnails/Cold_outreach_Mastery_qhj2hm.jpg"
      },
      "lesson": {
        "_id": "65f1a2b3c4d5e6f7a8b9c041",
        "title": "What is Phlebotomy?"
      },
      "title": "Phlebotomy Overview — Quick Reference Guide",
      "type": "pdf",
      "url": "https://www.orimi.com/pdf-test.pdf",
      "description": "A concise one-page summary of the phlebotomy role, key responsibilities, and scope of practice.",
      "status": "published",
      "order": 1,
      "createdAt": "2024-01-10T00:00:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c052",
      "course": {
        "_id": "65f1a2b3c4d5e6f7a8b9c021",
        "title": "Clinical Phlebotomy Programme",
        "thumbnail": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1774942953/cla/courses-thumbnails/Cold_outreach_Mastery_qhj2hm.jpg"
      },
      "lesson": {
        "_id": "65f1a2b3c4d5e6f7a8b9c041",
        "title": "What is Phlebotomy?"
      },
      "title": "Blood Collection Equipment Checklist",
      "type": "file",
      "url": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1775031848/cla/courses-backgrounds/CLA_ResourcesConnector_playbook_tangn1.jpg",
      "description": "Printable checklist of all equipment needed before, during, and after a blood draw.",
      "status": "published",
      "order": 2,
      "createdAt": "2024-01-10T00:00:00.000Z"
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
- Both `course` and `lesson` are fully populated objects — use `course.title` to group resources by course on the frontend
- Resources are sorted by course then by `order` within each course
- To get resources for a specific lesson only, use: `GET /api/student/courses/:courseId/lessons/:lessonId`
