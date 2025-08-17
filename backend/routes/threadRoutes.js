import express from 'express';
import { requireAuth, isAdmin } from '../middleware/authMiddleware.js';
import {
    createThread,
    listThreads,
    getThread,
    addMessage,
    closeThread,
} from '../controllers/threadController.js'; // <-- exact file & .js

const router = express.Router();

// Create a new thread (student)
router.post('/', requireAuth, createThread);

// List threads (admin = all, student = mine)
router.get('/', requireAuth, listThreads);

// Get one thread + messages
router.get('/:id', requireAuth, getThread);

// Add message to a thread
router.post('/:id/messages', requireAuth, addMessage);

// Close a thread (admin)
router.patch('/:id/close', requireAuth, isAdmin, closeThread);

export default router;
