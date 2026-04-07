# Admin Community Links API

**Base path:** `/api/admin/community`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/community`

Fetch all community links (active and inactive), ordered by `order` field.

### Response `200`
```json
{
  "links": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c1",
      "imageUrl": "https://res.cloudinary.com/.../community/banner1.jpg",
      "discord": "https://discord.gg/abc123",
      "order": 1,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## POST `/api/admin/community`

Create a new community link. `order` auto-increments if not provided.

### Request Body
```json
{
  "imageUrl": "https://res.cloudinary.com/.../community/banner1.jpg", // required
  "discord": "https://discord.gg/abc123", // optional
  "order": 1,                             // optional — auto-assigned if omitted
  "active": true                          // optional, default: true
}
```

### Response `201`
```json
{
  "link": { /* community link object */ },
  "message": "Community link created."
}
```

---

## POST `/api/admin/community/:linkId/image`

Upload a banner image for a community link.

### URL Parameters
- `linkId` — MongoDB ObjectId of the community link

### Request
- **Content-Type:** `multipart/form-data`
- **Field name:** `image`
- **Accepted formats:** JPEG, PNG, WebP

### Response `200`
```json
{
  "imageUrl": "https://res.cloudinary.com/.../cla/community/abc123.jpg",
  "message": "Image uploaded."
}
```

---

## PUT `/api/admin/community/:linkId`

Update an existing community link.

### URL Parameters
- `linkId` — MongoDB ObjectId of the community link

### Request Body (all optional)
```json
{
  "imageUrl": "https://res.cloudinary.com/.../community/banner2.jpg",
  "discord": "https://discord.gg/xyz789",
  "order": 2,
  "active": false
}
```

### Response `200`
Updated community link object.

---

## DELETE `/api/admin/community/:linkId`

Delete a community link.

### URL Parameters
- `linkId` — MongoDB ObjectId of the community link

### Response `200`
```json
{ "message": "Community link deleted." }
```
