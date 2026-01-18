import bcrypt from 'bcrypt'
import pool from '../config/db.js'
import { generateToken } from '../middleware/auth.middleware.js'

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    )

    if (!users.length) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = users[0]
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ error: 'Login failed' })
  }
}

export async function getProfile(req, res) {
  res.json({
    success: true,
    data: req.user
  })
}

export async function updateProfile(req, res) {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    const userId = req.user.id

    const updates = []
    const values = []

    if (name) {
      updates.push('name = ?')
      values.push(name)
    }

    if (email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      )
      if (existing.length) {
        return res.status(400).json({ error: 'Email already in use' })
      }
      updates.push('email = ?')
      values.push(email)
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required' })
      }

      const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId])
      const isValid = await bcrypt.compare(currentPassword, users[0].password)

      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updates.push('password = ?')
      values.push(hashedPassword)
    }

    if (updates.length) {
      values.push(userId)
      await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      )
    }

    const [updated] = await pool.query(
      'SELECT id, name, email, role, avatar FROM users WHERE id = ?',
      [userId]
    )

    res.json({
      success: true,
      data: updated[0],
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile update error:', error.message)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function createAdmin(req, res) {
  try {
    const { name, email, password, role = 'admin' } = req.body

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    )

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, email, role },
      message: 'Admin user created successfully'
    })
  } catch (error) {
    console.error('Create admin error:', error.message)
    res.status(500).json({ error: 'Failed to create admin' })
  }
}

