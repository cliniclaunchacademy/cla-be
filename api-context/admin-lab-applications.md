# Admin Lab Applications API

**Base path:** `/api/admin/lab-applications`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

---

## GET `/api/admin/lab-applications`

Fetch paginated list of lab applications with optional filters.

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |
| `lab` | string | — | Filter by lab ObjectId |
| `status` | string | — | Filter by status: `pending`, `verified`, or `rejected` |
| `search` | string | — | Search by user name or email |
| `from` | string | — | ISO date — filter applications from this date |
| `to` | string | — | ISO date — filter applications to this date |

### Response `200`
```json
{
  "applications": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0a1",
      "user": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "lab": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0l1",
        "name": "Practice Management Lab"
      },
      "status": "pending",
      "rejectionReason": null,
      "appliedAt": "2024-01-15T10:30:00.000Z",
      "reviewedAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 83,
    "pages": 5
  }
}
```

### `status` values
`pending` | `verified` | `rejected`

---

## PATCH `/api/admin/lab-applications/bulk-status`

Update the status of multiple applications at once.

### Request Body
```json
{
  "applicationIds": ["64f1a2b3c4d5e6f7a8b9c0a1", "64f1a2b3c4d5e6f7a8b9c0a2"], // required, min 1
  "status": "verified",              // required: "pending" | "verified" | "rejected"
  "rejectionReason": "Not eligible"  // optional, recommended when status is "rejected"
}
```

### Response `200`
```json
{
  "updatedCount": 2,
  "message": "2 application(s) updated to \"verified\"."
}
```

---

## GET `/api/admin/lab-applications/:applicationId`

Fetch a single lab application by ID.

### URL Parameters
- `applicationId` — MongoDB ObjectId of the application

### Response `200`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0a1",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "lab": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0l1",
    "name": "Practice Management Lab"
  },
  "status": "pending",
  "rejectionReason": null,
  "appliedAt": "2024-01-15T10:30:00.000Z",
  "reviewedAt": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## PATCH `/api/admin/lab-applications/:applicationId/status`

Approve or reject a lab application.

### URL Parameters
- `applicationId` — MongoDB ObjectId of the application

### Request Body
```json
{
  "status": "verified",              // required: "pending" | "verified" | "rejected"
  "rejectionReason": "Not eligible"  // optional, recommended when status is "rejected"
}
```

### Response `200`
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0a1",
  "status": "verified",
  "rejectionReason": null,
  "reviewedAt": "2024-01-16T09:00:00.000Z",
  ...
}
```

### Notes
- `reviewedAt` is automatically set to the current timestamp when status is updated
- `reviewedBy` is automatically set to the admin user making the request
