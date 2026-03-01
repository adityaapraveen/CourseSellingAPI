import express from 'express'

export const courseRouter = express.Router()

app.post('/purchase', (req, res) => {
    res.send('all courses')
})

app.get('/preview', (req, res) => {
    res.send('allCoursesPage')
})
