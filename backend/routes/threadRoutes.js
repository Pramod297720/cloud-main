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

// Create a new thread
router.post('/', requireAuth, createThread);

// List threads (admin = all, student = mine)
router.get('/', requireAuth, listThreads);

// Get a thread with messages
router.get('/:id', requireAuth, getThread);

// Post a message into a thread
router.post('/:id/messages', requireAuth, addMessage);

// Close a thread (admin only)
router.patch('/:id/close', requireAuth, isAdmin, closeThread);

export default router;
