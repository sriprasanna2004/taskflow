# TaskFlow — Production-Ready Task Management Application

A full-stack task management app built with Next.js, Express, MongoDB, and JWT authentication.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 16 (App Router), Tailwind CSS   |
| Backend    | Node.js, Express                        |
| Database   | MongoDB Atlas + Mongoose                |
| Auth       | JWT in HTTP-only cookies, bcrypt        |
| Security   | Helmet, rate limiting, AES encryption, Joi validation |
| Deployment | Vercel (frontend), Render (backend)     |

---

## Architecture

```
Client (Next.js)
    │
    │  HTTP + cookies (withCredentials)
    ▼
Express API (Node.js)
    │  JWT middleware → protect routes
    │  Joi validation → sanitise input
    │  AES encryption → sensitive fields
    ▼
MongoDB Atlas
```

Clean layered architecture:
- **Routes** → thin, just wires HTTP verbs to controllers
- **Controllers** → handle req/res, delegate to services
- **Services** → all business logic, DB queries
- **Middleware** → auth, validation, error handling

---

## Folder Structure

```
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Request handlers
│   ├── middleware/     # auth, validate, errorHandler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Business logic
│   ├── utils/          # jwt, encryption, validators, response
│   └── server.js
│
└── frontend/
    ├── app/            # Next.js App Router pages
    │   ├── login/
    │   ├── register/
    │   ├── dashboard/
    │   ├── create-task/
    │   └── edit-task/[id]/
    ├── components/     # Reusable UI components
    ├── hooks/          # useAuth, useTasks
    ├── services/       # API calls (axios)
    ├── types/          # TypeScript interfaces
    ├── utils/          # cn helper
    └── middleware.ts   # Next.js route protection
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
AES_SECRET_KEY=your_32_char_aes_key
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Documentation

### Auth

| Method | Endpoint              | Auth | Description        |
|--------|-----------------------|------|--------------------|
| POST   | /api/auth/register    | No   | Register user      |
| POST   | /api/auth/login       | No   | Login user         |
| POST   | /api/auth/logout      | No   | Clear auth cookie  |
| GET    | /api/auth/me          | Yes  | Get current user   |

### Tasks

| Method | Endpoint              | Auth | Description        |
|--------|-----------------------|------|--------------------|
| POST   | /api/tasks            | Yes  | Create task        |
| GET    | /api/tasks            | Yes  | List tasks (paginated, filtered) |
| GET    | /api/tasks/:id        | Yes  | Get single task    |
| PUT    | /api/tasks/:id        | Yes  | Update task        |
| DELETE | /api/tasks/:id        | Yes  | Delete task        |

#### Query Parameters for GET /api/tasks

| Param  | Type   | Example     | Description          |
|--------|--------|-------------|----------------------|
| page   | number | 1           | Page number          |
| limit  | number | 10          | Items per page       |
| status | string | pending     | Filter by status     |
| search | string | meeting     | Search by title      |

---

## Sample API Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"title":"Write tests","description":"Unit and integration","status":"pending"}'
```

### Get Tasks (filtered)
```bash
curl "http://localhost:5000/api/tasks?page=1&limit=10&status=pending&search=write" \
  -b cookies.txt
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/<task_id> \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/<task_id> -b cookies.txt
```

---

## Sample Responses

### Success
```json
{
  "success": true,
  "message": "Task created.",
  "data": {
    "task": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Write tests",
      "description": "Unit and integration",
      "status": "pending",
      "userId": "65f1a2b3c4d5e6f7a8b9c0d0",
      "createdAt": "2026-03-14T10:00:00.000Z"
    }
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Task not found."
}
```

---

## Running Locally

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on port 5000
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev            # starts on port 3000
```

---

## Deployment

### 1. MongoDB Atlas
- Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- Whitelist `0.0.0.0/0` for Render/Railway IPs
- Copy the connection string

### 2. Backend → Render
- Push `backend/` to a GitHub repo
- New Web Service on [render.com](https://render.com)
- Build: `npm install` | Start: `node server.js`
- Add all env vars from `.env.example`

### 3. Frontend → Vercel
- Push `frontend/` to a GitHub repo
- Import on [vercel.com](https://vercel.com)
- Add env var: `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`
- Deploy

---

## Security Highlights

- Passwords hashed with bcrypt (cost factor 12)
- JWT stored in HTTP-only, Secure, SameSite cookies
- AES-256 encryption available for sensitive payload fields
- Helmet sets secure HTTP headers
- Rate limiting: 100 req/15min globally, 20 req/15min on auth routes
- Joi validates and sanitises all inputs
- Users can only access their own tasks (userId scoping)
- Payload size limited to 10kb
