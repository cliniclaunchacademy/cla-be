# Admin Recordings API

**Base path:** `/api/admin/recordings`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Recordings are organized in categories. Each category contains multiple recordings.

---

# RECORDING CATEGORIES

## GET `/api/admin/recordings`

Fetch all recording categories with recording count.

### Response `200`
```json
{
  "categories": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Weekly Webinars",
      "status": "published",
      "order": 1,
      "recordingCount": 12
    }
  ]
}
```

### `status` values
`published` | `hidden`

---

## POST `/api/admin/recordings/categories`

Create a new recording category.

### Request Body
```json
{
  "name": "Monthly Masterclasses",   // required
  "status": "published"              // required: "published" | "hidden"
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Monthly Masterclasses",
  "status": "published",
  "order": 2,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/recordings/categories/:categoryId`

Update a recording category.

### URL Parameters
- `categoryId` — MongoDB ObjectId of the category

### Request Body (all optional)
```json
{
  "name": "Updated Category Name",
  "status": "hidden"
}
```

### Response `200`
Updated category object.

---

## DELETE `/api/admin/recordings/categories/:categoryId`

Delete a category and all its recordings (cascade delete).

### URL Parameters
- `categoryId` — MongoDB ObjectId of the category

### Response `200`
```json
{ "message": "Category deleted." }
```

---

## PATCH `/api/admin/recordings/categories/reorder`

Update the display order of recording categories.

### Request Body
```json
{
  "order": ["categoryId1", "categoryId2", "categoryId3"]
}
```

### Response `200`
```json
{ "message": "Categories reordered." }
```

---

# RECORDINGS

## GET `/api/admin/recordings/categories/:categoryId/recordings`

Fetch all recordings within a specific category.

### URL Parameters
- `categoryId` — MongoDB ObjectId of the category

### Response `200`
```json
{
  "category": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Weekly Webinars",
    "status": "published"
  },
  "recordings": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
      "title": "Clinic Efficiency Tips",
      "subheading": "How to streamline your clinic workflow",
      "videoEmbed": "<iframe src='...'></iframe>",
      "recordedDate": "2024-01-10T00:00:00.000Z",
      "status": "published",
      "order": 1
    }
  ]
}
```

---

## POST `/api/admin/recordings/categories/:categoryId/recordings`

Add a new recording to a category.

### URL Parameters
- `categoryId` — MongoDB ObjectId of the category

### Request Body
```json
{
  "title": "Clinic Efficiency Tips",               // required
  "subheading": "Streamline your workflow",        // optional
  "videoEmbed": "<iframe src='...'></iframe>",     // required, raw embed HTML/URL
  "recordedDate": "2024-01-10T00:00:00.000Z",      // optional ISO date or null
  "status": "published"                            // required: "published" | "hidden"
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0r2",
  "category": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Clinic Efficiency Tips",
  "subheading": "Streamline your workflow",
  "videoEmbed": "<iframe src='...'></iframe>",
  "recordedDate": "2024-01-10T00:00:00.000Z",
  "status": "published",
  "order": 2,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/recordings/:recordingId`

Update an existing recording.

### URL Parameters
- `recordingId` — MongoDB ObjectId of the recording

### Request Body (all optional)
```json
{
  "title": "Updated Recording Title",
  "subheading": "Updated subheading",
  "videoEmbed": "<iframe src='...'></iframe>",
  "recordedDate": "2024-02-01T00:00:00.000Z",
  "status": "hidden"
}
```

### Response `200`
Updated recording object.

---

## DELETE `/api/admin/recordings/:recordingId`

Delete a single recording.

### URL Parameters
- `recordingId` — MongoDB ObjectId of the recording

### Response `200`
```json
{ "message": "Recording deleted." }
```

---

## PATCH `/api/admin/recordings/categories/:categoryId/recordings/reorder`

Update the display order of recordings within a category.

### URL Parameters
- `categoryId` — MongoDB ObjectId of the category

### Request Body
```json
{
  "order": ["recordingId1", "recordingId2", "recordingId3"]
}
```

### Response `200`
```json
{ "message": "Recordings reordered." }
```
