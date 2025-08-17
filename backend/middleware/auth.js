// Backend/middleware/auth.js
import jwt from 'jsonwebtoken';

/* ---------- Verify JWT ---------- */
export function authJWT(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.sendStatus(401);

    try {
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;          // { id, role, name } from login
        next();
    } catch (err) {
        return res.sendStatus(401);
    }
}

/* ---------- Role guard ---------- */
export const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.sendStatus(403);
    next();
};
