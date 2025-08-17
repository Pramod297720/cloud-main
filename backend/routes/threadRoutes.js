// backend/routes/threadRoutes.js
import express from 'express';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';
import {
    createThread,
    listThreads,
    getThread,
    addMessage,
    closeThread,
} from '../controllers/threadController.js';

const router = express.Router();

router.post('/', requireAuth, createThread);
router.get('/', requireAuth, listThreads);
router.get('/:id', requireAuth, getThread);
router.post('/:id/messages', requireAuth, addMessage);
router.patch('/:id/close', requireAuth, isAdmin, closeThread);

export default router;
