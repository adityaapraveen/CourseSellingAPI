import express from 'express'


import {adminSignin, adminSignup} from '../controllers/admin.controller.js'

export const adminRouter = express.Router()

adminRouter.post('/signup', adminSignup)

adminRouter.post('/signin', adminSignin)

adminRouter.post('/', (req, res) => {
    res.json("create course")
})

adminRouter.put('/', (req, res) => {
    res.json('update course')
})

adminRouter.get('/bulk', (req, res) => {
    res.json('get courses in bulk')
})