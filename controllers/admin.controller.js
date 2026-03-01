import getDatabase from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const JWT_ADMIN_PASSWORD = "samsonsanju"


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
            return res.status(401).json({ message: "Invalid Password" })
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