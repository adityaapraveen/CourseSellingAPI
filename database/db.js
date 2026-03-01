import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db

async function initializeDatabase() {
    try {
        db = await open({
            filename: './course.db',
            driver: sqlite3.Database
        })

        console.log("Connected to Database Successfully")

        // Enable foreign keys
        await db.exec("PRAGMA foreign_keys = ON")

        // Create tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                firstName TEXT,
                lastName TEXT
            )
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                firstName TEXT,
                lastName TEXT
            )
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS course (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                price REAL,
                imageUrl TEXT,
                creatorId INTEGER,
                FOREIGN KEY (creatorId) REFERENCES admin(id) ON DELETE CASCADE
            )
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS purchase (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                courseId INTEGER,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (courseId) REFERENCES course(id) ON DELETE CASCADE,
                UNIQUE(userId, courseId)
            )
        `)

        console.log("All tables created successfully")
        return db
    } catch (err) {
        console.error("Database error:", err.message)
        process.exit(1)
    }
}

function getDatabase() {
    if (!db) {
        throw new Error("Database not initialized. Call initializeDatabase first.")
    }
    return db
}

export { initializeDatabase, getDatabase }
export default getDatabase