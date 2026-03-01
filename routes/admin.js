import express from 'express'

export const adminRouter = express.Router()

adminRouter.post('/signup', (req, res) => {
    res.json('admin signin')
})

adminRouter.post('/signin', (req, res)=>{
    res.json('admin signup')
})

adminRouter.post('/course', (req, res) => {
    res.json("create course")
})

adminRouter.put('/course', (req, res) => {
    res.json('update course')
})

adminRouter.get('/course/bulk', (req, res)=>{
    res.json('get courses in bulk')
})