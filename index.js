import express from 'express'
import { userRouter } from './routes/user'
import { courseRouter } from './routes/course'
const PORT = 8000

const app = express()
app.use(express.json())

app.use('/user', userRouter)
app.use('/course', courseRouter)


app.listen(PORT, () => {
    console.log('server running at ', PORT)
})
