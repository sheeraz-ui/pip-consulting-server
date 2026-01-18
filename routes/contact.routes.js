import { Router } from 'express'
import { body } from 'express-validator'
import { createContact, getContacts, getContact, markAsReplied, deleteContact, getUnreadCount } from '../controllers/contact.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

const router = Router()

// Public route
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('message').trim().notEmpty().withMessage('Message required'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('subject').optional().trim(),
  validate
], createContact)

// Admin routes
router.get('/', authenticate, getContacts)
router.get('/unread-count', authenticate, getUnreadCount)
router.get('/:id', authenticate, getContact)
router.patch('/:id/replied', authenticate, markAsReplied)
router.delete('/:id', authenticate, deleteContact)

export default router

