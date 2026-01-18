import { Router } from 'express'
import { body } from 'express-validator'
import { getTestimonials, getFeaturedTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'

const router = Router()

// Public routes
router.get('/', getTestimonials)
router.get('/featured', getFeaturedTestimonials)

// Admin routes
router.get('/admin/all', authenticate, getAllTestimonials)

router.post('/', authenticate, [
  body('client_name').trim().notEmpty().withMessage('Client name required'),
  body('content').trim().notEmpty().withMessage('Content required'),
  body('client_role').optional().trim(),
  body('client_company').optional().trim(),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  validate
], createTestimonial)

router.put('/:id', authenticate, updateTestimonial)
router.delete('/:id', authenticate, deleteTestimonial)

export default router

