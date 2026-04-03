# Student Recordings API

**Base path:** `/api/student/recordings`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

Recordings are categorized video sessions (webinars, masterclasses, etc.).

---

## GET `/api/student/recordings`

Fetch all published recording categories, each with their published recordings nested.

### Response `200`
```json
{
  "categories": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c1",
      "name": "Weekly Webinars",
      "recordings": [
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
          "title": "Clinic Efficiency Tips",
          "subheading": "Streamline your workflow in 5 steps",
          "videoEmbed": "https://player.vimeo.com/video/123456789",
          "recordedDate": "2024-01-10T00:00:00.000Z"
        },
        {
          "_id": "64f1a2b3c4d5e6f7a8b9c0r2",
          "title": "Patient Communication Mastery",
          "subheading": "How to handle difficult conversations",
          "videoEmbed": "https://player.vimeo.com/video/987654321",
          "recordedDate": "2024-01-03T00:00:00.000Z"
        }
      ]
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c2",
      "name": "Monthly Masterclasses",
      "recordings": []
    }
  ]
}
```

### Notes
- Only `published` categories are returned, ordered by `order` field
- Only `published` recordings are nested inside each category, ordered by `order` field
- Categories with no published recordings are included with an empty `recordings` array

---

## GET `/api/student/recordings/:id`

Fetch a single recording by its ID for the player page.

### URL Parameters
- `id` — MongoDB ObjectId of the recording

### Response `200`
```json
{
  "recording": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0r1",
    "title": "Clinic Efficiency Tips",
    "subheading": "Streamline your workflow in 5 steps",
    "videoEmbed": "https://player.vimeo.com/video/123456789",
    "recordedDate": "2024-01-10T00:00:00.000Z",
    "categoryName": "Weekly Webinars"
  }
}
```

### Notes
- Returns `404` if the recording does not exist or is not `published`
- `videoEmbed` is a plain video player URL (e.g. `https://player.vimeo.com/video/...`) — use as `src` of an `<iframe>`
- `categoryName` is resolved from the recording's parent category
