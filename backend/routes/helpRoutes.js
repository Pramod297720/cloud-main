// backend/routes/helpRoutes.js
import express from 'express';
import {
    submitHelpRequest,
    getAllHelpRequests,
    getUserHelpRequests,
    replyToHelpRequest,
    deleteHelpRequest
} from '../controllers/helpController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ---------- health/ping (no auth) ---------- */
router.get('/health', (_req, res) => res.json({ ok: true, msg: 'help alive' }));

/* ---------- student endpoints ---------- */
router.post('/', requireAuth, submitHelpRequest);                 // Submit new request
router.get('/mine', requireAuth, getUserHelpRequests);            // Get logged-in user's requests

/* ---------- admin endpoints ---------- */
router.get('/', requireAuth, isAdmin, getAllHelpRequests);        // Admin sees all
router.post('/:id/reply', requireAuth, isAdmin, replyToHelpRequest); // Admin replies
router.delete('/:id', requireAuth, isAdmin, deleteHelpRequest);   // Admin deletes

export default router;
