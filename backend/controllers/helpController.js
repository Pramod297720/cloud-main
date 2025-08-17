// backend/controllers/helpController.js
import { pool } from '../db/db.js';
import { notify } from '../queues/sns.js';
export { updateHelpRequestStatus as replyToHelpRequest };

/**
 * POST /api/help/create
 * body: { subject, description }
 * inserts into help_requests (user_id, subject, description, status)
 */
export async function submitHelpRequest(req, res) {
    const { subject, description } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            `INSERT INTO help_requests (user_id, subject, description, status, created_at)
       VALUES (?, ?, ?, 'open', NOW())`,
            [userId, subject, description]
        );

        // SNS notify
        await notify('New Help Request', {
            userId,
            subject,
            description,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'Help request submitted' });
    } catch (err) {
        console.error('submitHelpRequest error:', err);
        res.status(500).json({ error: 'Unable to submit request' });
    }
}

/**
 * GET /api/help/my
 * lists current user’s help requests
 */
export async function getUserHelpRequests(req, res) {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            `SELECT id, subject, description, status, created_at, updated_at
       FROM help_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
            [userId]
        );

        res.json(rows);
    } catch (err) {
        console.error('getUserHelpRequests error:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
}

/**
 * GET /api/help/all  (admin)
 * lists all help requests with requester name
 */
export async function getAllHelpRequests(_req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT hr.id, hr.user_id, u.name AS requester,
              hr.subject, hr.description, hr.status,
              hr.created_at, hr.updated_at
       FROM help_requests hr
       JOIN users u ON u.id = hr.user_id
       ORDER BY hr.created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error('getAllHelpRequests error:', err);
        res.status(500).json({ error: 'Failed to fetch all help requests' });
    }
}

/**
 * PATCH /api/help/:id/status
 * body: { status }   -- allowed: 'open','in_progress','resolved','closed'
 * (Your table does NOT have reply_text/admin_id; this only updates status.)
 */
export async function updateHelpRequestStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = new Set(['open', 'in_progress', 'resolved', 'closed']);
    if (!allowed.has(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE help_requests
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
            [status, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error('updateHelpRequestStatus error:', err);
        res.status(500).json({ error: 'Update failed' });
    }
}

/**
 * DELETE /api/help/:id
 */
export async function deleteHelpRequest(req, res) {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM help_requests WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ message: 'Request deleted' });
    } catch (err) {
        console.error('deleteHelpRequest error:', err);
        res.status(500).json({ error: 'Delete failed' });
    }
}

/**
 * POST /api/threads/create
 * body: { title, body }
 * inserts into help_threads + first message into help_messages
 */
export async function createThread(req, res) {
    const { title, body } = req.body;

    try {
        // create thread
        const [result] = await pool.query(
            `INSERT INTO help_threads (user_id, title, status, created_at)
       VALUES (?, ?, 'open', NOW())`,
            [req.user.id, title]
        );
        const threadId = result.insertId;

        // first message
        await pool.query(
            `INSERT INTO help_messages (thread_id, sender_id, body, sent_at)
       VALUES (?, ?, ?, NOW())`,
            [threadId, req.user.id, body]
        );

        // SNS notify
        await notify('New Thread Created', {
            threadId,
            ownerId: req.user.id,
            title,
            firstMessage: body,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ threadId });
    } catch (err) {
        console.error('createThread error:', err);
        res.status(500).json({ error: 'Unable to create thread' });
    }
}

/**
 * POST /api/threads/:id/message
 * body: { body }
 * inserts into help_messages
 */
export async function postMessage(req, res) {
    const { id } = req.params;
    const { body } = req.body;

    try {
        await pool.query(
            `INSERT INTO help_messages (thread_id, sender_id, body, sent_at)
       VALUES (?, ?, ?, NOW())`,
            [id, req.user.id, body]
        );

        // SNS notify
        await notify('New Thread Message', {
            threadId: Number(id),
            senderId: req.user.id,
            body,
            createdAt: new Date().toISOString()
        });

        res.json({ ok: true });
    } catch (err) {
        console.error('postMessage error:', err);
        res.status(500).json({ error: 'Unable to post message' });
    }
}

/**
 * GET /api/threads/:id/messages
 */
export async function getThreadMessages(req, res) {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT m.id, m.thread_id, m.sender_id, u.name AS sender_name,
              m.body, m.sent_at
       FROM help_messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.thread_id = ?
       ORDER BY m.sent_at ASC`,
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error('getThreadMessages error:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}

/**
 * GET /api/threads/list
 */
export async function listThreads(_req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT t.id, t.title, t.status, t.created_at,
              u.name AS owner_name
       FROM help_threads t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error('listThreads error:', err);
        res.status(500).json({ error: 'Failed to fetch threads' });
    }
}
