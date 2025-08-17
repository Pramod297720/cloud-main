// backend/controllers/threadController.js
import { pool } from '../db/db.js';
import { notify } from '../queues/sns.js';

async function notifySafe(subject, payload) {
    try {
        if (process.env.SNS_TOPIC_ARN) {
            await notify(subject, payload);
        }
    } catch (e) {
        console.error('[sns.notify] failed:', e?.message || e);
    }
}

/**
 * POST /api/threads   (body: { title, body })
 */
export async function createThread(req, res, next) {
    try {
        const { title, body } = req.body || {};
        const userId = req.user?.id;
        if (!userId || !title) {
            return res.status(400).json({ error: 'userId/title required' });
        }

        const [result] = await pool.query(
            `INSERT INTO help_threads (user_id, title, status, created_at)
       VALUES (?, ?, 'open', NOW())`,
            [userId, title]
        );
        const threadId = result.insertId;

        if (body) {
            await pool.query(
                `INSERT INTO help_messages (thread_id, sender_id, body, sent_at)
         VALUES (?, ?, ?, NOW())`,
                [threadId, userId, body]
            );
        }

        await notifySafe('New Thread Created', {
            threadId,
            ownerId: userId,
            title,
            firstMessage: body || '',
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ threadId, title, status: 'open' });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/threads  (admin = all; student = mine)
 */
export async function listThreads(req, res, next) {
    try {
        const isAdmin = req.user?.role === 'admin';
        const userId = req.user?.id;

        const sql = isAdmin
            ? `SELECT t.*, u.name AS owner_name
         FROM help_threads t
         JOIN users u ON u.id = t.user_id
         ORDER BY t.created_at DESC`
            : `SELECT t.*, u.name AS owner_name
         FROM help_threads t
         JOIN users u ON u.id = t.user_id
         WHERE t.user_id = ?
         ORDER BY t.created_at DESC`;

        const params = isAdmin ? [] : [userId];
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/threads/:id   (thread + messages)
 */
export async function getThread(req, res, next) {
    try {
        const { id } = req.params;

        const [[thread]] = await pool.query(
            `SELECT t.*, u.name AS owner_name
       FROM help_threads t
       JOIN users u ON u.id = t.user_id
       WHERE t.id = ?`,
            [id]
        );
        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        const [messages] = await pool.query(
            `SELECT m.*, u.name AS sender_name
       FROM help_messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.thread_id = ?
       ORDER BY m.sent_at ASC`,
            [id]
        );

        res.json({ thread, messages });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/threads/:id/messages   (body: { body })
 */
export async function addMessage(req, res, next) {
    try {
        const { id } = req.params;
        const { body } = req.body || {};
        const senderId = req.user?.id;

        if (!senderId || !body) {
            return res.status(400).json({ error: 'sender/body required' });
        }

        const [[exists]] = await pool.query(
            `SELECT id FROM help_threads WHERE id = ?`,
            [id]
        );
        if (!exists) return res.status(404).json({ error: 'Thread not found' });

        const [result] = await pool.query(
            `INSERT INTO help_messages (thread_id, sender_id, body, sent_at)
       VALUES (?, ?, ?, NOW())`,
            [id, senderId, body]
        );

        await notifySafe('New Thread Message', {
            threadId: Number(id),
            senderId,
            body,
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ id: result.insertId, thread_id: Number(id) });
    } catch (err) {
        next(err);
    }
}

/**
 * PATCH /api/threads/:id/close   (admin)
 */
export async function closeThread(req, res, next) {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE help_threads SET status='closed' WHERE id=?`,
            [id]
        );
        res.json({ ok: true, id: Number(id), status: 'closed' });
    } catch (err) {
        next(err);
    }
}
