import { Router } from 'express'
import { body } from 'express-validator'
import { login, getProfile, updateProfile, createAdmin } from '../controllers/auth.controller.js'
import { authenticate, authorize } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

const router = Router()

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate
], login)

router.get('/profile', authenticate, getProfile)

router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('newPassword').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate
], updateProfile)

router.post('/create-admin', authenticate, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['admin', 'editor']).withMessage('Invalid role'),
  validate
], createAdmin)

export default router

