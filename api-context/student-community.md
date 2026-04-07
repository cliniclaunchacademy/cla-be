# Student Community API

**Base path:** `/api/student/community`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

---

## GET `/api/student/community`

Fetch all active community links, ordered by `order` field.

### Response `200`
```json
{
  "links": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0c1",
      "imageUrl": "https://res.cloudinary.com/.../community/banner1.jpg",
      "discord": "https://discord.gg/abc123"
    }
  ]
}
```

### Notes
- Only links with `active: true` are returned
- Links are sorted by their `order` field
- `discord` may be `null` if no invite link is configured for that banner
