import { Router } from 'express';
import {
    submitHelpRequest,
    getUserHelpRequests,
    getAllHelpRequests,
    updateHelpRequestStatus,
    deleteHelpRequest,
    createThread,
    postMessage,
    getThreadMessages,
    listThreads
} from '../controllers/helpController.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

// Help requests
r.post('/help/create', requireAuth, submitHelpRequest);
r.get('/help/my', requireAuth, getUserHelpRequests);
r.get('/help/all', requireAuth, getAllHelpRequests);
r.patch('/help/:id/status', requireAuth, updateHelpRequestStatus);
r.delete('/help/:id', requireAuth, deleteHelpRequest);

// Threads
r.post('/threads/create', requireAuth, createThread);
r.post('/threads/:id/message', requireAuth, postMessage);
r.get('/threads/:id/messages', requireAuth, getThreadMessages);
r.get('/threads/list', requireAuth, listThreads);

export default r;
