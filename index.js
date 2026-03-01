import express from 'express'
import { userRouter } from './routes/user.routes.js'
import { courseRouter } from './routes/course.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { initializeDatabase } from './database/db.js'

const PORT = 8000

const app = express()
app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)

async function startServer() {
    await initializeDatabase()
    app.listen(PORT, () => {
        console.log("server running on port: ", PORT)
    })
}

startServer()