import express from 'express'
import { userSignup, userSignin } from '../controllers/user.controller.js'

export const userRouter = express.Router()

userRouter.post('/signup', userSignup)

userRouter.post('/signin', userSignin)

userRouter.get('/purchases', (req, res) => {
    res.send('purchasePage')
})