import { Router } from 'express';
import { receiveGHLLabApplication } from '../../controllers/webhooks/ghl.controller';

const router = Router();

/**
 * Health check — use this to verify the webhook base URL is reachable.
 * GET https://your-api-domain.com/api/webhooks/ghl/health
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', webhook: 'ghl', timestamp: new Date().toISOString() });
});

/**
 * Webhook receiver for GoHighLevel form submissions.
 * No JWT auth — verified instead via x-ghl-secret header.
 * Configure the full URL in GHL as:
 *   POST https://your-api-domain.com/api/webhooks/ghl/lab-application
 * with header: x-ghl-secret: <GHL_WEBHOOK_SECRET>
 */
router.post('/lab-application', receiveGHLLabApplication);

export default router;
