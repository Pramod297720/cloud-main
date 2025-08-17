// backend/routes/helpRoutes.js
import express from 'express';
import {
    submitHelpRequest,
    getAllHelpRequests,
    getUserHelpRequests,
    replyToHelpRequest,
    deleteHelpRequest,
} from '../controllers/helpController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ---------- health/ping (no auth) ---------- */
router.get('/health', (_req, res) => res.json({ ok: true, msg: 'help alive' }));

/* ---------- student endpoints ---------- */
router.post('/', requireAuth, submitHelpRequest);          // create help request
router.get('/mine', requireAuth, getUserHelpRequests);     // my requests

/* ---------- admin endpoints ---------- */
router.get('/', requireAuth, isAdmin, getAllHelpRequests); // all requests
router.post('/:id/reply', requireAuth, isAdmin, replyToHelpRequest);
router.delete('/:id', requireAuth, isAdmin, deleteHelpRequest);

export default router;
