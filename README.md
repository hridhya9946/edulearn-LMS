# EduLearn: Premium Learning Management System (LMS)

EduLearn is a comprehensive, full-stack digital education platform designed for high-end academic and professional learning. It features a robust multi-role architecture (Admin, Instructor, Student) with real-time analytics, automated certificate generation, and a cinema-mode learning experience.

## 🚀 Key Features

### 🏛️ Administrative Module
- **Platform Analytics**: Real-time visualization of user growth and revenue trends.
- **User Management**: Complete CRUD control over platform users and role assignments.
- **Course Approval Workflow**: Quality control gate for new course content.
- **System Settings**: Global platform configuration from a central dashboard.

### 🎓 Instructor Command Center
- **Course Creator**: Intuitive interface for building structured modules and lessons.
- **Quiz & Assignment Engine**: Comprehensive assessment tools with automated/manual grading.
- **Revenue Tracking**: Granular data on course performance and student enrollment.
- **Student Performance Pulse**: Track completion rates and assessment success.

### 📖 Student Learning Experience
- **Cinema-Mode Player**: Distraction-free content delivery with progress tracking.
- **Dynamic Achievements**: Real-time progress bars and automated PDF-style certificates.
- **Premium Profile**: Showcase skills, bio, and achievements to the community.
- **Featured Discovery**: Stunning homepage with curated course carousels and stats.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Bootstrap, Recharts, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication.
- **Quality**: Robust RBAC, Ownership Middlewares, and "Manual Pixel Injection" for chart stability.

## 🏁 Quick Start

### Prerequisites
- Node.js & pnpm (recommended)
- MongoDB instance

### Step 1: Backend Setup
1. Navigate to `/backend`
2. Run `pnpm install`
3. Configure `.env` (PORT, MONGO_URI, JWT_SECRET)
4. Run `pnpm run dev`

### Step 2: Frontend Setup
1. Navigate to `/frontend`
2. Run `pnpm install`
3. Run `pnpm run dev`

## 🛡️ Security
The platform implements a multi-layer security model, including Role-Based Access Control (RBAC) and explicit resource ownership verification to prevent unauthorized data access.
