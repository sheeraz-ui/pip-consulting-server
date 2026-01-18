import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function resetPassword() {
  const email = 'admin@pipconsultinggroup.com'
  const newPassword = 'Admin@123'

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pip_consulting'
    })

    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, email, name FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      console.log('User not found. Creating new admin user...')
      const hash = await bcrypt.hash(newPassword, 10)
      await connection.execute(
        'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['Admin', email, hash, 'admin', true]
      )
      console.log('✅ Admin user created!')
    } else {
      console.log('User found:', users[0].name)
      const hash = await bcrypt.hash(newPassword, 10)
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hash, email]
      )
      console.log('✅ Password updated!')
    }

    console.log('')
    console.log('Login credentials:')
    console.log('  Email:', email)
    console.log('  Password:', newPassword)

    await connection.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

resetPassword()
