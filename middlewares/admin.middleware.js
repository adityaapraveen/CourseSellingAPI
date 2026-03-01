import jwt from 'jsonwebtoken'
import { JWT_ADMIN_PASSWORD } from '../configs/config.js'

export function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD)
        req.user = decoded
        req.userId = decoded.id  // this is what the route reads

        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}