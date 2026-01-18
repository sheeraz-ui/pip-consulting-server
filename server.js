import app from './app.js'
import { testConnection } from './config/db.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/images', 'uploads/resumes']
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
})

async function startServer() {
  try {
    const dbConnected = await testConnection()
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Server starting anyway...')
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

