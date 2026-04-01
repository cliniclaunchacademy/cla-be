# Admin Settings API

**Base path:** `/api/admin/settings`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Global platform settings (single document — always get/update the same record).

---

## GET `/api/admin/settings`

Fetch the current platform settings.

### Response `200`
```json
{
  "settings": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0s1",
    "discordInviteUrl": "https://discord.gg/abc123",
    "supportEmail": "support@cliniclaunch.com",
    "maintenanceMode": false,
    "maintenanceMessage": "We are currently performing scheduled maintenance. Please check back soon.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PUT `/api/admin/settings`

Update platform settings. All fields are optional — only send the fields you want to change.

### Request Body (all optional)
```json
{
  "discordInviteUrl": "https://discord.gg/newlink",
  "supportEmail": "help@cliniclaunch.com",
  "maintenanceMode": true,
  "maintenanceMessage": "We'll be back in 2 hours."
}
```

### Response `200`
```json
{
  "settings": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0s1",
    "discordInviteUrl": "https://discord.gg/newlink",
    "supportEmail": "help@cliniclaunch.com",
    "maintenanceMode": true,
    "maintenanceMessage": "We'll be back in 2 hours.",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### Field Descriptions
| Field | Type | Description |
|-------|------|-------------|
| `discordInviteUrl` | string | Discord community invite link shown to students |
| `supportEmail` | string | Support email displayed on the platform (must be valid email) |
| `maintenanceMode` | boolean | When `true`, students are blocked from accessing the platform with a 503 response. Admins are not affected. |
| `maintenanceMessage` | string | Message shown to students during maintenance |

### Notes
- Enabling `maintenanceMode: true` immediately blocks all student API requests with HTTP `503`
- Admin accounts bypass maintenance mode and can still access admin APIs
