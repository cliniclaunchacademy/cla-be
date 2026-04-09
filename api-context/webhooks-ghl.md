# GoHighLevel Webhook API

**Base path:** `/api/webhooks/ghl`
**Authentication:** None (JWT not required) — verified via `x-ghl-secret` header

This endpoint is triggered automatically by GoHighLevel when a student submits a lab application form. It is not called by the frontend.

---

## POST `/api/webhooks/ghl/lab-application`

Receives a GHL form submission and creates a lab application in the database.

### How it works
1. Verifies the `x-ghl-secret` header matches `GHL_WEBHOOK_SECRET` env var
2. Extracts the user's email from the payload using the field path configured in `GHL_EMAIL_FIELD` (default: `email`)
3. Extracts the lab name from the payload using the field path configured in `GHL_LAB_FIELD` (default: `lab_name`)
4. Looks up the registered user by email — skips silently if not found
5. Looks up the lab partner by name (case-insensitive) — skips silently if not found
6. Prevents duplicate applications (one per user per lab)
7. Stores the **entire raw payload** as `formData` — no field assumptions are made

### Required env vars
| Variable | Description |
|----------|-------------|
| `GHL_WEBHOOK_SECRET` | Shared secret — send as `x-ghl-secret` header in GHL |
| `GHL_EMAIL_FIELD` | Dot-notation path to email in payload (default: `email`) |
| `GHL_LAB_FIELD` | Dot-notation path to lab name in payload (default: `lab_name`) |

> **Tip:** Once you inspect a real GHL payload, update `GHL_EMAIL_FIELD` and `GHL_LAB_FIELD` without touching any code.
> For example, if GHL sends `{ "contact": { "email": "..." } }`, set `GHL_EMAIL_FIELD=contact.email`.

### Request
- **Method:** `POST`
- **Content-Type:** `application/json` (GHL sends JSON by default)
- **Header:** `x-ghl-secret: <GHL_WEBHOOK_SECRET>`
- **Body:** Raw GHL form payload — structure depends on the GHL form fields

### Example payload (shape will vary — this is illustrative)
```json
{
  "email": "student@example.com",
  "lab_name": "Practice Management Lab",
  "first_name": "John",
  "phone": "555-0100",
  "any_other_field": "value"
}
```

### Response `200` — processed successfully
```json
{
  "received": true,
  "processed": true,
  "applicationId": "64f1a2b3c4d5e6f7a8b9c0a1"
}
```

### Response `200` — received but not processed (GHL will not retry)
```json
{
  "received": true,
  "processed": false,
  "reason": "No registered user found for this email."
}
```

Possible `reason` values:
| Reason | Cause |
|--------|-------|
| `Missing email or lab name field.` | Payload did not contain the configured field paths |
| `No registered user found for this email.` | Email not matched to a registered account |
| `No lab partner found for the submitted lab name.` | Lab name not matched to a LabPartner document |
| `Application already exists for this user and lab.` | Duplicate submission — ignored |

### Response `401`
```json
{ "success": false, "error": "Unauthorized webhook request." }
```
Returned when `x-ghl-secret` is missing or incorrect.

### Notes
- Always returns `200` for data mismatches so GHL does not flood with retries
- The full payload is stored in `formData` as-is — the admin panel renders these key-value pairs
- Setting up this webhook in GHL: see the setup steps below

---

## Setting up the GHL form and webhook

### Step 1 — Create a form in GoHighLevel
1. In GHL, go to **Sites → Forms → Builder**
2. Click **+ New Form**
3. Add the fields you need (e.g. Full Name, Phone, etc.)
4. Add a **Hidden Field** named `lab_name` — set its default value to the exact lab name as it appears in your database (e.g. `Practice Management Lab`)
5. Make sure the form has an **Email** field (GHL standard field — should map to `email` in the payload)
6. Save and publish the form

### Step 2 — Add the webhook in GHL
1. In GHL, go to **Settings → Integrations → Webhooks** (or find Webhook inside the form settings)
2. Click **+ Add Webhook**
3. Set the **Endpoint URL** to:
   ```
   https://your-api-domain.com/api/webhooks/ghl/lab-application
   ```
4. Set the **Method** to `POST`
5. Under **Custom Headers**, add:
   - Key: `x-ghl-secret`
   - Value: the value of your `GHL_WEBHOOK_SECRET` env var
6. Set the **Trigger** to: Form Submitted (select your lab application form)
7. Save

### Step 3 — Test the webhook
1. Submit a test response on the form using an email that belongs to a registered user
2. Check your server logs for `[GHL Webhook] Application created:`
3. Verify the application appears in the admin lab applications panel
4. If it doesn't process, the log will print `processed: false` with a `reason`

### Step 4 — Update field paths if needed
After your first test submission, check the raw log output to see the actual payload shape GHL sends.
If the email or lab name is nested (e.g. under a `contact` object), update your `.env`:
```
GHL_EMAIL_FIELD=contact.email
GHL_LAB_FIELD=formData.lab_name
```
No code changes needed.
