# 🔗 Linkly - Developer-First URL Platform

Linkly is a production-ready, full-stack URL management platform and developer API built with React, Node.js, PostgreSQL, and Redis. It is engineered with a **cache-first architecture** and **asynchronous job queues** to support high-throughput redirects and automated background monitoring.

---

## 🏗️ System Architecture

```
                       ┌──────────────────────┐
                       │   Client / Dev API   │
                       └──────────┬───────────┘
                                  │
                       [ HTTP Redirect Path ]
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │     Redis Cache      │  ──(Cache Hit: p99 <10ms)──► [ Redirect ]
                       └──────────┬───────────┘
                                  │ (Cache Miss)
                                  ▼
                       ┌──────────────────────┐
                       │   PostgreSQL DB      │  ──(Write-Through Cache)───► [ Redirect ]
                       └──────────┬───────────┘
                                  │
                        [ Asynchronous Jobs ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────┐                               ┌─────────────────┐
│  BullMQ Worker  │                               │  BullMQ Worker  │
│ (Analytics Log) │                               │ (Health Monitor)│
└─────────────────┘                               └─────────────────┘
```

---

## 🚀 Key Features

*   ⚡ **Cache-First Routing**: Fast redirects hitting Upstash Redis before querying the database, ensuring low-latency lookups.
*   📬 **Async Analytics Queue**: Click events (IP, User-Agent, referrers) are queued in BullMQ and parsed by workers asynchronously.
*   👥 **Multi-Tenant Workspaces**: Group and organize links into collaborative workspaces.
*   🔑 **Developer API Keys**: Programmatic, machine-to-machine integrations. API keys (`linkly_sk_...`) are SHA-256 hashed before storage.
*   ❤️ **Automated Health Monitoring**: BullMQ workers periodically check target URLs (HEAD requests with GET fallbacks), auto-marking dead links as broken after 3 consecutive failures.
*   🔄 **Instant Re-verification**: Inline user-triggered health checks with visual loading states for manual recovery.
*   🖼️ **Social Preview Cards**: Automatic scraping of Open Graph meta-tags (title, description, image) for bot-rich links and preview cards.
*   🔒 **Enterprise Security**: Dual auth (Firebase JWT + Secure API Keys), rate limiting, Helmet security headers, and compression.
*   ⚙️ **Link Controls**: Custom short-code aliases, expiration timestamps, click limits (self-destructing links), and downloadable QR codes.

---

## 🛠️ Tech Stack

### Frontend
- **Core:** React 19, Vite, Tailwind CSS (V4)
- **State & Routing:** React Router, Context API
- **Analytics & Visuals:** Recharts, Lucide Icons, Framer Motion
- **Networking:** Axios, Firebase Client SDK

### Backend
- **Core:** Node.js, Express, Sequelize (PostgreSQL)
- **Caching & Queues:** Redis (ioredis), BullMQ
- **Background Engines:** `geoip-lite` (location metrics), `ua-parser-js` (device stats), `open-graph-scraper` (meta scraping)
- **Security:** Firebase Admin SDK, Helmet, `express-rate-limit`, `bcrypt`, `crypto`

---

## 📦 Project Structure

```text
linkly/
├── client/                 # Frontend React Web Application
│   ├── src/
│   │   ├── components/     # UI elements (UrlShortner, Dashboard, etc.)
│   │   ├── context/        # React Context providers (AuthContext, etc.)
│   │   ├── pages/          # Application views (Dashboard, Auth, Previews)
│   │   └── index.css       # Styling configuration (Tailwind V4)
│   └── package.json
│
└── server/                 # Backend Node.js API Service & Background Workers
    ├── src/
    │   ├── controllers/    # API endpoint business logic
    │   ├── db/             # PostgreSQL connection & Sequelize setup
    │   ├── middlewares/    # Custom auth (JWT & API Keys) & rate limiters
    │   ├── models/         # Database schemas (User, Url, Workspace)
    │   ├── queues/         # BullMQ queue registrations (analytics, health)
    │   └── workers/        # BullMQ background job workers & processors
    ├── migrate-workspaces.js
    ├── migrate-health-check.js
    └── package.json
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Redis

### 1. Installation
Clone the repository and install dependencies in both project directories:

```bash
# Clone the repository
git clone https://github.com/Shobhit070304/linkly.git
cd linkly

# Install Frontend packages
cd client && npm install

# Install Backend packages
cd ../server && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `client/` folder:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_BASE_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000
```

Create a `.env` file in the `server/` folder:
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/linkly

# Redis
REDIS_URL=redis://localhost:6379

# Server & Routing
PORT=8000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000/

# Previews
DEFAULT_PREVIEW_IMG=https://example.com/default-preview.png

# Firebase Service Account
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=your_client_email
```

### 3. Setup Database Schema
Before starting the backend, run the migration scripts to ensure your tables have the workspace and health-check fields:

```bash
# From the server/ directory
node migrate-workspaces.js
node migrate-health-check.js
```

### 4. Run the Application

```bash
# Start Client Development Server (in client/)
npm run dev

# Start Backend Server & Workers (in server/)
npm start
```

---

## 🔌 API Reference

All requests must contain a valid `Authorization: Bearer <token>` header, accepting either a Firebase JWT token or a Workspace API Key (`linkly_sk_...`).

### 🔗 URLs
- `POST /api/url/shorten` - Shorten a target URL (supports custom aliases, workspaces, expiry, health-monitoring config).
- `GET /api/url/me` - Fetch the authenticated user's URLs (supports filtering by workspace).
- `POST /api/url/:shortUrl/check-health` - Manually trigger an instant health check and return results.
- `POST /api/url/delete` - Delete a short URL (evicts related cache keys).

### 👥 Workspaces
- `POST /api/workspaces/create` - Create a workspace and generate a secure API Key.
- `GET /api/workspaces` - Retrieve all workspaces owned by the user.
- `DELETE /api/workspaces/:id` - Delete a workspace (cascades and deletes all associated URLs).

---

## 🛡️ License
Built by Shobhit using modern web technologies. Licensed under the ISC License.
