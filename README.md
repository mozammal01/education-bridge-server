# 🛡️ EduBridge Server — Production-Ready API

The robust backend engine powering the EduBridge platform. Built with **Express.js**, **Prisma**, and **Better-Auth**, this server follows professional architectural patterns for security, stability, and maintainability.

## 🔐 Production Engineering

This server is engineered for production-grade stability with the following layers:

### 1. Security Hardening
- **Helmet**: Integrated for 15+ essential security headers.
- **CORS**: Strictly configured for production/local domains.
- **Rate Limiting**: Implementation of `express-rate-limit` to prevent DDoS and brute-force attacks on all API endpoints.

### 2. Advanced Error Management
- **Custom `AppError`**: Standardized class for operational errors.
- **Global Error Handler**: Environment-aware handler providing detailed stack traces in `development` and sanitized messages in `production`.
- **Async Wrapper**: `catchAsync` utility to eliminate repetitive `try/catch` boilerplate and ensure 100% process safety.
- **Graceful Shutdown**: Proactive handling of `unhandledRejection` and `uncaughtException`.

### 3. Professional Patterns
- **`sendResponse`**: Utility ensures 100% consistent JSON output across all modules.
- **ES Modules**: Modern `type: module` architecture with `.js` resolution.

## 💻 Tech Stack

- **Framework**: Express.js (v5.x)
- **ORM**: Prisma (PostgreSQL)
- **Auth**: Better-Auth (Session-based)
- **Validation**: Zod (Professional schema validation)

## ⚒️ Setup & Installation

1. **Environment Variables**:
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   BETTER_AUTH_SECRET=your_secret
   SERVER_URL=http://localhost:5000
   APP_URL=http://localhost:3000
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Migration**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Realistic Seeding**:
   Populate the database with 50+ realistic records for dashboard testing:
   ```bash
   npm run seed
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.

