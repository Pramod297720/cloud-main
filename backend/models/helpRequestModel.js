// Backend/models/helpRequestModel.js
import { pool } from '../db/db.js';

export async function createHelp({ userId, title, message }) {
    const sql = 'INSERT INTO help_requests (user_id, title, message) VALUES (?,?,?)';
    const [result] = await pool.query(sql, [userId, title, message]);
    return result.insertId;
}

export async function listAllHelp() {
    const sql = `
     SELECT h.id, h.title, h.message, h.status, h.created_at,
            u.name AS requester
     FROM help_requests h
     JOIN users u ON u.id = h.user_id
     ORDER BY h.created_at DESC`;
    const [rows] = await pool.query(sql);
    return rows;
}
