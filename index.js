import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { userRouter } from './routes/user.routes.js'
import { courseRouter } from './routes/course.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { initializeDatabase } from './database/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())

// API routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

async function startServer() {
    await initializeDatabase()
    app.listen(PORT, () => {
        console.log("server running on port: ", PORT)
    })
}

startServer()