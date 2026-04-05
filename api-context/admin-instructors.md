# Admin Instructors API

**Base path:** `/api/admin/instructors`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/instructors`

Fetch all instructors.

### Response `200`
```json
{
  "instructors": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "firstName": "Dr. Sarah",
      "lastName": "Johnson",
      "title": "Senior Clinic Consultant",
      "bio": "Dr. Sarah has 15 years of experience...",
      "photo": "http://localhost:5000/uploads/instructor.jpg",
      "status": "active",
      "coursesAssigned": 3,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `status` values
`active` | `inactive`

---

## POST `/api/admin/instructors`

Create a new instructor.

### Request Body
```json
{
  "firstName": "Dr. Sarah",              // required
  "lastName": "Johnson",                 // required
  "title": "Senior Clinic Consultant",   // required
  "bio": "Dr. Sarah has 15 years...",    // optional
  "status": "active"                     // required: "active" | "inactive"
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "firstName": "Dr. Sarah",
  "lastName": "Johnson",
  "title": "Senior Clinic Consultant",
  "bio": "Dr. Sarah has 15 years...",
  "photo": null,
  "status": "active",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/instructors/:instructorId`

Update an existing instructor.

### URL Parameters
- `instructorId` — MongoDB ObjectId of the instructor

### Request Body (all optional)
```json
{
  "firstName": "Dr. Sarah",
  "lastName": "Johnson",
  "title": "Lead Consultant",
  "bio": "Updated biography...",
  "status": "inactive"
}
```

### Response `200`
Updated instructor object.

---

## POST `/api/admin/instructors/:instructorId/photo`

Upload a profile photo for an instructor.

### URL Parameters
- `instructorId` — MongoDB ObjectId of the instructor

### Request
- **Content-Type:** `multipart/form-data`
- **Field name:** `photo`
- **Accepted formats:** JPEG, PNG, WebP

### Response `200`
```json
{
  "photo": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/instructors/abc123.jpg",
  "message": "Instructor photo updated."
}
```

### Notes
- Image is uploaded to Cloudinary under the `cla/instructors` folder
- Response URL is a full Cloudinary `https://` URL — save and use it directly as `<img src>`
- Max file size: 5MB. Accepted formats: JPEG, PNG, WebP

---

## DELETE `/api/admin/instructors/:instructorId`

Delete an instructor.

### URL Parameters
- `instructorId` — MongoDB ObjectId of the instructor

### Response `200`
```json
{ "message": "Instructor deleted." }
```

### Errors
All error responses follow the standard structure: `{ "success": false, "error": "Human-readable message." }` — see `overview.md`.

| Status | Condition |
|--------|-----------|
| `400` | Instructor is assigned to one or more published or unpublished courses — unassign them first |

### Notes
- Deletion is blocked if the instructor is currently assigned to any `published` or `unpublished` courses
- Safe to delete if only assigned to `draft` courses or no courses at all
