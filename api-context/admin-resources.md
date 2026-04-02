# Admin Resources API

**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Resources are attachments (files, links, PDFs, videos) that belong to individual lessons.

---

## GET `/api/admin/resources`

Fetch all courses with their resource summary (count per course).

### Response `200`
```json
{
  "resources": [
    {
      "course": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "title": "Introduction to Clinic Management",
        "thumbnail": "http://localhost:5000/uploads/thumb.jpg"
      },
      "resourceCount": 8,
      "lastUpdated": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## GET `/api/admin/resources/:courseId`

Fetch all resources for a specific course, grouped with lesson information.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course

### Response `200`
```json
{
  "course": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to Clinic Management",
    "thumbnail": "http://localhost:5000/uploads/thumb.jpg"
  },
  "resources": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
      "lesson": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
        "title": "Lesson 1: Welcome"
      },
      "title": "Getting Started Guide",
      "type": "pdf",
      "url": "https://example.com/guide.pdf",
      "description": "A PDF guide to getting started",
      "status": "published",
      "order": 1,
      "createdAt": "2024-01-10T00:00:00.000Z"
    }
  ]
}
```

---

## POST `/api/admin/lessons/:lessonId/resources`

Add a new resource to a lesson. Accepts either a direct URL or a file upload (multipart).

### URL Parameters
- `lessonId` — MongoDB ObjectId of the lesson

### Option A — URL-based (JSON body)
```json
{
  "title": "Practice Worksheet",           // required
  "type": "pdf",                           // required: "file" | "link" | "pdf" | "video"
  "url": "https://example.com/sheet.pdf", // required if no file uploaded
  "description": "Optional description",  // optional
  "status": "published"                   // required: "published" | "hidden"
}
```

### Option B — File upload (`multipart/form-data`)
Send as `multipart/form-data` with the following fields:

| Field | Description |
|-------|-------------|
| `file` | The file to upload (max 20MB). Uploaded to Cloudinary, URL stored automatically. |
| `title` | required |
| `type` | required: `file` \| `pdf` \| `video` |
| `description` | optional |
| `status` | required: `published` \| `hidden` |

> `url` is not required when uploading a file — it is set from the Cloudinary response.

### Response `201`
```json
{
  "resource": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0r2",
    "lesson": "64f1a2b3c4d5e6f7a8b9c0f1",
    "title": "Practice Worksheet",
    "type": "pdf",
    "url": "https://res.cloudinary.com/demo/raw/upload/cla/lesson-resources/file.pdf",
    "description": "Optional description",
    "status": "published",
    "order": 2,
    "createdAt": "2024-01-15T00:00:00.000Z"
  },
  "message": "Resource added successfully."
}
```

### `type` values
| Value | Description |
|-------|-------------|
| `file` | Generic downloadable file |
| `link` | External URL (no file upload needed) |
| `pdf` | PDF document |
| `video` | Video link/embed |

---

## PUT `/api/admin/lessons/:lessonId/resources/:resourceId`

Update an existing resource. Accepts either a URL in the body or a file upload to replace the current file.

### URL Parameters
- `lessonId` — MongoDB ObjectId of the lesson
- `resourceId` — MongoDB ObjectId of the resource

### Request Body (all optional — JSON or `multipart/form-data`)
| Field | Description |
|-------|-------------|
| `file` | New file to upload (multipart only) — replaces the stored URL |
| `title` | Updated title |
| `type` | `file` \| `link` \| `pdf` \| `video` |
| `url` | New URL (if not uploading a file) |
| `description` | Updated description |
| `status` | `published` \| `hidden` |

### Response `200`
Updated resource object.

---

## DELETE `/api/admin/lessons/:lessonId/resources/:resourceId`

Delete a resource.

### URL Parameters
- `lessonId` — MongoDB ObjectId of the lesson
- `resourceId` — MongoDB ObjectId of the resource

### Response `200`
```json
{ "message": "Resource deleted." }
```

---

## PATCH `/api/admin/lessons/:lessonId/resources/reorder`

Update the display order of resources within a lesson.

### URL Parameters
- `lessonId` — MongoDB ObjectId of the lesson

### Request Body
```json
{
  "order": ["resourceId1", "resourceId2", "resourceId3"]
}
```

### Response `200`
```json
{ "message": "Resources reordered." }
```
