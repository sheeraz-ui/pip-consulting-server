import pool from '../config/db.js'

export async function getDashboardStats(req, res) {
  try {
    const [[{ totalContacts }]] = await pool.query('SELECT COUNT(*) as totalContacts FROM contacts')
    const [[{ unreadContacts }]] = await pool.query('SELECT COUNT(*) as unreadContacts FROM contacts WHERE is_read = FALSE')
    const [[{ totalTestimonials }]] = await pool.query('SELECT COUNT(*) as totalTestimonials FROM testimonials')
    const [[{ activeTestimonials }]] = await pool.query('SELECT COUNT(*) as activeTestimonials FROM testimonials WHERE is_active = TRUE')

    res.json({
      success: true,
      data: {
        contacts: { total: totalContacts, unread: unreadContacts },
        testimonials: { total: totalTestimonials, active: activeTestimonials }
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error.message)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}

export async function getRecentActivity(req, res) {
  try {
    const [recentContacts] = await pool.query(
      'SELECT id, name, email, subject, created_at, is_read FROM contacts ORDER BY created_at DESC LIMIT 5'
    )

    const [recentTestimonials] = await pool.query(
      'SELECT id, client_name, client_company, is_active, created_at FROM testimonials ORDER BY created_at DESC LIMIT 5'
    )

    res.json({
      success: true,
      data: {
        contacts: recentContacts,
        testimonials: recentTestimonials
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activity' })
  }
}
