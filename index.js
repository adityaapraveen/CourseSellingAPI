import express from 'express'
import { userRouter } from './routes/user.js'
import { courseRouter } from './routes/course.js'
const PORT = 8000

const app = express()
app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/course', courseRouter)


app.listen(PORT, () => {
    console.log('server running at', PORT)
})
