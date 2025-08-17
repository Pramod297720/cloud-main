// ESM module
import { pool } from '../db/db.js';

/**
 * POST /api/threads
 * body: { title }
 */
export async function createThread(req, res, next) {
    try {
        const userId = req.user?.id; // requires requireAuth middleware to set req.user
        const { title } = req.body || {};
        if (!userId || !title) return res.status(400).json({ message: 'userId/title required' });

        const [result] = await pool.query(
            `INSERT INTO help_threads (user_id, title, status, created_at)
       VALUES (?, ?, 'open', NOW())`,
            [userId, title]
        );
        res.status(201).json({ id: result.insertId, user_id: userId, title, status: 'open' });
    } catch (err) { next(err); }
}

/**
 * GET /api/threads
 *  - Admin: all threads
 *  - Student: only their own
 */
export async function listThreads(req, res, next) {
    try {
        const isAdmin = req.user?.role === 'admin';
        const userId = req.user?.id;

        const sql = isAdmin
            ? `SELECT t.*, u.name AS user_name, u.email AS user_email
         FROM help_threads t JOIN users u ON u.id = t.user_id
         ORDER BY t.created_at DESC`
            : `SELECT t.*
         FROM help_threads t
         WHERE t.user_id = ?
         ORDER BY t.created_at DESC`;

        const params = isAdmin ? [] : [userId];
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) { next(err); }
}

/**
 * GET /api/threads/:id
 *  - Returns a thread and its messages
 */
export async function getThread(req, res, next) {
    try {
        const { id } = req.params;

        const [[thread]] = await pool.query(
            `SELECT t.*, u.name AS user_name
       FROM help_threads t
       JOIN users u ON u.id = t.user_id
       WHERE t.id = ?`,
            [id]
        );
        if (!thread) return res.status(404).json({ message: 'Thread not found' });

        const [messages] = await pool.query(
            `SELECT m.*, u.name AS sender_name
       FROM help_messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.thread_id = ?
       ORDER BY m.sent_at ASC`,
            [id]
        );

        res.json({ thread, messages });
    } catch (err) { next(err); }
}

/**
 * POST /api/threads/:id/messages
 * body: { body }
 */
export async function addMessage(req, res, next) {
    try {
        const { id } = req.params;          // thread_id
        const senderId = req.user?.id;
        const { body } = req.body || {};
        if (!senderId || !body) return res.status(400).json({ message: 'sender/body required' });

        // ensure thread exists (optional)
        const [[thread]] = await pool.query(`SELECT id FROM help_threads WHERE id=?`, [id]);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });

        const [result] = await pool.query(
            `INSERT INTO help_messages (thread_id, sender_id, body, sent_at)
       VALUES (?, ?, ?, NOW())`,
            [id, senderId, body]
        );

        res.status(201).json({ id: result.insertId, thread_id: id, sender_id: senderId, body });
    } catch (err) { next(err); }
}

/**
 * PATCH /api/threads/:id/close
 */
export async function closeThread(req, res, next) {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE help_threads SET status='closed' WHERE id=?`,
            [id]
        );
        res.json({ ok: true, id, status: 'closed' });
    } catch (err) { next(err); }
}
