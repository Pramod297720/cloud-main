// controllers/helpController.js
import { pool } from '../db/db.js';

export async function submitHelpRequest(req, res) {
    const { title, message } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            'INSERT INTO help_requests (user_id, title, message, created_at) VALUES (?, ?, ?, NOW())',
            [userId, title, message]
        );
        res.json({ message: 'Help request submitted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to submit request' });
    }
}

export async function getUserHelpRequests(req, res) {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(`
      SELECT hr.*, u.name as admin_name
      FROM help_requests hr
      LEFT JOIN users u ON hr.admin_id = u.id
      WHERE hr.user_id = ?
      ORDER BY hr.created_at DESC
    `, [userId]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
}

export async function getAllHelpRequests(_req, res) {
    try {
        const [rows] = await pool.query(`
      SELECT hr.*, u.name as requester
      FROM help_requests hr
      JOIN users u ON hr.user_id = u.id
      ORDER BY hr.created_at DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all help requests' });
    }
}

// controllers/helpController.js
export async function replyToHelpRequest(req, res) {
    const { id } = req.params;
    const { reply } = req.body;
    const adminId = req.user.id;

    try {
        await pool.query(`
            UPDATE help_requests
            SET reply_text = ?, replied_at = NOW(), admin_id = ?, status = 'responded'
            WHERE id = ?
        `, [reply, adminId, id]);

        res.json({ message: 'Reply sent and status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Reply failed' });
    }
}


export async function deleteHelpRequest(req, res) {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM help_requests WHERE id = ?', [id]);
        res.json({ message: 'Request deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Delete failed' });
    }
}


export async function createThread(req, res) {
    const { title, body } = req.body;
    const [[{ threadId }]] = await pool.query(
        `CALL CreateThread(?,?,?)`, [req.user.id, title, body]); // or plain INSERT + INSERT
    res.json({ threadId });
}

export async function postMessage(req, res) {
    const { id } = req.params;
    const { body } = req.body;
    await pool.query(
        `INSERT INTO help_messages (thread_id,sender_id,body) VALUES (?,?,?)`,
        [id, req.user.id, body]);
    res.json({ ok: true });
}

