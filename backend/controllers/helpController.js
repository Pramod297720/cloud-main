// backend/controllers/helpController.js
import { pool } from '../db/db.js';

/**
 * POST /api/help
 * body: { title, message }
 * role: student
 */
export async function submitHelpRequest(req, res) {
    const userId = req.user?.id;
    const { title, message } = req.body || {};
    if (!userId || !title || !message) {
        return res.status(400).json({ error: 'userId/title/message required' });
    }
    try {
        await pool.query(
            `INSERT INTO help_requests (user_id, title, message, status, created_at, updated_at)
       VALUES (?, ?, ?, 'open', NOW(), NOW())`,
            [userId, title, message]
        );
        res.status(201).json({ message: 'Help request submitted' });
    } catch (err) {
        console.error('[help.submit]', err);
        res.status(500).json({ error: 'Unable to submit request' });
    }
}

/**
 * GET /api/help/mine
 * role: student
 */
export async function getUserHelpRequests(req, res) {
    const userId = req.user?.id;
    try {
        const [rows] = await pool.query(
            `SELECT hr.*, u.name AS admin_name
       FROM help_requests hr
       LEFT JOIN users u ON hr.admin_id = u.id
       WHERE hr.user_id = ?
       ORDER BY hr.created_at DESC`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('[help.mine]', err);
        res.status(500).json({ error: 'Unable to fetch requests' });
    }
}

/**
 * GET /api/help
 * role: admin
 */
export async function getAllHelpRequests(_req, res) {
    try {
        const [rows] = await pool.query(
            `SELECT hr.*, su.name AS student_name, au.name AS admin_name
       FROM help_requests hr
       JOIN users su ON su.id = hr.user_id
       LEFT JOIN users au ON au.id = hr.admin_id
       ORDER BY hr.created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error('[help.all]', err);
        res.status(500).json({ error: 'Unable to fetch help requests' });
    }
}

/**
 * PATCH /api/help/:id/status
 * or POST /api/help/:id/reply (compat)
 * body: { status, admin_note }
 * role: admin
 */
export async function updateHelpRequestStatus(req, res) {
    const { id } = req.params;
    const adminId = req.user?.id;
    const { status, admin_note } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status required' });

    try {
        await pool.query(
            `UPDATE help_requests
         SET status = ?, admin_id = ?, admin_note = ?, updated_at = NOW()
       WHERE id = ?`,
            [status, adminId || null, admin_note || null, id]
        );
        res.json({ ok: true, id: Number(id), status });
    } catch (err) {
        console.error('[help.updateStatus]', err);
        res.status(500).json({ error: 'Unable to update status' });
    }
}

/**
 * DELETE /api/help/:id
 * role: admin
 */
export async function deleteHelpRequest(req, res) {
    const { id } = req.params;
    try {
        const [result] = await pool.query(`DELETE FROM help_requests WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Help request not found' });
        }
        res.json({ ok: true, id: Number(id), message: 'Help request deleted' });
    } catch (err) {
        console.error('[help.delete]', err);
        res.status(500).json({ error: 'Unable to delete request' });
    }
}
