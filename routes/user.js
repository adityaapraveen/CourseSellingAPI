import express from 'express'

export const userRouter = express.Router()

userRouter.post('/signin', (req, res) => {
    res.send('loginPage')
})

userRouter.post('/signup', (req, res) => {
    res.send('signupPage')
})

userRouter.get('/purchases', (req, res) => {
    res.send('purchasePage')
})