# Student Labs API

**Base path:** `/api/student/labs`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

Labs are external tools/environments. Students can apply to gain access to a lab.

---

## GET `/api/student/labs`

Fetch all labs along with the student's application status for each.

### Response `200`
```json
{
  "labs": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0l1",
      "name": "Practice Management Lab",
      "subheading": "Hands-on practice management tools",
      "logo": "http://localhost:5000/uploads/lab-logo.jpg",
      "portalUrl": "https://lab.example.com",
      "applicationEmbed": "<iframe src='...'></iframe>",
      "status": "live",
      "releaseDate": null,
      "maintenanceMsg": "",
      "order": 1,
      "applicationStatus": "verified",
      "rejectionReason": null,
      "applicationId": "64f1a2b3c4d5e6f7a8b9c0a1"
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0l2",
      "name": "Billing & Coding Lab",
      "subheading": "Master medical billing",
      "logo": "http://localhost:5000/uploads/billing-logo.jpg",
      "portalUrl": "https://billing.example.com",
      "applicationEmbed": "<iframe src='...'></iframe>",
      "status": "live",
      "releaseDate": null,
      "maintenanceMsg": "",
      "order": 2,
      "applicationStatus": null,
      "rejectionReason": null,
      "applicationId": null
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0l3",
      "name": "EHR Simulation Lab",
      "subheading": "Practice with EHR systems",
      "logo": null,
      "portalUrl": null,
      "applicationEmbed": null,
      "status": "coming_soon",
      "releaseDate": "2024-06-01T00:00:00.000Z",
      "maintenanceMsg": "",
      "order": 3,
      "applicationStatus": null,
      "rejectionReason": null,
      "applicationId": null
    }
  ]
}
```

### `status` values
| Value | Description |
|-------|-------------|
| `live` | Lab is active — students can apply |
| `coming_soon` | Lab not yet released |
| `maintenance` | Lab temporarily unavailable — show `maintenanceMsg` |

### `applicationStatus` values
| Value | Description |
|-------|-------------|
| `null` | Student has not applied |
| `pending` | Application submitted, awaiting admin review |
| `verified` | Application approved — student has access |
| `rejected` | Application denied — see `rejectionReason` |

### UI Logic Hints
- Show "Apply" button only if `applicationStatus === null` and `status === "live"`
- Show "Pending" badge if `applicationStatus === "pending"`
- Show "Access Lab" / portal link if `applicationStatus === "verified"` (use `portalUrl`)
- Show "Rejected" with reason if `applicationStatus === "rejected"` (show `rejectionReason`)
- Show "Coming Soon" label if `status === "coming_soon"` (optionally show `releaseDate`)
- Show maintenance message if `status === "maintenance"` (show `maintenanceMsg`)
- If `applicationEmbed` is set, render it as an embedded application form when the student applies

---

## POST `/api/student/labs/:labId/apply`

Submit an application to access a lab.

### URL Parameters
- `labId` — MongoDB ObjectId of the lab

### Request Body
None

### Response `201`
```json
{
  "applicationId": "64f1a2b3c4d5e6f7a8b9c0a2",
  "status": "pending",
  "appliedAt": "2024-01-15T11:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| `400` | Student has already applied to this lab |
| `404` | Lab not found |

### Notes
- A student can only have one application per lab
- After applying, the application appears in the admin's lab applications panel for review
