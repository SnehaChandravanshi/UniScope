# 🎓 UniScope — College Discovery & Decision-Making Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://uni-scope-three.vercel.app/)
[![Next.js Version](https://img.shields.io/badge/Framework-Next.js%2015-blue?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-123a50?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Supabase-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

**UniScope** is a modern, premium web application designed to help students search, compare, and discover top colleges in India. Featuring interactive 3D elements, dynamic prediction algorithms, community discussion forums, and an intelligent admissions chatbot, UniScope simplifies the college application journey.

---

## 🌟 Key Features

### 🔍 1. Interactive College Explorer & Filters
- Browse 28+ leading Indian institutions (IITs, NITs, IIMs, AIIMS, NLSIU, PGIMER, and more) across engineering, management, medical, and law fields.
- Filter colleges dynamically based on **Ownership Type** (Government/Private), **Annual Fees**, **Average Placement Package**, and **NIRF Ranking**.
- Includes smooth responsive cards with interactive hover animations.

### 📊 2. College Comparison Tool
- Add multiple colleges to a side-by-side comparison matrix.
- Compare critical metrics instantly: tuition fees, average packages, highest packages, top recruiters, NIRF ranks, locations, and student reviews.

### 📈 3. Rank & Cutoff Predictor
- Predict admission chances for premier engineering, medical, and law colleges.
- Enter national test scores (JEE Main, JEE Advanced, NEET, CLAT) along with category (General, OBC, SC, ST) and gender settings to see high-precision match probabilities.

### 💬 4. Community Discussion Forum
- Engage with other students and college alumni.
- Create discussions, post questions, vote on answers, and read verified reviews about campus life, placements, and hostel facilities.

### 🤖 5. Intelligent Admissions Chatbot (UniBot)
- A bottom-right floating assistant loaded with custom NLP query parsing.
- Ask questions about:
  - **Placements:** *"average package at IIT Bombay?"*
  - **Fees:** *"Which college has the lowest fees?"*
  - **Location:** *"Show colleges in Delhi"*
  - **Courses & Eligibility:** *"B.Tech courses at BITS"*
- **Detail Routing:** Includes direct click-to-navigate links (`[View Details]`) within the chat bubbles that take you straight to college details pages.
- **Delete Chats Button:** A prominent header button to instantly reset chat history.
- **Fully Responsive:** Beautiful fluid sizing that auto-fits Windows desktop screens and mobile displays.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, Next.js 15 (App Router with Turbopack compilation) |
| **Styling** | Tailwind CSS (featuring Glassmorphic cards, Dark & Aurora themes) |
| **Database & ORM** | Prisma ORM, Supabase PostgreSQL database |
| **State Management** | Zustand Store (for global comparison lists and theme modes) |
| **Authentication** | NextAuth.js (secure Google & credentials provider session sign-ins) |
| **Animations** | Framer Motion & CSS Micro-animations |
| **Icons** | Lucide React |

### ⚡ Connection Resilience & Cooldown Fallback
The application incorporates database resilience middleware (`collegeService.ts`). If the Supabase database experiences connectivity delays or is unreachable, the system activates a **1-minute connection cooldown**. During this cooldown, all queries bypass database timeouts and immediately fallback to a local mock dataset in `0ms`, ensuring a lag-free user experience.

---

## ⚙️ Local Development Setup

Follow these steps to run UniScope locally on your machine:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or later) and `npm` installed.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/SnehaChandravanshi/UniScope.git
cd UniScope
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project and add the following keys:
```env
# Supabase PostgreSQL database connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_DB_HOST:5432/postgres?connect_timeout=2"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generate-next-auth-secret-key"
```
*(You can generate a secure secret key using `openssl rand -base64 32`)*

### 4. Setup the Database Schema
Sync your PostgreSQL database using Prisma migrations and seed it with college datasets:
```bash
# Apply schema migrations
npx prisma migrate dev

# Seed database with raw college information
npx prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Directory Structure

```text
├── app/                  # Next.js App Router (pages and API endpoints)
│   ├── api/              # API routes (Auth, saved colleges, discussions)
│   ├── college/[slug]/   # Dynamic college detail page
│   ├── compare/          # College comparison page
│   ├── dashboard/        # Student saved dashboard
│   ├── discussions/      # Forums and answers
│   └── predictor/        # Cutoff rank predictor tool
├── components/           # Reusable UI components
│   ├── chatbot/          # UniBot widget component
│   ├── college/          # College filters, cards, and detail tabs
│   ├── layout/           # Shared Header and Footer
│   └── ui/               # Base styled components (shadcn/ui-inspired)
├── lib/                  # Helper utilities, Prisma client, and mock datasets
├── prisma/               # Database schema definitions and seed scripts
├── services/             # Database access and query caching services
├── store/                # Zustand global state configurations
└── types/                # TypeScript interface type definitions
```

---

## 🚀 Deployment

The project is configured for seamless deployment on **Vercel**:
1. Connect your GitHub repository to Vercel.
2. Add your `.env` variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`) in Vercel's Project Settings under **Environment Variables**.
3. Deploy! Vercel automatically detects Next.js configurations and handles edge compilation.

---

## 👩‍💻 Developer Info

Created and maintained by **Sneha Chandravanshi**:
- **GitHub:** [@SnehaChandravanshi](https://github.com/SnehaChandravanshi)
- **LinkedIn:** [Sneha Chandravanshi](https://www.linkedin.com/in/sneha-chandravanshi-374082252/)
- **Email:** [chandravanshisneha102@gmail.com](mailto:chandravanshisneha102@gmail.com)
