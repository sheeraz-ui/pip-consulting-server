import pool from '../config/db.js'

export async function getTestimonials(req, res) {
  try {
    const [testimonials] = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY sort_order ASC'
    )
    res.json({ success: true, data: testimonials })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
}

export async function getFeaturedTestimonials(req, res) {
  try {
    const [testimonials] = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = TRUE AND is_featured = TRUE ORDER BY sort_order ASC LIMIT 6'
    )
    res.json({ success: true, data: testimonials })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
}

export async function getAllTestimonials(req, res) {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY sort_order ASC')
    res.json({ success: true, data: testimonials })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
}

export async function createTestimonial(req, res) {
  try {
    const { client_name, client_role, client_company, client_image, content, rating, is_featured, is_active, sort_order } = req.body

    const [result] = await pool.query(
      `INSERT INTO testimonials (client_name, client_role, client_company, client_image, content, rating, is_featured, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_name, client_role, client_company, client_image, content, rating ?? 5, is_featured ?? false, is_active ?? true, sort_order ?? 0]
    )

    res.status(201).json({
      success: true,
      data: { id: result.insertId },
      message: 'Testimonial created successfully'
    })
  } catch (error) {
    console.error('Create testimonial error:', error.message)
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
}

export async function updateTestimonial(req, res) {
  try {
    const { id } = req.params
    const updates = req.body

    const [existing] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id])
    if (!existing.length) {
      return res.status(404).json({ error: 'Testimonial not found' })
    }

    const testimonial = existing[0]

    await pool.query(
      `UPDATE testimonials SET 
       client_name = ?, client_role = ?, client_company = ?, client_image = ?, 
       content = ?, rating = ?, is_featured = ?, is_active = ?, sort_order = ?
       WHERE id = ?`,
      [
        updates.client_name ?? testimonial.client_name,
        updates.client_role ?? testimonial.client_role,
        updates.client_company ?? testimonial.client_company,
        updates.client_image ?? testimonial.client_image,
        updates.content ?? testimonial.content,
        updates.rating ?? testimonial.rating,
        updates.is_featured ?? testimonial.is_featured,
        updates.is_active ?? testimonial.is_active,
        updates.sort_order ?? testimonial.sort_order,
        id
      ]
    )

    res.json({ success: true, message: 'Testimonial updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params

    const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id])

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Testimonial not found' })
    }

    res.json({ success: true, message: 'Testimonial deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
}

