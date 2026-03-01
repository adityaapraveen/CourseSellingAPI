import express from 'express'
import { userSignup, userSignin, viewPurchasedCourses } from '../controllers/user.controller.js'
import { userMiddleware } from '../middlewares/auth.middleware.js'
export const userRouter = express.Router()

userRouter.post('/signup', userSignup)

userRouter.post('/signin', userSignin)

userRouter.get('/purchases', userMiddleware, viewPurchasedCourses)