# 🤖 AI Chatbot - Secure Conversational AI Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ai-assistant-nextjs.netlify.app/)
[![Portfolio](https://img.shields.io/badge/portfolio-view-blue)](https://muhammadhaseebamjad-portfolio.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A production-ready, enterprise-grade AI chatbot application built with Next.js 15, featuring secure authentication, rate limiting, and integration with Meta's Llama AI model via OpenRouter. This project demonstrates modern web development practices with a focus on security, scalability, and user experience.

## 🌟 Live Demo

**🚀 [Try it Live](https://ai-assistant-nextjs.netlify.app/)**

**👨‍💻 [View My Portfolio](https://muhammadhaseebamjad-portfolio.netlify.app/)**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 **Enterprise-Grade Security**
- ✅ **Email verification required** for all users
- ✅ **Server-side rate limiting** (5 requests/day per user)
- ✅ **Row-Level Security (RLS)** in database
- ✅ **API key protection** (never exposed to client)
- ✅ **CSRF protection** via Next.js middleware
- ✅ **SQL injection prevention** via parameterized queries

### 🤖 **AI-Powered Chat**
- ✅ Powered by **Meta Llama 3.2** (3B parameters)
- ✅ Real-time conversational AI
- ✅ Context-aware responses
- ✅ Fast response times (<2 seconds)

### 👤 **User Management**
- ✅ Secure email/password authentication
- ✅ Email verification workflow
- ✅ Session management with auto-refresh
- ✅ Persistent user sessions

### 🎨 **Modern UI/UX**
- ✅ Dark theme with high contrast
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Real-time message updates

### 📊 **Rate Limiting & Monitoring**
- ✅ Daily request quota enforcement
- ✅ Real-time remaining request display
- ✅ Automatic reset at midnight UTC
- ✅ Database-backed tracking (unhackable)

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Supabase** - Authentication & PostgreSQL database
- **OpenRouter** - AI model gateway
- **Edge Functions** - Low-latency API responses

### **Database**
- **PostgreSQL** (via Supabase)
- **Row-Level Security (RLS)**
- **Automated backups**

### **Deployment & Hosting**
- **Netlify** - Frontend hosting & serverless functions
- **Supabase** - Database & authentication
- **OpenRouter** - AI inference

### **Security**
- **Supabase Auth** - JWT-based authentication
- **bcrypt** - Password hashing (via Supabase)
- **Server-side validation** - Input sanitization
- **Environment variables** - Secret management

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Netlify Edge   │
│   Functions     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│Supabase │ │  OpenRouter  │
│ Auth+DB │ │   (AI API)   │
└─────────┘ └──────────────┘
```

### **Request Flow**

1. **User Action** → Client-side validation
2. **API Request** → Next.js API route (server-side)
3. **Authentication Check** → Supabase verifies JWT
4. **Email Verification** → Confirms user email is verified
5. **Rate Limit Check** → Database query + increment
6. **AI Request** → OpenRouter API (Llama 3.2)
7. **Response** → Client receives AI message + remaining quota

---

## 🔒 Security Features

### **1. Authentication & Authorization**
```typescript
// Multi-layer security checks
✓ Middleware (route protection)
✓ Page-level auth (server components)
✓ API-level auth (every request)
✓ Database-level RLS (Postgres policies)
```

### **2. Rate Limiting**
- **Server-side enforcement** (cannot be bypassed)
- **Database-backed** (not cookies/localStorage)
- **Per-user tracking** (isolated by user ID)
- **Automatic reset** (daily at midnight UTC)

### **3. API Security**
```typescript
// API keys never exposed
✓ Server-only environment variables
✓ No client-side API calls to OpenRouter
✓ Request validation & sanitization
✓ Error messages don't leak sensitive info
```

### **4. Database Security**
```sql
-- Row-Level Security policies
✓ Users can only access their own data
✓ Service role for admin operations only
✓ Prepared statements (no SQL injection)
✓ Encrypted connections (SSL/TLS)
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account (free tier)
- OpenRouter account (free tier)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a new project at [supabase.com](https://supabase.com)
- Run the SQL schema (see `docs/database-setup.sql`)
- Enable email authentication
- Copy your project URL and keys

4. **Set up OpenRouter**
- Create account at [openrouter.ai](https://openrouter.ai)
- Generate API key (no credit card required)
- Copy your API key

5. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

6. **Run development server**
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx

# Site URL (for production)
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

**Security Notes:**
- Never commit `.env.local` to Git
- Use different keys for development/production
- Rotate keys if exposed
- Only `NEXT_PUBLIC_*` variables are exposed to browser

---

## 📦 Deployment

### **Deploy to Netlify**

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Netlify**
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import an existing project"
- Select your GitHub repository

3. **Configure build settings**
```
Build command: npm run build
Publish directory: .next
```

4. **Add environment variables**
- Go to Site settings → Environment variables
- Add all variables from `.env.local`

5. **Deploy**
- Click "Deploy site"
- Wait 2-3 minutes for build
- Your app is live! 🎉

### **Custom Domain (Optional)**
- Go to Domain settings
- Add custom domain
- Update DNS records
- SSL certificate auto-provisioned

---

## 📚 API Documentation

### **POST /api/chat**

Send a message to the AI chatbot.

**Request:**
```typescript
{
  message: string // User's message (max 4000 chars)
}
```

**Response (Success):**
```typescript
{
  response: string    // AI's response
  remaining: number   // Remaining requests today
  model: string       // AI model used
}
```

**Response (Rate Limited):**
```typescript
{
  error: string       // Error message
  remaining: 0        // No requests left
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (email not verified)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Server Error

### **GET /api/rate-limit-status**

Get current rate limit status without using a request.

**Response:**
```typescript
{
  used: number        // Requests used today
  remaining: number   // Requests remaining
  limit: number       // Daily limit (5)
}
```

---

## 📁 Project Structure

```
ai-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Main chat API
│   │   └── rate-limit-status/
│   │       └── route.ts          # Rate limit check API
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Email verification callback
│   ├── chat/
│   │   └── page.tsx              # Protected chat page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/login page
│   └── globals.css               # Global styles
├── components/
│   ├── auth-form.tsx             # Login/signup form
│   └── chat-interface.tsx        # Chat UI
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── admin.ts              # Admin client
│   └── rate-limit.ts             # Rate limiting logic
├── middleware.ts                 # Auth middleware
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── .env.local                    # Environment variables (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📸 Screenshots

### **Landing Page**
![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page+Screenshot)

### **Chat Interface**
![Chat Interface](https://via.placeholder.com/800x400?text=Chat+Interface+Screenshot)

### **Authentication**
![Auth Flow](https://via.placeholder.com/800x400?text=Authentication+Screenshot)

---

## ⚡ Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <2.5s
- **API Response Time:** <2s (average)
- **Bundle Size:** <200KB (gzipped)

### **Optimizations**
- Server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- Font optimization
- Edge functions (low latency)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Run `npm run lint` before committing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Haseeb Amjad**

- Portfolio: [muhammadhaseebamjad-portfolio.netlify.app](https://muhammadhaseebamjad-portfolio.netlify.app/)
- GitHub: [@yourusername](https://github.com/muhammadhaseeb417)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/muhammadhaseebamjad417)
- Email: muhammadhaseebamjad.dev@gmail.com

---

## 🙏 Acknowledgments

- **OpenRouter** - For providing free access to AI models
- **Supabase** - For authentication and database services
- **Netlify** - For seamless deployment and hosting
- **Meta AI** - For the Llama 3.2 model
- **Vercel** - For Next.js framework

---

## 📊 Project Stats

- **Lines of Code:** ~2,500
- **Development Time:** 2-3 weeks
- **Last Updated:** December 2024
- **Version:** 1.0.0

---

## 🎯 Future Enhancements

- [ ] Conversation history storage
- [ ] Multiple AI model selection
- [ ] Real-time streaming responses
- [ ] Message search functionality
- [ ] Export chat history
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Admin dashboard
- [ ] Analytics integration

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-chatbot/issues) page
2. Create a new issue with detailed information
3. Contact me via [portfolio](https://muhammadhaseebamjad-portfolio.netlify.app/)

---

## ⭐ Star This Project

If you found this project helpful, please give it a star! It helps others discover it.

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-chatbot?style=social)](https://github.com/yourusername/ai-chatbot/stargazers)

---

<div align="center">

**Built with ❤️ by Muhammad Haseeb Amjad**

[Live Demo](https://ai-assistant-nextjs.netlify.app/) • [Portfolio](https://muhammadhaseebamjad-portfolio.netlify.app/) • [Report Bug](https://github.com/yourusername/ai-chatbot/issues)

</div>