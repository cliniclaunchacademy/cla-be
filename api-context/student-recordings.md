# Student Recordings API

**Base path:** `/api/student/recordings`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

Recordings are categorized video sessions (webinars, masterclasses, etc.).

---

## GET `/api/student/recordings`

Fetch all published recording categories with their recording count.

### Response `200`
```json
{
  "categories": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c1",
      "name": "Weekly Webinars",
      "status": "published",
      "order": 1,
      "recordingCount": 12
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c2",
      "name": "Monthly Masterclasses",
      "status": "published",
      "order": 2,
      "recordingCount": 4
    }
  ]
}
```

### Notes
- Only `published` categories are returned
- Categories are ordered by their `order` field

---

## GET `/api/student/recordings/:categoryId`

Fetch all published recordings within a specific category, with optional filters.

### URL Parameters
- `categoryId` — MongoDB ObjectId of the recording category

### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search recordings by title or subheading |
| `from` | string | ISO date — filter recordings from this date (based on `recordedDate`) |
| `to` | string | ISO date — filter recordings up to this date (based on `recordedDate`) |

### Response `200`
```json
{
  "category": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0c1",
    "name": "Weekly Webinars",
    "status": "published"
  },
  "recordings": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
      "title": "Clinic Efficiency Tips",
      "subheading": "Streamline your workflow in 5 steps",
      "videoEmbed": "https://player.vimeo.com/video/123456789",
      "recordedDate": "2024-01-10T00:00:00.000Z",
      "status": "published",
      "order": 1
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0r2",
      "title": "Patient Communication Mastery",
      "subheading": "How to handle difficult conversations",
      "videoEmbed": "https://player.vimeo.com/video/123456789",
      "recordedDate": "2024-01-03T00:00:00.000Z",
      "status": "published",
      "order": 2
    }
  ]
}
```

### Notes
- Only `published` recordings are returned
- `videoEmbed` is a plain video player URL (e.g. `https://player.vimeo.com/video/...`) — use it as the `src` of an `<iframe>` on the frontend
- `recordedDate` is the original recording date (not upload date)
- Use `from` and `to` together to filter by date range
