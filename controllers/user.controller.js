import getDatabase from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_USER_PASSWORD } from '../configs/config.js'

export const userSignup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required.' })
    }

    try {
        const db = getDatabase()

        const existingUser = await db.get(
            'SELECT email FROM users WHERE email = ?',
            [email]
        )
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const result = await db.run(
            `INSERT INTO users (email, password, firstName, lastName)
             VALUES (?, ?, ?, ?)`,
            [email, hashedPass, firstName, lastName]
        )

        return res.status(201).json({ message: 'User created successfully', email })

    } catch (err) {
        console.error('SignUp Error: ', err)
        return res.status(500).json({ error: 'Server Error' })
    }

}

export const userSignin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password required' })
    }
    try {
        const db = getDatabase()
        const user = await db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        )

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" })
        }
        const isValidPass = await bcrypt.compare(password, user.password)
        if (!isValidPass) {
            return res.status(401).json({ message: "Invalid Password" })
        }
        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_USER_PASSWORD,
            { expiresIn: '7d' }
        )
        return res.status(200).json({
            message: 'Signed in successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        })
    } catch (err) {
        console.error('Signin error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
}

export const viewPurchasedCourses = async (req, res) => {
    const userId = req.userId

    try {
        const db = getDatabase()
        const purchases = await db.all(
            `SELECT course.* FROM course
             JOIN purchase ON course.id = purchase.courseId
             WHERE purchase.userId = ?`,
            [userId]
        )
        return res.status(200).json({ purchases })
    } catch (err) {
        console.error('Purchases error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
}