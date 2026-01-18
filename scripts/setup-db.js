import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  console.log('Setting up database...\n')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  })

  try {
    // Create database
    console.log('1. Creating database...')
    await connection.query('CREATE DATABASE IF NOT EXISTS pip_consulting')
    await connection.query('USE pip_consulting')
    console.log('   Database created!\n')

    // Read and execute schema (without the INSERT statements and CREATE INDEX)
    console.log('2. Creating tables...')
    const schemaPath = path.join(__dirname, '..', 'config', 'schema.sql')
    let schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Remove INSERT statements and CREATE INDEX - we'll handle them separately
    schema = schema.split('\n')
      .filter(line => !line.trim().startsWith('INSERT INTO'))
      .filter(line => !line.trim().startsWith('CREATE INDEX'))
      .filter(line => !line.trim().startsWith("('"))  // Remove orphaned value lines
      .join('\n')
    
    // Execute schema
    try {
      await connection.query(schema)
    } catch (err) {
      if (!err.message.includes('already exists')) {
        throw err
      }
    }
    console.log('   Tables created!\n')

    // Create admin user with properly hashed password
    console.log('3. Creating admin user...')
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    // Check if admin exists
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@pipconsultinggroup.com']
    )

    if (existing.length === 0) {
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@pipconsultinggroup.com', hashedPassword, 'admin']
      )
      console.log('   Admin user created!')
      console.log(`   Email: admin@pipconsultinggroup.com`)
      console.log(`   Password: ${adminPassword}\n`)
    } else {
      // Update password for existing admin
      await connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'admin@pipconsultinggroup.com']
      )
      console.log('   Admin user password updated!')
      console.log(`   Email: admin@pipconsultinggroup.com`)
      console.log(`   Password: ${adminPassword}\n`)
    }

    // Insert sample data
    console.log('4. Inserting sample data...')

    // Testimonials
    const [testimonialsExist] = await connection.query('SELECT COUNT(*) as count FROM testimonials')
    if (testimonialsExist[0].count === 0) {
      await connection.query(`
        INSERT INTO testimonials (client_name, client_role, client_company, content, rating, is_featured, is_active, sort_order) VALUES
        ('Sarah Johnson', 'CEO', 'TechVentures Inc.', 'PIP Consulting transformed our digital strategy completely. Their team brought deep expertise and delivered exceptional results that exceeded our expectations.', 5, TRUE, TRUE, 1),
        ('Michael Chen', 'CFO', 'Global Manufacturing Corp', 'The financial advisory team helped us navigate a complex acquisition seamlessly. Their insights were invaluable in making critical decisions.', 5, TRUE, TRUE, 2),
        ('Emily Rodriguez', 'COO', 'HealthFirst Systems', 'Operations excellence at its finest. They identified inefficiencies we never knew existed and helped us save millions annually.', 5, TRUE, TRUE, 3)
      `)
      console.log('   Testimonials inserted!')
    }

    console.log('\n   Sample data inserted!\n')

    console.log('✅ Database setup complete!\n')
    console.log('You can now start the server with: npm run dev')

  } catch (error) {
    console.error('Error setting up database:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

setupDatabase().catch(console.error)
