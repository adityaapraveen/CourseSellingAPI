import express from 'express'

import {
    adminSignin,
    adminSignup,
    adminCreateCourse,
    adminEditCourseDetails,
    adminFetchAllCourses
} from '../controllers/admin.controller.js'
import { adminMiddleware } from '../middlewares/admin.middleware.js'

export const adminRouter = express.Router()

adminRouter.post('/signup', adminSignup)

adminRouter.post('/signin', adminSignin)

adminRouter.post('/course', adminMiddleware, adminCreateCourse)

adminRouter.put('/course/:courseId', adminMiddleware, adminEditCourseDetails)

adminRouter.get('/course/bulk', adminMiddleware, adminFetchAllCourses)