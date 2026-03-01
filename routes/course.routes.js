import express from 'express'
import getDatabase from '../database/db.js'
import { userMiddleware } from '../middlewares/auth.middleware.js'

export const courseRouter = express.Router()

// Get all available courses (public)
courseRouter.get('/preview', async (req, res) => {
    try {
        const db = getDatabase()
        const courses = await db.all(`SELECT * FROM course`)
        return res.status(200).json({ courses })
    } catch (err) {
        console.error('Preview error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
})

// Purchase a course (protected)
courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const userId = req.userId
    const { courseId } = req.body

    try {
        const db = getDatabase()

        // Check if course exists
        const course = await db.get(
            `SELECT * FROM course WHERE id = ?`, [courseId]
        )
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // Check if already purchased
        const existing = await db.get(
            `SELECT * FROM purchase WHERE userId = ? AND courseId = ?`,
            [userId, courseId]
        )
        if (existing) {
            return res.status(409).json({ error: 'Course already purchased' })
        }

        await db.run(
            `INSERT INTO purchase (userId, courseId) VALUES (?, ?)`,
            [userId, courseId]
        )

        return res.status(201).json({ message: 'Course purchased successfully' })

    } catch (err) {
        console.error('Purchase error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
})