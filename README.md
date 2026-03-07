# QuickHire — Full-Stack Job Board Platform

A modern job board application built with **Laravel 10** (REST API) and **React + Vite** (frontend). Supports job browsing, applications with CV upload, user authentication with role-based access, and a full admin panel.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Laravel 11, PHP 8.2, Laravel Sanctum    |
| Frontend | React 18, Vite, Tailwind CSS            |
| Database | MySQL                                   |
| Auth     | Sanctum (token-based) + Role system     |

---

## Features

### Job Seeker
- Browse all job listings with search, category, and job type filters
- View full job details with requirements, benefits, salary range
- Apply with name, email, cover note, CV upload (PDF/DOC) or resume link
- Register & login to track application status
- Personal dashboard showing all applications with status (Pending / Reviewed / Shortlisted / Rejected)

### Admin
- Secure admin login (separate credentials, role-based redirect)
- Dashboard with live stats: Total Jobs, Active Jobs, Applications, Pending Review
- Create, edit, delete, and toggle active/inactive jobs
- Click any job to view all applicants
- Update applicant status — reflects immediately on candidate's dashboard
- User management: view all registered users, promote/demote roles (User ↔ Admin), delete users

---

## Project Structure

```
quickhire/
├── quickhire-backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── JobController.php
│   │   │   │   ├── ApplicationController.php
│   │   │   │   ├── RoleController.php
│   │   │   │   └── StatsController.php
│   │   │   ├── Middleware/
│   │   │   │   └── AdminTokenMiddleware.php
│   │   │   └── Requests/
│   │   │       ├── StoreJobRequest.php
│   │   │       ├── UpdateJobRequest.php
│   │   │       ├── StoreApplicationRequest.php
│   │   │       ├── RegisterRequest.php
│   │   │       └── LoginRequest.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Job.php
│   │   │   └── Application.php
│   │   └── Traits/
│   │       └── ApiResponse.php
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── create_users_table.php
│   │   │   ├── create_jobs_table.php
│   │   │   ├── create_applications_table.php
│   │   │   ├── create_personal_access_tokens_table.php
│   │   │   ├── add_user_id_cv_path_to_applications_table.php
│   │   │   └── add_role_to_users_table.php
│   │   ├── factories/
│   │   │   ├── JobFactory.php
│   │   │   └── ApplicationFactory.php
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── AdminUserSeeder.php
│   └── routes/
│       └── api.php
│
└── frontend/                           # React + Vite
    └── src/
        ├── admin/
        │   ├── AdminJobApplications.jsx
        │   ├── AdminPanel.jsx
        │   └── Adminroute.jsx
        ├── assets/
        ├── components/
        │   ├── Applyjob.jsx
        │   ├── Category.jsx
        │   ├── Companies.jsx
        │   ├── FeaturedJobs.jsx
        │   ├── Jobdetails.jsx
        │   ├── Joblist.jsx
        │   ├── LatestJobs.jsx
        │   ├── Posting.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── dashboard/
        │   └── Dashboard.jsx
        ├── pages/
        │   ├── Auth/
        │   │   ├── Login.jsx
        │   │   └── SignUp.jsx
        │   ├── Home/
        │   │   └── Home.jsx
        │   ├── Layout/
        │   │   └── Root.jsx
        │   └── Sheard/
        │       ├── Footer.jsx
        │       └── Navbar.jsx
        ├── Router/
        │   └── Router.jsx
        ├── services/
        │   ├── adminService.js
        │   ├── api.js
        │   └── Jobservice.js
        ├── App.css
        └── App.jsx
```

---

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

---

### Backend Setup

```bash
cd quickhire-backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Configure your `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quickhire
DB_USERNAME=root
DB_PASSWORD=

ADMIN_SECRET_TOKEN=quickhire-admin-secret-2024
```

```bash
# Run migrations
php artisan migrate

# Seed database (creates admin user + demo jobs)
php artisan db:seed

# Create storage symlink for CV uploads
php artisan storage:link

# Start the server
php artisan serve
```

API will be available at: `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

Configure `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_ADMIN_TOKEN=quickhire-admin-secret-2024
```

```bash
# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Default Credentials

### Admin Account
| Field    | Value                 |
|----------|-----------------------|
| Email    | admin@gmail.com   |
| Password | admin123456           |
| URL      | /admin                |

> Admin credentials are seeded via `AdminUserSeeder`. Change the password after first login.

### Regular User
Register at `/signup` — role defaults to `user`, redirected to `/dashboard` on login.

---

## API Reference

Base URL: `http://localhost:8000/api`

### Public Endpoints

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/health`             | API health check          |
| GET    | `/jobs`               | List jobs (with filters)  |
| GET    | `/jobs/{id}`          | Single job details        |
| GET    | `/jobs/categories`    | All categories with count |
| GET    | `/jobs/locations`     | All locations             |
| POST   | `/applications`       | Submit an application     |

### Auth Endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/auth/register`   | Register new user  |
| POST   | `/auth/login`      | Login, get token   |
| POST   | `/auth/logout`     | Revoke token       |
| GET    | `/auth/me`         | Current user info  |

### Protected User Endpoints
> Requires `Authorization: Bearer {token}`

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/user/applications`  | Current user's applications  |

### Admin Endpoints
> Requires `X-Admin-Token: {token}` header

| Method | Endpoint                            | Description                   |
|--------|-------------------------------------|-------------------------------|
| GET    | `/admin/stats`                      | Dashboard statistics          |
| GET    | `/admin/jobs`                       | All jobs (paginated)          |
| POST   | `/admin/jobs`                       | Create job                    |
| PUT    | `/admin/jobs/{id}`                  | Update job                    |
| DELETE | `/admin/jobs/{id}`                  | Delete job                    |
| PATCH  | `/admin/jobs/{id}/toggle`           | Toggle active/inactive        |
| GET    | `/admin/jobs/{id}/applications`     | Applications for a job        |
| GET    | `/admin/applications`               | All applications              |
| PATCH  | `/admin/applications/{id}/status`   | Update application status     |
| DELETE | `/admin/applications/{id}`          | Delete application            |
| GET    | `/admin/users`                      | All users                     |
| PATCH  | `/admin/users/{id}/role`            | Update user role              |
| DELETE | `/admin/users/{id}`                 | Delete user                   |

### Job Query Parameters

```
GET /api/jobs?search=react&category=Engineering&job_type=full-time&page=1&per_page=10
```

| Param      | Description                                        |
|------------|----------------------------------------------------|
| search     | Search in title and company name                   |
| category   | Filter by category (Engineering, Design, etc.)     |
| job_type   | full-time, part-time, remote, contract, internship |
| location   | Filter by location string                          |
| page       | Page number (default: 1)                           |
| per_page   | Results per page (max: 50, default: 10)            |

---

## Application Status Flow

```
pending → reviewed → shortlisted
                  ↘ rejected
```

Status changes made in the Admin Panel are immediately visible on the candidate's Dashboard.

---

## User Roles

| Role  | Access                                          |
|-------|-------------------------------------------------|
| user  | Browse jobs, apply, view own application status |
| admin | Full admin panel, manage jobs, users, statuses  |

Role can be changed from **Admin Panel → Users tab**.

---

## CV Upload

- Accepted formats: PDF, DOC, DOCX
- Max file size: 5MB
- Stored in: `storage/app/public/cvs/`
- Accessible via: `http://localhost:8000/storage/cvs/filename`

Requires `php artisan storage:link` to be run once.

---

## Environment Variables

### Backend `.env`

```env
ADMIN_SECRET_TOKEN=your-secret-token-here
```

### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:8000/api
VITE_ADMIN_TOKEN=your-secret-token-here
```

> Keep `ADMIN_SECRET_TOKEN` and `VITE_ADMIN_TOKEN` in sync.

---

## License

MIT
