# PIP Consulting - Server

Node.js/Express backend API for PIP Consulting Group.

## Tech Stack

- Node.js 18+
- Express.js
- MySQL
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env
# Edit .env with your database credentials

# Setup database (creates tables and admin user)
npm run setup

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pip_consulting

# JWT (generate secure key for production)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Admin
ADMIN_PASSWORD=Admin@123
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm run setup` | Setup database tables and admin |

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/testimonials` | Get testimonials |
| GET | `/api/testimonials/featured` | Get featured testimonials |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

### Protected (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Get current user |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/contact` | List contacts |
| POST | `/api/testimonials` | Create testimonial |
| PUT | `/api/testimonials/:id` | Update testimonial |
| DELETE | `/api/testimonials/:id` | Delete testimonial |

## Deployment

### Railway (Recommended)

1. Push to GitHub
2. Create new project on [Railway](https://railway.app)
3. Add MySQL database service
4. Set environment variables
5. Deploy!

### Render

1. Push to GitHub
2. Create Web Service on [Render](https://render.com)
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

### DigitalOcean / VPS

```bash
# Clone repo
git clone your-repo-url
cd pip-consulting-server

# Install dependencies
npm install --production

# Setup PM2
npm install -g pm2
pm2 start server.js --name pip-api

# Setup Nginx reverse proxy (optional)
```

## Project Structure

```
├── config/          # Database & email config
├── controllers/     # Route handlers
├── middleware/      # Auth, upload, validation
├── routes/          # API routes
├── scripts/         # Database setup
├── uploads/         # File uploads
├── app.js           # Express app
└── server.js        # Entry point
```

## Default Admin Credentials

After running `npm run setup`:

- **Email**: admin@pipconsultinggroup.com
- **Password**: Admin@123 (or value from ADMIN_PASSWORD env)

⚠️ **Change these in production!**

## License

Private - PIP Consulting Group

