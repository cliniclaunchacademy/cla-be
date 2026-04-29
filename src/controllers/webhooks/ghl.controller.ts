import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../../models/user.schema';
import { LabPartner } from '../../models/lab_partner.schema';
import { LabApplication } from '../../models/lab_application.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { sendWelcomeSetPasswordEmail } from '../../utils/email';

/**
 * Reads a value from a nested object using dot-notation.
 * e.g. getNestedField({ contact: { email: 'a@b.com' } }, 'contact.email') → 'a@b.com'
 * Configured via GHL_EMAIL_FIELD and GHL_LAB_FIELD env vars.
 */
function getNestedField(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * POST /api/webhooks/ghl/lab-application
 *
 * Receives a GoHighLevel form webhook when a student submits a lab application form.
 * Verifies the request via the x-ghl-secret header.
 * Stores the entire payload as flexible formData — no field assumptions are made here.
 * Field paths for email and lab name are configured via env vars so they can be updated
 * once the real GHL payload shape is known, without touching code.
 *
 * Required env vars:
 *   GHL_WEBHOOK_SECRET  — shared secret sent by GHL in the x-ghl-secret header
 *   GHL_EMAIL_FIELD     — dot-notation path to the user's email in the payload (default: "email")
 *   GHL_LAB_FIELD       — dot-notation path to the lab name in the payload (default: "lab_name")
 */
export const receiveGHLLabApplication = async (req: Request, res: Response): Promise<void> => {
  // ── 1. Verify webhook secret ────────────────────────────────────────────────
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[GHL Webhook] GHL_WEBHOOK_SECRET is not configured.');
    sendError(res, 500, 'Webhook not configured.');
    return;
  }

  const incomingSecret = req.headers['x-ghl-secret'];
  if (!incomingSecret || incomingSecret !== secret) {
    console.warn('[GHL Webhook] Rejected — invalid or missing x-ghl-secret header.');
    sendError(res, 401, 'Unauthorized webhook request.');
    return;
  }

  // ── 2. Parse payload ────────────────────────────────────────────────────────
  const payload = req.body as Record<string, unknown>;

  if (!payload || typeof payload !== 'object') {
    sendError(res, 400, 'Invalid payload.');
    return;
  }

  // Field paths are configurable — update env vars once you know the GHL payload shape
  const emailField = process.env.GHL_EMAIL_FIELD || 'email';
  const labField = process.env.GHL_LAB_FIELD || 'lab_name';

  const submittedEmail = getNestedField(payload, emailField) as string | undefined;
  const submittedLabName = getNestedField(payload, labField) as string | undefined;

  if (!submittedEmail || !submittedLabName) {
    console.warn('[GHL Webhook] Missing email or lab name in payload.', {
      emailField,
      labField,
      payloadKeys: Object.keys(payload),
    });
    // Return 200 so GHL does not retry — this is a data issue, not a server issue
    sendResponse(res, 200, { received: true, processed: false, reason: 'Missing email or lab name field.' });
    return;
  }

  // ── 3. Resolve user by email ─────────────────────────────────────────────────
  const user = await User.findOne({ email: submittedEmail.toLowerCase().trim() });
  if (!user) {
    console.warn('[GHL Webhook] No registered user found for email:', submittedEmail);
    // Return 200 so GHL does not retry — user may not be registered yet
    sendResponse(res, 200, { received: true, processed: false, reason: 'No registered user found for this email.' });
    return;
  }

  // ── 4. Resolve lab by name ───────────────────────────────────────────────────
  const lab = await LabPartner.findOne({ name: { $regex: new RegExp(`^${submittedLabName.trim()}$`, 'i') } });
  if (!lab) {
    console.warn('[GHL Webhook] No lab partner found for name:', submittedLabName);
    sendResponse(res, 200, { received: true, processed: false, reason: 'No lab partner found for the submitted lab name.' });
    return;
  }

  // ── 5. Prevent duplicate applications ───────────────────────────────────────
  const existing = await LabApplication.findOne({ user: user._id, lab: lab._id });
  if (existing) {
    console.log('[GHL Webhook] Duplicate application ignored for user:', user.email, 'lab:', lab.name);
    sendResponse(res, 200, { received: true, processed: false, reason: 'Application already exists for this user and lab.' });
    return;
  }

  // ── 6. Store application ────────────────────────────────────────────────────
  // The entire payload is stored as formData — no assumptions about field names.
  // Once GHL payload shape is confirmed, the frontend can render formData entries as-is.
  const application = await LabApplication.create({
    user: user._id,
    lab: lab._id,
    formData: payload,
    submittedEmail: submittedEmail.toLowerCase().trim(),
    status: 'pending',
    appliedAt: new Date(),
  });

  console.log('[GHL Webhook] Application created:', application._id, '| user:', user.email, '| lab:', lab.name);
  sendResponse(res, 200, { received: true, processed: true, applicationId: application._id });
};

/**
 * Generates a unique username from first + last name.
 * Tries "firstname.lastname", then "firstname.lastname1", "firstname.lastname2", etc.
 */
async function generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
  const base = `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}`.replace(/[^a-z0-9.]/g, '');
  let candidate = base;
  let suffix = 1;
  while (await User.exists({ username: candidate })) {
    candidate = `${base}${suffix}`;
    suffix++;
  }
  return candidate;
}

/**
 * POST /api/webhooks/ghl/user-created
 *
 * Triggered by GoHighLevel when a new contact is created.
 * Automatically provisions a student account and sends a set-password welcome email.
 *
 * Required env vars:
 *   GHL_WEBHOOK_SECRET — shared secret in x-ghl-secret header
 */
export const receiveGHLUserCreated = async (req: Request, res: Response): Promise<void> => {
  // ── 1. Verify webhook secret ────────────────────────────────────────────────
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[GHL UserCreated] GHL_WEBHOOK_SECRET is not configured.');
    sendError(res, 500, 'Webhook not configured.');
    return;
  }

  const incomingSecret = req.headers['x-ghl-secret'];
  if (!incomingSecret || incomingSecret !== secret) {
    console.warn('[GHL UserCreated] Rejected — invalid or missing x-ghl-secret header.');
    sendError(res, 401, 'Unauthorized webhook request.');
    return;
  }

  // ── 2. Parse payload ────────────────────────────────────────────────────────
  const payload = req.body as Record<string, unknown>;
  if (!payload || typeof payload !== 'object') {
    sendResponse(res, 200, { received: true, processed: false, reason: 'Invalid payload.' });
    return;
  }

  console.log('[GHL UserCreated] Incoming payload:', JSON.stringify(payload, null, 2));

  const email = (payload.email as string | undefined)?.toLowerCase().trim();
  const firstName = (payload.firstName as string | undefined)?.trim();
  const lastName = (payload.lastName as string | undefined)?.trim();

  if (!email || !firstName || !lastName) {
    console.warn('[GHL UserCreated] Missing required fields in payload.', {
      payloadKeys: Object.keys(payload),
    });
    // Return 200 so GHL does not retry — this is a data issue, not a server error
    sendResponse(res, 200, { received: true, processed: false, reason: 'Missing email, firstName, or lastName.' });
    return;
  }

  // ── 3. Idempotency — skip if account already exists ─────────────────────────
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('[GHL UserCreated] Account already exists for:', email, '— skipping.');
    sendResponse(res, 200, { received: true, processed: false, reason: 'Account already exists.' });
    return;
  }

  // ── 4. Generate unique username ──────────────────────────────────────────────
  const username = await generateUniqueUsername(firstName, lastName);

  // ── 5. Create account with a random hashed password ─────────────────────────
  // The plain-text password is never exposed — user sets their own via the welcome email link.
  const tempPassword = crypto.randomBytes(32).toString('hex');
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  const user = await User.create({
    email,
    firstName,
    lastName,
    username,
    password: hashedPassword,
    role: 'student',
    status: 'active',
    is_whitelisted: true,
  });

  // ── 6. Generate reset token and send set-password welcome email ──────────────
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await User.findByIdAndUpdate(user._id, { resetToken: hashedToken, resetTokenExpiry, welcomeEmailSent: true });

  try {
    await sendWelcomeSetPasswordEmail(email, firstName, lastName, rawToken);
  } catch (emailErr) {
    // Account is created — don't fail the webhook over an email error
    console.error('[GHL UserCreated] Welcome email failed for:', email, emailErr instanceof Error ? emailErr.message : emailErr);
  }

  console.log('[GHL UserCreated] Account created:', user._id, '| email:', email, '| username:', username);
  sendResponse(res, 200, { received: true, processed: true, userId: user._id });
};
