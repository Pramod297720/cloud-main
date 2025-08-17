// backend/routes/helpRoutes.js
import express from 'express';
import {
    submitHelpRequest,
    getAllHelpRequests,
    getUserHelpRequests,
    updateHelpRequestStatus,
    deleteHelpRequest,
} from '../controllers/helpController.js';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/* health/ping (no auth) */
router.get('/health', (_req, res) => res.json({ ok: true, msg: 'help alive' }));

/* student endpoints */
router.post('/', requireAuth, submitHelpRequest);
router.get('/mine', requireAuth, getUserHelpRequests);

/* admin endpoints */
router.get('/', requireAuth, isAdmin, getAllHelpRequests);

/* keep backward-compatible "reply" path; it just updates status */
router.post('/:id/reply', requireAuth, isAdmin, updateHelpRequestStatus);

/* RESTful status update */
router.patch('/:id/status', requireAuth, isAdmin, updateHelpRequestStatus);

router.delete('/:id', requireAuth, isAdmin, deleteHelpRequest);

export default router;
