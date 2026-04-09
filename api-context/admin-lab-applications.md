# Admin Lab Applications API

**Base path:** `/api/admin/lab-applications`
**Authentication:** Required — Admin JWT (`Authorization: Bearer <token>`)

Lab applications are created automatically when a student submits a GoHighLevel form. The entire form payload is stored as `formData` (flexible key-value pairs) since GHL form fields can vary per lab.

---

## GET `/api/admin/lab-applications`

Fetch paginated list of lab applications with optional filters.

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |
| `lab` | string | — | Filter by lab ObjectId |
| `status` | string | — | Filter by status: `pending`, `in-review`, `approved`, or `rejected` |
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
      "formData": {
        "email": "john@example.com",
        "lab_name": "Practice Management Lab",
        "first_name": "John",
        "phone": "555-0100"
      },
      "submittedEmail": "john@example.com",
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
`pending` | `in-review` | `approved` | `rejected`

### Notes
- `formData` contains the raw key-value pairs from the GHL form — field names depend on how the GHL form is configured
- `submittedEmail` is the raw email from the GHL payload (for traceability, in case user email changes)

---

## PATCH `/api/admin/lab-applications/bulk-status`

Update the status of multiple applications at once.

### Request Body
```json
{
  "applicationIds": ["64f1a2b3c4d5e6f7a8b9c0a1", "64f1a2b3c4d5e6f7a8b9c0a2"],
  "status": "approved",
  "rejectionReason": "Not eligible"
}
```

| Field | Required | Values |
|-------|----------|--------|
| `applicationIds` | yes (min 1) | array of ObjectId strings |
| `status` | yes | `pending` \| `in-review` \| `approved` \| `rejected` |
| `rejectionReason` | optional | string, recommended when status is `rejected` |

### Response `200`
```json
{
  "updatedCount": 2,
  "message": "2 application(s) updated to \"approved\"."
}
```

---

## GET `/api/admin/lab-applications/:applicationId`

Fetch a single lab application by ID, including the full `formData` payload.

### URL Parameters
- `applicationId` — MongoDB ObjectId of the application

### Response `200`
```json
{
  "application": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0a1",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profilePhoto": null
    },
    "lab": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0l1",
      "name": "Practice Management Lab",
      "logo": "https://...",
      "status": "live",
      "portalUrl": "https://lab.example.com",
      "applicationEmbed": "<iframe ...>"
    },
    "formData": {
      "email": "john@example.com",
      "lab_name": "Practice Management Lab",
      "first_name": "John",
      "phone": "555-0100",
      "any_ghl_field": "value"
    },
    "submittedEmail": "john@example.com",
    "status": "pending",
    "rejectionReason": null,
    "appliedAt": "2024-01-15T10:30:00.000Z",
    "reviewedAt": null,
    "reviewedBy": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PATCH `/api/admin/lab-applications/:applicationId/status`

Update the status of a single lab application.

### URL Parameters
- `applicationId` — MongoDB ObjectId of the application

### Request Body
```json
{
  "status": "approved",
  "rejectionReason": "Not eligible"
}
```

| Field | Required | Values |
|-------|----------|--------|
| `status` | yes | `pending` \| `in-review` \| `approved` \| `rejected` |
| `rejectionReason` | optional | string, recommended when status is `rejected` |

### Response `200`
```json
{
  "application": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0a1",
    "status": "approved",
    "rejectionReason": null,
    "reviewedAt": "2024-01-16T09:00:00.000Z",
    "reviewedBy": { ... }
  },
  "message": "Application status updated."
}
```

### Errors
All error responses follow the standard structure: `{ "success": false, "error": "Human-readable message." }` — see `overview.md`.

| Status | Condition |
|--------|-----------|
| `404` | Application not found |

### Notes
- `reviewedAt` is automatically set to the current timestamp
- `reviewedBy` is automatically set to the admin making the request
