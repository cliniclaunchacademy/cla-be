# Admin Courses, Modules & Lessons API

**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

# COURSES

**Base path:** `/api/admin/courses`

## GET `/api/admin/courses`

Fetch all courses (flat list, ordered by `order` field).

### Response `200`
```json
{
  "courses": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to Clinic Management",
      "subheading": "Learn the basics",
      "about": "A detailed description of the course...",
      "thumbnail": "http://localhost:5000/uploads/thumb.jpg",
      "banner": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1775031850/cla/courses-backgrounds/CLA_ResourcesCEO_Mindset_svlk9l.jpg",
      "instructor": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "firstName": "Dr. Sarah",
        "lastName": "Johnson",
        "title": "Senior Consultant",
        "photo": "http://localhost:5000/uploads/instructor.jpg"
      },
      "status": "published",
      "comingSoon": false,
      "releaseDate": null,
      "order": 1,
      "moduleCount": 3,
      "lessonCount": 12,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### `status` values
`published` | `unpublished` | `draft`

---

## POST `/api/admin/courses`

Create a new course.

### Request Body
```json
{
  "title": "Advanced Clinic Operations",   // required
  "subheading": "Take your clinic further", // optional
  "about": "Full course description...",    // optional
  "banner": "https://res.cloudinary.com/example/image/upload/banner.jpg", // optional image URL string
  "instructorId": "64f1a2b3c4d5e6f7a8b9c0d2", // required, must be a valid Instructor ObjectId
  "status": "draft",                        // required: "draft" | "unpublished" | "published"
  "comingSoon": false,                      // optional boolean
  "releaseDate": "2024-06-01T00:00:00.000Z" // optional ISO date or null
}
```

### Response `201`
```json
{
  "course": { /* course object */ },
  "message": "Course created successfully."
}
```

---

## PUT `/api/admin/courses/:courseId`

Update an existing course.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course

### Request Body (all optional)
```json
{
  "title": "Updated Title",
  "subheading": "Updated subheading",
  "about": "Updated description",
  "banner": "https://res.cloudinary.com/example/image/upload/new-banner.jpg",  // send "" to clear
  "instructorId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "status": "published",
  "comingSoon": true,
  "releaseDate": "2024-08-01T00:00:00.000Z"  // send null to remove
}
```

### Response `200`
Updated course object.

---

## DELETE `/api/admin/courses/:courseId`

Delete a course and all its modules, lessons, and resources (cascade delete).

### Response `200`
```json
{ "message": "Course deleted." }
```

---

## PATCH `/api/admin/courses/reorder`

Update the display order of courses.

### Request Body
```json
{
  "order": [
    "64f1a2b3c4d5e6f7a8b9c0d1",
    "64f1a2b3c4d5e6f7a8b9c0d3",
    "64f1a2b3c4d5e6f7a8b9c0d5"
  ]
}
```
Send an array of all course IDs in the desired order.

### Response `200`
```json
{ "message": "Courses reordered successfully." }
```

---

## GET `/api/admin/courses/:courseId/editor`

Fetch full course structure for the course editor (includes modules and lessons).

### URL Parameters
- `courseId` — MongoDB ObjectId of the course

### Response `200`
```json
{
  "course": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to Clinic Management",
    "subheading": "Learn the basics",
    "about": "Full description...",
    "thumbnail": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/courses-thumbnails/abc123.jpg",
    "instructor": { /* instructor object */ },
    "status": "published",
    "comingSoon": false,
    "releaseDate": null,
    "order": 1
  },
  "modules": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0e1",
      "title": "Module 1: Getting Started",
      "order": 1,
      "lessons": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0f1",
          "title": "Lesson 1: Welcome",
          "subheading": "Introduction to the course",
          "videoEmbed": "<iframe src='...'></iframe>",
          "status": "published",
          "order": 1
        }
      ]
    }
  ]
}
```

---

## POST `/api/admin/courses/:courseId/thumbnail`

Upload a thumbnail image for a course.

### URL Parameters
- `courseId` — MongoDB ObjectId of the course

### Request
- **Content-Type:** `multipart/form-data`
- **Field name:** `thumbnail`
- **Accepted formats:** JPEG, PNG, WebP

### Response `200`
```json
{
  "thumbnail": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/courses-thumbnails/abc123.jpg",
  "message": "Thumbnail uploaded."
}
```

### Notes
- Image is uploaded to Cloudinary under the `cla/courses-thumbnails` folder
- Response URL is a full Cloudinary `https://` URL — save and use it directly as `<img src>`
- Max file size: 5MB. Accepted formats: JPEG, PNG, WebP

---

# MODULES

**Base path:** `/api/admin/courses/:courseId/modules`

## POST `/api/admin/courses/:courseId/modules`

Create a new module within a course.

### Request Body
```json
{
  "title": "Module 2: Advanced Topics"   // required
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0e2",
  "title": "Module 2: Advanced Topics",
  "course": "64f1a2b3c4d5e6f7a8b9c0d1",
  "order": 2,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/courses/:courseId/modules/:moduleId`

Rename an existing module.

### Request Body
```json
{
  "title": "Updated Module Title"   // required
}
```

### Response `200`
Updated module object.

---

## DELETE `/api/admin/courses/:courseId/modules/:moduleId`

Delete a module and all its lessons and resources (cascade delete).

### Response `200`
```json
{ "message": "Module deleted." }
```

---

## PATCH `/api/admin/courses/:courseId/modules/reorder`

Update the display order of modules within a course.

### Request Body
```json
{
  "order": ["moduleId1", "moduleId2", "moduleId3"]
}
```

### Response `200`
```json
{ "message": "Modules reordered." }
```

---

# LESSONS

**Base path:** `/api/admin/courses/:courseId/modules/:moduleId/lessons`

## POST `/api/admin/courses/:courseId/modules/:moduleId/lessons`

Create a new lesson within a module.

### Request Body
```json
{
  "title": "Lesson 3: Deep Dive",         // required
  "subheading": "A detailed walkthrough", // optional
  "videoEmbed": "<iframe ...></iframe>",  // optional, raw embed HTML
  "status": "draft",                      // required: "draft" | "published"
  "comingSoon": false,                    // optional boolean
  "releaseDate": null                     // optional ISO date or null
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0f3",
  "title": "Lesson 3: Deep Dive",
  "subheading": "A detailed walkthrough",
  "videoEmbed": "<iframe ...></iframe>",
  "status": "draft",
  "comingSoon": false,
  "releaseDate": null,
  "module": "64f1a2b3c4d5e6f7a8b9c0e1",
  "order": 3,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId`

Update an existing lesson.

### Request Body (all optional)
```json
{
  "title": "Updated Lesson Title",
  "subheading": "Updated subheading",
  "videoEmbed": "<iframe ...></iframe>",
  "status": "published",
  "comingSoon": false,
  "releaseDate": null
}
```

### Response `200`
Updated lesson object.

---

## DELETE `/api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId`

Delete a lesson and all its resources.

### Response `200`
```json
{ "message": "Lesson deleted." }
```

---

## PATCH `/api/admin/courses/:courseId/modules/:moduleId/lessons/reorder`

Update the display order of lessons within a module.

### Request Body
```json
{
  "order": ["lessonId1", "lessonId2", "lessonId3"]
}
```

### Response `200`
```json
{ "message": "Lessons reordered." }
```
