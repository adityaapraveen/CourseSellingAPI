import getDatabase from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_ADMIN_PASSWORD } from '../configs/config.js'

export const adminSignup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required.' })
    }

    try {
        const db = getDatabase()

        const existingAdmin = await db.get(
            'SELECT email FROM admin WHERE email = ?',
            [email]
        )
        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const result = await db.run(
            `INSERT INTO admin (email, password, firstName, lastName)
             VALUES (?, ?, ?, ?)`,
            [email, hashedPass, firstName, lastName]
        )

        return res.status(201).json({ message: 'Admin created successfully', email })

    } catch (err) {
        console.error('SignUp Error: ', err)
        return res.status(500).json({ error: 'Server Error' })
    }

}

export const adminSignin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password required' })
    }
    try {
        const db = getDatabase()
        const admin = await db.get(
            `SELECT * FROM admin WHERE email = ?`,
            [email]
        )

        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials" })
        }
        const isValidPass = await bcrypt.compare(password, admin.password)
        if (!isValidPass) {
            return res.status(401).json({ error: "Invalid Password" })
        }
        // Generate JWT
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            JWT_ADMIN_PASSWORD,
            { expiresIn: '7d' }
        )
        return res.status(200).json({
            message: 'Signed in successfully',
            admin: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName
            },
            token
        })
    } catch (err) {
        console.error('Signin error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
}

export const adminCreateCourse = async (req, res) => {
    const adminId = req.userId
    const { title, description, price, imageUrl } = req.body

    if (!title || !description || !price || !imageUrl) {
        return res.status(400).json({ error: "All fields are required." })
    }

    try {
        const db = getDatabase()
        const result = await db.run(
            `INSERT INTO course (title, description, price, imageUrl, creatorId)
            VALUES (?, ?, ?, ?, ?)`, [title, description, price, imageUrl, adminId]
        )
        return res.status(201).json({
            message: "Course Created Successfully",
            courseId: result.lastID
        })
    } catch (err) {
        console.error('Create course error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
}

export const adminEditCourseDetails = async (req, res) => {
    const adminId = req.userId
    const { courseId } = req.params
    const { title, description, price, imageUrl } = req.body

    try {
        const db = getDatabase()

        // Check if course exists and belongs to this admin
        const course = await db.get(
            `SELECT * FROM course WHERE id = ? AND creatorId = ?`,
            [courseId, adminId]
        )

        if (!course) {
            return res.status(404).json({ error: "Course not found or unauthorized" })
        }

        await db.run(
            `UPDATE course SET title = ?, description = ?, price = ?, imageUrl = ?
             WHERE id = ? AND creatorId = ?`,
            [title, description, price, imageUrl, courseId, adminId]
        )

        return res.status(200).json({ message: "Course updated successfully" })

    } catch (err) {
        console.error('Update course error:', err)
        return res.status(500).json({ error: 'Server error' })
    }

}

export const adminFetchAllCourses = async (req, res) => {
    const adminId = req.userId

    try {
        const db = getDatabase()

        const courses = await db.all(
            `SELECT * FROM course WHERE creatorId = ?`,
            [adminId]
        )

        return res.status(200).json({
            message: "Courses fetched successfully",
            courses
        })

    } catch (err) {
        console.error('Bulk fetch error:', err)
        return res.status(500).json({ error: 'Server error' })
    }
}