# Admin Labs API

**Base path:** `/api/admin/labs`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Labs are external tools/environments students can apply to access.

---

## GET `/api/admin/labs`

Fetch all labs.

### Response `200`
```json
{
  "labs": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Practice Management Lab",
      "subheading": "Hands-on practice management tools",
      "logo": "http://localhost:5000/uploads/lab-logo.jpg",
      "portalUrl": "https://lab.example.com",
      "applicationEmbed": "<iframe src='...'></iframe>",
      "status": "live",
      "releaseDate": null,
      "maintenanceMsg": "",
      "order": 1,
      "totalApplications": 45,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `status` values
| Value | Description |
|-------|-------------|
| `live` | Lab is active and accessible |
| `coming_soon` | Lab not yet released |
| `maintenance` | Lab is temporarily down |

---

## POST `/api/admin/labs`

Create a new lab.

### Request Body
```json
{
  "name": "Billing & Coding Lab",              // required
  "subheading": "Master medical billing",      // optional
  "portalUrl": "https://billing-lab.example.com", // optional
  "applicationEmbed": "<iframe ...></iframe>", // optional, raw embed HTML for application form
  "status": "coming_soon",                     // required: "live" | "coming_soon" | "maintenance"
  "releaseDate": "2024-06-01T00:00:00.000Z",  // optional ISO date or null
  "maintenanceMsg": ""                         // optional, shown when status is "maintenance"
}
```

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Billing & Coding Lab",
  "subheading": "Master medical billing",
  "logo": null,
  "portalUrl": "https://billing-lab.example.com",
  "applicationEmbed": "<iframe ...></iframe>",
  "status": "coming_soon",
  "releaseDate": "2024-06-01T00:00:00.000Z",
  "maintenanceMsg": "",
  "order": 2,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PUT `/api/admin/labs/:labId`

Update an existing lab.

### URL Parameters
- `labId` — MongoDB ObjectId of the lab

### Request Body (all optional)
```json
{
  "name": "Updated Lab Name",
  "subheading": "Updated subheading",
  "portalUrl": "https://new-url.com",
  "applicationEmbed": "<iframe ...></iframe>",
  "status": "live",
  "releaseDate": null,
  "maintenanceMsg": "We'll be back soon!"
}
```

### Response `200`
Updated lab object.

---

## DELETE `/api/admin/labs/:labId`

Delete a lab and all associated applications (cascade delete).

### URL Parameters
- `labId` — MongoDB ObjectId of the lab

### Response `200`
```json
{ "message": "Lab deleted." }
```

---

## POST `/api/admin/labs/:labId/logo`

Upload a logo image for a lab.

### URL Parameters
- `labId` — MongoDB ObjectId of the lab

### Request
- **Content-Type:** `multipart/form-data`
- **Field name:** `logo`
- **Accepted formats:** JPEG, PNG, WebP

### Response `200`
```json
{
  "logo": "https://res.cloudinary.com/dy0j4c40y/image/upload/v1234567890/cla/lab-logos/abc123.jpg",
  "message": "Lab logo updated."
}
```

### Notes
- Image is uploaded to Cloudinary under the `cla/lab-logos` folder
- Response URL is a full Cloudinary `https://` URL — save and use it directly as `<img src>`
- Max file size: 5MB. Accepted formats: JPEG, PNG, WebP

---

## PATCH `/api/admin/labs/reorder`

Update the display order of labs.

### Request Body
```json
{
  "order": ["labId1", "labId2", "labId3"]
}
```

### Response `200`
```json
{ "message": "Labs reordered." }
```
