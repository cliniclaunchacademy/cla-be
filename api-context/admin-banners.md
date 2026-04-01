# Admin Banners API

**Base path:** `/api/admin/banners`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Banners are displayed on the student dashboard as a carousel/slider.

---

## GET `/api/admin/banners`

Fetch all banners.

### Response `200`
```json
{
  "banners": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0b1",
      "imageUrl": "http://localhost:5000/uploads/banner-abc123.jpg",
      "label": "New Course Available!",
      "status": "active",
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `status` values
`active` | `inactive`

---

## POST `/api/admin/banners`

Create a new banner with an image upload.

### Request
- **Content-Type:** `multipart/form-data`

### Form Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | file | Yes | Banner image (JPEG, PNG, WebP) |
| `label` | string | Yes | Short label/caption for the banner |

### Response `201`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0b2",
  "imageUrl": "http://localhost:5000/uploads/banner-xyz789.jpg",
  "label": "Summer Sale — 50% Off!",
  "status": "active",
  "order": 2,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

---

## PATCH `/api/admin/banners/:bannerId`

Update a banner's label or status (does not change the image).

### URL Parameters
- `bannerId` — MongoDB ObjectId of the banner

### Request Body (all optional)
```json
{
  "label": "Updated Banner Label",
  "status": "inactive"
}
```

### Response `200`
Updated banner object.

---

## DELETE `/api/admin/banners/:bannerId`

Delete a banner.

### URL Parameters
- `bannerId` — MongoDB ObjectId of the banner

### Response `200`
```json
{ "message": "Banner deleted." }
```

---

## PATCH `/api/admin/banners/reorder`

Update the display order of banners.

### Request Body
```json
{
  "order": ["bannerId1", "bannerId2", "bannerId3"]
}
```

### Response `200`
```json
{ "message": "Banners reordered." }
```
