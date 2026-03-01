import express from 'express'

export const courseRouter = express.Router()

courseRouter.post('/purchase', (req, res) => {
    res.send('all courses')
})

courseRouter.get('/preview', (req, res) => {
    res.send('allCoursesPage')
})
