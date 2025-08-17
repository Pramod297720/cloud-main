import { notify } from '../queues/sns.js';

// ... inside POST /:id/message, AFTER INSERT succeeds:
await notify('New Thread Message', {
    threadId: id,
    senderId: req.user?.id,
    senderName: req.user?.name,
    body: content,
    createdAt: new Date().toISOString()
});
