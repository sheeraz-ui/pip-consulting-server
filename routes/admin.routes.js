import { Router } from 'express'
import { getDashboardStats, getRecentActivity } from '../controllers/dashboard.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

router.get('/dashboard', getDashboardStats)
router.get('/dashboard/activity', getRecentActivity)

export default router
