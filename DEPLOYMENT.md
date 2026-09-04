# SkillSwap Deployment Guide (GitHub & Vercel)

This step-by-step guide explains how to push your SkillSwap project to GitHub and deploy both the **Frontend** and **Backend** to Vercel.

---

## Part 1: Push to GitHub

### 1. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set **Repository name**: `skillswap` (or `SkillSwap`).
3. Set visibility to **Public** or **Private** (according to your preference).
4. **Do not** initialize with a README, .gitignore, or license (these already exist locally).
5. Click **Create repository**.

### 2. Connect and Push Local Code
Open your terminal in `D:\Dipti assignment\FINAL PRESENTATION` and run:

```bash
# Add your GitHub repository as remote origin (replace with your repo URL)
git remote add origin https://github.com/ArafatRkk/skillswap.git

# Push code to GitHub
git push -u origin main
```

*(If prompted, log in with your GitHub account credentials via the browser or Git Credential Manager).*

---

## Part 2: Deploy to Vercel

Because SkillSwap is a full-stack application with a Next.js frontend and Express backend, the cleanest and most reliable Vercel setup is deploying them as two linked projects from the same GitHub repository.

---

### Step A: Deploy Backend to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your `skillswap` GitHub repository and click **Import**.
4. Configure Project:
   - **Project Name**: `skillswap-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and choose `backend`.
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://rkkarafat_db_user:N8eLQVTYDPZtqRIi@skillswap.hpljgbf.mongodb.net/skillswap?appName=skillswap`
   - `JWT_SECRET`: `supersecret_key_for_arafat_skillswap_exam_project`
   - `NODE_ENV`: `production`
6. Click **Deploy**.
7. Once deployment finishes, copy your backend URL (e.g., `https://skillswap-backend.vercel.app`).
8. You can verify it by opening `https://skillswap-backend.vercel.app/api/health` in your browser. It should return:
   ```json
   { "status": "ok", "message": "SkillSwap Backend API is running successfully" }
   ```

---

### Step B: Deploy Frontend to Vercel

1. Return to your Vercel dashboard and click **Add New...** -> **Project**.
2. Select your `skillswap` GitHub repository again and click **Import**.
3. Configure Project:
   - **Project Name**: `skillswap-frontend`
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and choose `frontend`.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://skillswap-backend.vercel.app/api` *(replace with your actual backend URL from Step A)*
5. Click **Deploy**.
6. When the build finishes, your Next.js application is live! Click the domain link (e.g., `https://skillswap-frontend.vercel.app`).

---

## Part 3: Verify & Exam Presentation Flow

1. Open your live frontend URL.
2. Log in using one of the seeded demo accounts:
   - **Email:** `arafat@skillswap.demo`
   - **Password:** `Arafat123`
3. Check the **Dashboard**, **Explore**, and **Matches** pages to verify real-time data from MongoDB Atlas.
