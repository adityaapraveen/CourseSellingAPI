import express from 'express'

const PORT = 8000

const app = express()
app.use(express.json())

app.get('/login', (req, res) => {
    res.send('loginPage')
})

app.get('/signup', (req, res) => {
    res.send('signupPage')
})

app.get('/all-courses', (req, res) => {
    res.send('allCoursesPage')
})

app.get('/purchase', (req, res) => {
    res.send('purchasePage')
})

app.get('/purchased-courses', (req, res) => {
    res.send('purchasedCoursesPage')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})