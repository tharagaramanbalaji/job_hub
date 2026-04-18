# JobHub — React + Node/Express + MongoDB

A full-stack job board app with a premium dark-mode UI.

## Project Structure

```
jobhub-crud/
├── backend/          ← Express REST API + MongoDB
│   ├── models/       ← Mongoose schemas (User, Job)
│   ├── routes/       ← /api/auth and /api/jobs
│   ├── middleware/   ← JWT protect middleware
│   ├── server.js
│   └── .env          ← MONGO_URI, JWT_SECRET, PORT
└── frontend/         ← React (Vite 5) SPA
    └── src/
        ├── api/      ← Axios instance
        ├── context/  ← AuthContext (JWT + localStorage)
        ├── components/ ← Navbar, JobCard, SearchFilters
        └── pages/    ← Home, Login, Register, SavedJobs, PostJob
```

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB running locally OR a [MongoDB Atlas](https://cloud.mongodb.com) URI

### 2. Backend

```bash
cd backend
# Edit .env — set your MONGO_URI (default: mongodb://localhost:27017/jobhub)
npm install
npm run dev    # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`.

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register (returns JWT) |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| GET | `/api/jobs` | — | List all jobs |
| POST | `/api/jobs` | Poster JWT | Create a job |
| POST | `/api/jobs/:id/save` | Seeker JWT | Save/unsave a job |
| GET | `/api/jobs/saved` | Seeker JWT | Get saved jobs |
| DELETE | `/api/jobs/:id` | Poster JWT | Delete own job |

## Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobhub
JWT_SECRET=your_secret_key_here
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string, e.g.:
> `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/jobhub`