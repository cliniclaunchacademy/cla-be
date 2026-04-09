# Student Labs API

**Base path:** `/api/student/labs`
**Authentication:** Required — Student JWT (`Authorization: Bearer <token>`)

Labs are external tools/environments. Students apply by submitting a GoHighLevel (GHL) form — the form triggers a webhook that creates the application automatically. The student portal only reads application status.

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
      "applicationStatus": "approved",
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

### `status` values (lab partner status)
| Value | Description |
|-------|-------------|
| `live` | Lab is active |
| `coming_soon` | Lab not yet released |
| `maintenance` | Lab temporarily unavailable — show `maintenanceMsg` |

### `applicationStatus` values
| Value | Description |
|-------|-------------|
| `null` | Student has not applied (no GHL form submitted) |
| `pending` | Application received via GHL form, awaiting admin review |
| `in-review` | Admin is actively reviewing the application |
| `approved` | Application approved — student has access |
| `rejected` | Application denied — see `rejectionReason` |

### UI Logic Hints
- If `applicationStatus === null` and `status === "live"`: show the GHL embedded form (`applicationEmbed`) so student can apply
- Show "Pending" badge if `applicationStatus === "pending"`
- Show "In Review" badge if `applicationStatus === "in-review"`
- Show "Access Lab" / portal link if `applicationStatus === "approved"` (use `portalUrl`)
- Show "Rejected" with reason if `applicationStatus === "rejected"` (show `rejectionReason`)
- Show "Coming Soon" label if `status === "coming_soon"` (optionally show `releaseDate`)
- Show maintenance message if `status === "maintenance"` (show `maintenanceMsg`)

### Notes
- Applications are created automatically via the GHL webhook (`POST /api/webhooks/ghl/lab-application`) — there is no manual apply endpoint
- The student is matched to their application by the email on their account
- `applicationEmbed` contains the GHL form embed code to render in the UI when the student has not yet applied
