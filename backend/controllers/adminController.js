import { pool } from '../db/db.js';
import bcrypt from 'bcryptjs';

// Create new user
export const createUser = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );

    res.json({ message: 'User created successfully' });
};

// Get all users
export const getAllUsers = async (req, res) => {
    const [users] = await pool.query('SELECT id, name, email, role FROM users');
    res.json({ count: users.length, users });
};
