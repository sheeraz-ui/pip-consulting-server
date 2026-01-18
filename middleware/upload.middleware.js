import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/'
    if (file.fieldname === 'resume') {
      uploadPath = 'uploads/resumes/'
    } else if (file.fieldname === 'image') {
      uploadPath = 'uploads/images/'
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const allowedDocs = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

  if (file.fieldname === 'image' && allowedImages.includes(file.mimetype)) {
    cb(null, true)
  } else if (file.fieldname === 'resume' && allowedDocs.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image')

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('resume')

