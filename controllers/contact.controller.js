import pool from '../config/db.js'
import { sendContactNotification } from '../config/email.js'

export async function createContact(req, res) {
  try {
    const { name, email, phone, company, subject, message, service_interest } = req.body

    const [result] = await pool.query(
      `INSERT INTO contacts (name, email, phone, company, subject, message, service_interest)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company, subject, message, service_interest]
    )

    const contact = { name, email, phone, company, subject, message, service_interest }
    sendContactNotification(contact)

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.'
    })
  } catch (error) {
    console.error('Create contact error:', error.message)
    res.status(500).json({ error: 'Failed to submit contact form' })
  }
}

export async function getContacts(req, res) {
  try {
    const { page = 1, limit = 20, is_read } = req.query
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM contacts WHERE 1=1'
    const params = []

    if (is_read !== undefined) {
      query += ' AND is_read = ?'
      params.push(is_read === 'true')
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const [contacts] = await pool.query(query, params)

    let countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE 1=1'
    const countParams = []

    if (is_read !== undefined) {
      countQuery += ' AND is_read = ?'
      countParams.push(is_read === 'true')
    }

    const [[{ total }]] = await pool.query(countQuery, countParams)

    res.json({
      success: true,
      data: contacts,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
}

export async function getContact(req, res) {
  try {
    const { id } = req.params

    const [contacts] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id])

    if (!contacts.length) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    if (!contacts[0].is_read) {
      await pool.query('UPDATE contacts SET is_read = TRUE WHERE id = ?', [id])
    }

    res.json({ success: true, data: contacts[0] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact' })
  }
}

export async function markAsReplied(req, res) {
  try {
    const { id } = req.params

    await pool.query(
      'UPDATE contacts SET is_replied = TRUE, replied_at = NOW() WHERE id = ?',
      [id]
    )

    res.json({ success: true, message: 'Marked as replied' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' })
  }
}

export async function deleteContact(req, res) {
  try {
    const { id } = req.params

    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id])

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    res.json({ success: true, message: 'Contact deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' })
  }
}

export async function getUnreadCount(req, res) {
  try {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE'
    )
    res.json({ success: true, data: { count } })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get count' })
  }
}

