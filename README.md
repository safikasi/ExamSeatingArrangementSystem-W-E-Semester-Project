# 🎓 Exam Seating Management System

A comprehensive web-based solution for managing exam seating arrangements with automated allocation, validation, and PDF export capabilities.

![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

- **Automated Seat Allocation** - Smart algorithm with adjacency prevention
- **Real-time Validation** - Ensures no capacity overflow or same-semester adjacent seats
- **PDF Export** - Generate professional seating charts per room
- **CSV Import** - Bulk upload students and courses
- **Manual Adjustments** - Drag-and-drop seat swapping with re-validation
- **MySQL Backed** - Robust database with proper constraints and indexes

## 🗓️ Project Timeline

| Week | Focus Area | Status |
|------|------------|--------|
| 1 | Requirements & Database Schema | ✅ Completed |
| 2 | UI Design & Frontend Scaffolding | ✅ Completed |
| 3 | Allocation Engine & PDF Export | 🔄 In Progress |
| 4 | QA, Deployment & Documentation | ⏳ Upcoming |

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MySQL 8.0 with InnoDB
- Prisma ORM
- Joi/Zod for validation

**Frontend:**
- React 18
- Protected Routes
- Consistent Theme System
- jsPDF for exports

## 🚀 Quick Start

### Prerequisites
- MySQL 8.0+
- Node.js 18+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/safikasi/ExamSeatingArrangementSystem-W-E-Semester-Project.git
cd exam-seating-system
Setup Database with Docker

docker-compose up -d mysql
Run Migrations & Seed Data

npm run db:migrate
npm run db:seed
Install Dependencies

npm install
Start Development Servers

#Backend (Port 3001)
npm run dev:server

#Frontend (Port 3000)  
npm run dev:client

#📁 Project Structure

exam-seating-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers & validators
│   ├── prisma/            # Database schema & migrations
│   └── seeds/             # Demo data
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Theme & global styles
└── docs/                  # Documentation

#🗃️ Database Schema

Key Tables:

departments - Academic departments

semesters - Semester details with exam dates

students - Student records with roll numbers

rooms - Examination venues with capacity

seating_plans - Generated seating arrangements

allocated_seats - Individual seat assignments

DB_HOST=localhost

DB_PORT=3306

DB_NAME=exam_seating

DB_USER=app_user

DB_PASS=secure_password

JWT_SECRET=your_jwt_secret

NODE_ENV=development

#📊 Performance Metrics

Plan generation for 500+ students under 30 seconds

Zero adjacency violations guaranteed

Batch processing for CSV imports (1000+ records)

Optimized MySQL indexes for fast queries

#📄 License
This project is licensed under the MIT License - see the LICENSE file for details.