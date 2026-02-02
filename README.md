# EduBridge Server

Backend API for EduBridge tutoring platform.

## Tech

- Express.js
- Prisma ORM
- PostgreSQL
- better-auth (authentication)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
BETTER_AUTH_SECRET=random_secret_key
SERVER_URL=http://localhost:5000
APP_URL=http://localhost:3000

# Optional - for social login
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Seed database (optional):
```bash
npm run seed
```

5. Start server:
```bash
npm run dev
```

## API Endpoints

**Auth**
- POST `/api/auth/sign-up/email` - Register
- POST `/api/auth/sign-in/email` - Login
- GET `/api/auth/me` - Get current user

**Tutors**
- GET `/api/tutors` - List all tutors
- GET `/api/tutors/:id` - Get tutor details
- PUT `/api/tutor/profile` - Update tutor profile
- PUT `/api/tutor/availability` - Set availability

**Bookings**
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user's bookings
- PATCH `/api/bookings/:id/status` - Update booking status

**Categories**
- GET `/api/categories` - List categories

**Reviews**
- POST `/api/reviews` - Create review
- GET `/api/reviews/tutor/:tutorId` - Get tutor reviews

**Admin**
- GET `/api/users` - List all users
- PATCH `/api/users/:id` - Update user

## Deployment

Deployed on Vercel. Push to main branch triggers auto-deploy.
