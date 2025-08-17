import { pool } from '../db/db.js';

export async function addReply({ requestId, adminId, reply }) {
    const sql = 'INSERT INTO help_replies (request_id, admin_id, reply_text) VALUES (?,?,?)';
    await pool.query(sql, [requestId, adminId, reply]);
}

export async function listThreadsForUser(userId) {
    const sql = `
    SELECT h.id AS id, h.title, h.message, h.created_at,
           r.reply_text, r.replied_at, a.name AS admin_name
    FROM help_requests h
    LEFT JOIN help_replies r ON r.request_id = h.id
    LEFT JOIN users a        ON a.id = r.admin_id
    WHERE h.user_id = ?
    ORDER BY h.created_at DESC`;
    const [rows] = await pool.query(sql, [userId]);
    return rows;
}
