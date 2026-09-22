# 📝 BlogWeb — Modern Full-Stack Edge Blogging Platform

A high-performance, minimalist blogging platform inspired by Medium, built with **Cloudflare Workers (Edge Runtime)**, **Hono**, **Prisma Accelerate with PostgreSQL**, **Zod shared schemas**, and **React 18 (Vite + Tailwind CSS)**.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 18 + Vite + Tailwind)                      │
│                                                                                 │
│   Landing (/) ──► Blogs Feed (/blogs) ──► Blog Detail (/blog/:id)               │
│        ▲                     ▲                       ▲                          │
│        │                     │                       │                          │
│   Auth (/signin, /signup)    Editor (/publish, /edit/:id)    Profile (/profile) │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ HTTP / REST (JWT Bearer Auth)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  EDGE API LAYER (Hono on Cloudflare Workers)                    │
│                                                                                 │
│   • Global CORS Filter (Wildcard + Preflights)                                  │
│   • /api/v1/user Router (Signup, Signin, Me, Profile)                          │
│   • /api/v1/blog Router (Bulk Feed, Detail, Create, Update, Delete)             │
│   • JWT Auth Guard Middleware (userId context injection)                        │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ Prisma Edge Client + Accelerate Pool
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (PostgreSQL)                                │
│                                                                                 │
│   • User Table (id, email, username, name, password)                            │
│   • Blog Table (id, title, content, published, authorId -> User.id)             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router v7, Axios |
| **Edge API Backend** | Hono, Cloudflare Workers (V8 Isolates), `@prisma/client/edge` |
| **Database & Pooling**| PostgreSQL, Prisma ORM, Prisma Accelerate (Connection Pool & Cache) |
| **Shared Validation** | Zod (Runtime validation + compile-time TypeScript type inference) |
| **Authentication** | Stateless JSON Web Tokens (`hono/jwt`), Bearer token header |

---

## 📁 Repository Structure

```
BlogWeb/
├── backend/                  # Edge API running on Cloudflare Workers
│   ├── prisma/
│   │   └── schema.prisma     # Prisma schema & PostgreSQL data models
│   ├── src/
│   │   ├── index.ts          # Root entrypoint, CORS, route registry
│   │   └── routes/
│   │       ├── user.ts       # Auth & profile routes (/signup, /signin, /me, /profile)
│   │       └── blog.ts       # Blog CRUD routes (/bulk, /:id, create, update, delete)
│   ├── wrangler.toml         # Cloudflare Workers configuration & bindings
│   └── package.json
│
├── common/                   # Shared validation module & TypeScript contracts
│   ├── src/
│   │   └── zod.ts            # Zod validation schemas & inferred types
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/                 # Client SPA built with React & Vite
    ├── src/
    │   ├── components/       # Appbar, BlogCard, FullBlog, Auth, BlogSkeleton, Footer
    │   ├── hooks/            # useBlogs, useBlog, useCurrentUser custom hooks
    │   ├── pages/            # Landing, Blogs, Blog, Publish, Profile, Signin, Signup
    │   ├── config.ts         # Backend URL configuration
    │   └── App.tsx           # React Router setup & route definitions
    ├── index.html
    └── package.json
```

---

## ✨ Features

### 🔐 1. Authentication & User Management
- **User Registration (`/signup`)**: Register with Full Name, Username, Email, and Password.
- **User Login (`/signin`)**: Secure login with JWT issuance and client-side session persistence.
- **Current User Context (`/api/v1/user/me`)**: Fetch authenticated user data.
- **Profile Settings (`/profile`)**: Manage and update display name and username.
- **Interactive Appbar**: Dynamic user initials in slate avatar with dropdown menu for Profile, New Blog, and Sign Out.

### 📖 2. Blog Feed & Reading Experience
- **Live Search & Filter**: Filter stories instantaneously by title, excerpt content, or author name.
- **Estimated Reading Time**: Automatically calculated based on word count.
- **Full Article View (`/blog/:id`)**: Clean typography with author bio sidebar and back navigation.
- **Skeleton Loading States**: Smooth animated skeletons (`BlogSkeleton`) while fetching data.

### ✍️ 3. Story Creation & Editing
- **Dual-Mode Editor (`/publish` & `/edit/:id`)**: Publish new posts or edit existing posts with prefilled data.
- **Author Ownership Protection**: Strict backend author verification prevents unauthorized modifications or deletions.
- **Delete Post**: Easily delete blogs directly from the full article view with confirmation.

### 🎨 4. Minimalist Gray & White Design
- Clean, distraction-free aesthetic with slate, gray, white, and subtle dark accents.
- Fully responsive across mobile, tablet, and desktop viewports.

---

## 📡 API Reference

### Base URL: `http://127.0.0.1:8787` (Local) / Edge Worker URL (Production)

### User Endpoints (`/api/v1/user`)

| Method | Endpoint | Auth | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/v1/user/signup` | No | Create a new user account | `{ "email": "...", "password": "...", "username": "...", "name": "..." }` |
| `POST` | `/api/v1/user/signin` | No | Sign in and receive JWT token | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/v1/user/me` | Bearer JWT | Fetch logged-in user profile | None |
| `PUT` | `/api/v1/user/profile` | Bearer JWT | Update display name / username | `{ "name": "...", "username": "..." }` |

### Blog Endpoints (`/api/v1/blog`)

| Method | Endpoint | Auth | Description | Request Body |
|---|---|---|---|---|
| `GET` | `/api/v1/blog/bulk` | Optional | Fetch all published blog posts | None |
| `GET` | `/api/v1/blog/:id` | Optional | Fetch a single blog by ID | None |
| `POST` | `/api/v1/blog` | Bearer JWT | Create and publish a new blog post | `{ "title": "...", "content": "..." }` |
| `PUT` | `/api/v1/blog` | Bearer JWT | Update blog post (author only) | `{ "id": "...", "title": "...", "content": "..." }` |
| `DELETE` | `/api/v1/blog/:id` | Bearer JWT | Delete blog post (author only) | None |

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Cloudflare Wrangler CLI** (`npm i -g wrangler`)
- **PostgreSQL Database** (Neon, Supabase, Aiven, or local Docker container)

---

### 2. Configure Environment Variables

#### Backend (`backend/wrangler.toml`)
Ensure your `wrangler.toml` file has your database connection string and JWT secret:
```toml
name = "backend"
compatibility_date = "2024-09-21"
compatibility_flags = [ "nodejs_compat" ]

[vars]
DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=YOUR_ACCELERATE_KEY"
JWT_SECRET = "your-secure-jwt-secret"
```

#### Frontend (`frontend/src/config.ts`)
Set the API backend URL:
```typescript
export const BACKEND_URL = "http://127.0.0.1:8787";
```

---

### 3. Database Migration & Prisma Generation
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init_schema
```

---

### 4. Running Locally

#### Start the Backend API (Edge Worker)
```bash
cd backend
npm run dev
```
*Backend runs at `http://127.0.0.1:8787`.*

#### Start the Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🚢 Deployment Guide

### Deploy Backend to Cloudflare Workers
```bash
cd backend
npx wrangler deploy --minify src/index.ts
```

### Deploy Frontend to Vercel / Cloudflare Pages
1. Build the production bundle:
```bash
cd frontend
npm run build
```
2. Update `frontend/src/config.ts` with your deployed Cloudflare Worker API URL.
3. Deploy the `frontend/dist` folder to **Cloudflare Pages**, **Vercel**, or **Netlify**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
