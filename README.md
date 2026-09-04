# SkillSwap - Peer-to-Peer Skill Exchange Platform

SkillSwap is a full-stack, peer-to-peer skill exchange platform designed as a university exam project. It enables users to teach the skills they already know in exchange for learning the skills they want, creating a cashless knowledge-sharing network.

### 🌐 Live Deployment Links
- **Live Web App (Frontend):** [https://skillswap-frontend-seven-pi.vercel.app](https://skillswap-frontend-seven-pi.vercel.app)
- **Live API Server (Backend):** [https://skillswap-backend-tau.vercel.app](https://skillswap-backend-tau.vercel.app)
- **GitHub Repository:** [https://github.com/ArafatRkk/skillswap](https://github.com/ArafatRkk/skillswap)

## 🚀 Project Overview

The core objective of SkillSwap is to match individuals based on mutual learning interests and teaching capabilities. If User A teaches React and wants to learn Photoshop, and User B teaches Photoshop and wants to learn React, SkillSwap recognizes this mutual overlap and suggests a **Strong Match**, allowing them to connect.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router, JavaScript)
- **Library:** React (Hooks)
- **Styling:** Tailwind CSS (Vanilla CSS base config, Inter font family)
- **Icons:** Lucide React
- **API Fetching:** Fetch API / Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API endpoints)
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with standard cookies/headers
- **Password Security:** bcryptjs hashing
- **Development Tools:** Nodemon, dotenv, cors

---

## 📂 Project Structure

```text
skillswap/
│
├── frontend/                     # Next.js React UI
│   ├── app/                      # App Router pages and layouts
│   ├── components/               # Reusable UI elements (Navbar, Cards, Badges)
│   ├── lib/                      # API integration and helpers
│   ├── public/                   # Static files (icons, images)
│   └── ...
│
├── backend/                      # Express.js REST API Server
│   ├── config/                   # Database setup
│   ├── controllers/              # Business logic controllers
│   ├── models/                   # Mongoose collection models
│   ├── middleware/               # Auth verification handlers
│   ├── routes/                   # Routing configuration
│   ├── scripts/                  # DB seed scripts
│   ├── server.js                 # Server entry file
│   └── ...
│
├── README.md                     # Main documentation
└── .gitignore                    # Global git ignore configurations
```

---

## 🔄 How It Works (Matching Algorithm)

The platform calculates a **Match Score** based on overlap between users:
- **Strong Match (Score: 2):** Your teaching skill matches their learning skill, **AND** their teaching skill matches your learning skill.
- **Partial Match (Score: 1):** Only one direction matches (either they can teach what you want, or you can teach what they want, but not both).
- **No Match (Score: 0):** There is no overlap in teaching/learning interests.

The matching score logic is isolated in a shared utility `calculateMatchScore()` for easy presentation and code walkthrough.

---

## 📊 Database Models

1. **User (`users`):** `name`, `email`, `password`, `avatar`, `bio`, `location`, `teachingSkills` (array of strings), `learningSkills` (array of strings).
2. **Skill (`skills`):** `name` (string), `category` (string), `createdAt`.
3. **ConnectionRequest (`connectionRequests`):** `sender` (User Ref), `receiver` (User Ref), `status` (pending/accepted/rejected), `createdAt`, `updatedAt`.

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create user profile
- `POST /api/auth/login` - Authenticate user and return JWT
- `GET /api/auth/me` - Retrieve current logged-in user context

### Users
- `GET /api/users` - Fetch explore list with search & filter
- `GET /api/users/:id` - Fetch detailed user profile
- `PUT /api/users/:id` - Edit profile info and teaching/learning skills

### Connection Requests
- `POST /api/requests` - Send new connection request
- `GET /api/requests` - Fetch all incoming/outgoing requests
- `PATCH /api/requests/:id` - Accept/reject a request
- `DELETE /api/requests/:id` - Cancel a request

### Matches
- `GET /api/matches` - Retrieve best matching users for logged-in profile

---

## 🔑 Demo Credentials

To present the application live during the final exam, use the following seeded user profiles:

### 👤 Demo Account 1 (First User)
- **Email:** `arafat@skillswap.demo`
- **Password:** `Arafat123`
- **Name:** Mohammad Arafat Amin
- **Teaching Skills:** React, JavaScript, HTML/CSS
- **Learning Skills:** UI/UX Design, Photoshop, Node.js

### 👤 Demo Account 2 (Matching User)
- **Email:** `maya@skillswap.demo`
- **Password:** `Maya123`
- **Name:** Maya Islam
- **Teaching Skills:** UI/UX Design, Photoshop
- **Learning Skills:** React, JavaScript

*(Additional seed accounts are documented in the DB seeding scripts).*

---

## ⚙️ Installation & Running

### Backend Setup
1. Open a terminal and navigate to `/backend`.
2. Install packages: `npm install`
3. Set up the `.env` file using `.env.example` as a template.
4. Seed the database: `npm run seed`
5. Run the dev server: `npm run dev`

### Frontend Setup
1. Open a new terminal and navigate to `/frontend`.
2. Install packages: `npm install`
3. Set up the `.env.local` file using `.env.example` as a template.
4. Run the Next.js dev server: `npm run dev`

---

## 🎓 Exam Demo Walkthrough Flow
1. **Landing Page:** Explain the peer-to-peer visual concept.
2. **Authentication:** Login using `arafat@skillswap.demo`.
3. **Dashboard:** Walk through stats, your skills list, and pending matches.
4. **Explore:** Search for `React` and view `Maya Islam`'s profile showing **Strong Match**.
5. **Request Flow:** Send connection request from Arafat to Maya.
6. **Acceptance:** Sign out, login as `maya@skillswap.demo`, navigate to incoming requests, and accept Arafat's request.
7. **Verify:** Check dashboard connections showing the new active link.

---

### Created by Arafat Amin
*Final Exam Project - Computer Science & Engineering*
