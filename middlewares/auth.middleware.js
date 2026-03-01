import jwt from 'jsonwebtoken'
import { JWT_USER_PASSWORD } from '../configs/config.js'

export function userMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_USER_PASSWORD)
        req.user = decoded
        req.userId = decoded.id
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}