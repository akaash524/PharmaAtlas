<div align="center">

<img src="https://img.shields.io/badge/PharmaAtlas-Medicine%20Locator-4F8EF7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzguMTMgMiA1IDUuMTMgNSA5YzAgNS4yNSA3IDEzIDcgMTNzNy03Ljc1IDctMTNjMC0zLjg3LTMuMTMtNy03LTd6bTAgOS41Yy0xLjM4IDAtMi41LTEuMTItMi41LTIuNVM5LjYyIDYuNSAxMSA2LjVzMi41IDEuMTIgMi41IDIuNVMxMy4zOCAxMS41IDEyIDExLjV6Ii8+PC9zdmc+" alt="PharmaAtlas"/>

# PharmaAtlas

### Crowdsourced Real-Time Medicine Locator

*Finding life-saving medicines shouldn't be a race against time.*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-pharma--atlas.vercel.app-4F8EF7?style=flat-square)](https://pharma-atlas.vercel.app)
[![API](https://img.shields.io/badge/⚙️%20API-pharmaatlas.onrender.com-27AE60?style=flat-square)](https://pharmaatlas.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-MERN-orange?style=flat-square)]()
[![AI](https://img.shields.io/badge/AI-Powered-6C63FF?style=flat-square)]()

</div>

---

## The Problem

When a rare or urgent medicine runs short, patients and families spend hours calling pharmacies one by one — with no centralized, real-time source of truth. Every minute wasted searching is a minute the patient goes without treatment.

No existing platform answers the question: **"Where can I find this medicine, right now, near me?"**

---

## The Solution

**PharmaAtlas** is a community-powered medicine availability platform. Users report medicine availability at local pharmacies in real time, verify each other's reports, and locate medicines on an interactive map — all updated live via WebSockets.

The community does what no single database can: keep availability data accurate, hyperlocal, and always fresh.

---

## Live Demo

| Surface | URL |
|---|---|
| 🌐 Frontend | https://pharma-atlas.vercel.app |
| ⚙️ Backend API | https://pharmaatlas.onrender.com |

---

## Feature Highlights

### Interactive Map View
- Leaflet.js powered map with pharmacy pins rendered in real time
- Pins grouped by pharmacy — one pin, multiple medicines
- **Marker clustering** for dense areas
- **Auto-fit map bounds** to show all nearby results at once
- Color-coded pins:  verified pharmacies vs unverified
- Click any pin for a popup with medicine list, stock level, and verify count

###  Smart Medicine Search
- Instant autocomplete dropdown with medicine name and category
- Selecting a medicine **filters map pins in real time** to show only pharmacies that stock it within your radius
- Debounced input — no unnecessary API calls
- Clear filter to return to full nearby view

###  Real-Time Medicine Reporting
- Submit availability reports with medicine, pharmacy, stock level (low / medium / high), and notes
- Reports **auto-expire after 24 hours** via MongoDB TTL index — data is always fresh, zero manual cleanup
- Inline pharmacy creation if the pharmacy doesn't exist yet
- Report instantly appears on the map for all nearby users via Socket.IO

###  Live Notification Feed
- Real-time notification box powered by **Socket.IO WebSockets**
- Shows nearby reports the user hasn't acted on yet
- Each card supports **Confirm** (verified) or **Skip** actions
- Interaction tracked per user — no duplicate votes
- Live badge counter updates without page refresh

###  Community Verification System
- Any user can confirm or deny a report
- Verify count and skip count displayed on each report card and map popup
- Interactions stored as embedded sub-documents inside each report — fast, no extra joins
- Reports with higher verify counts surface as more trustworthy

###  AI-Powered Medicine Suggestions
- Integrated AI feature that suggests medicines based on symptoms or context
- Helps users who don't know the exact medicine name find what they need
- Search-to-map pipeline: AI suggests → user selects → map filters → pharmacy found

###  Pharmacy Discovery & Navigation
- **Distance and ETA calculation** from user's current location to each pharmacy
- **One-click Google Maps navigation** — opens turn-by-turn routing instantly
- **Copy address to clipboard** with toast confirmation
- Geo-indexed pharmacy search using MongoDB `$near` and `2dsphere` index

###  Role-Based Auth System
- JWT authentication with HTTP-only cookies
- Two roles: `user` and `admin` — enforced on both frontend (protected routes) and backend (middleware)
- Register, login, logout, change password
- Deactivated accounts blocked at the API level

###  Admin Dashboard
- **Stats overview** — total users, reports, medicines, pharmacies
- **User management** — activate, deactivate, delete accounts
- **Medicine curation** — only admins can add/edit/delete medicines (prevents junk data)
- **Pharmacy moderation** — verify user-submitted pharmacies
- **Report moderation** — delete any report without ownership restriction
- Tabbed dashboard UI with nested routes

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework and build tool |
| React Router v7 | Client-side routing with nested routes |
| Zustand | Global state management (auth, location) |
| Leaflet.js + react-leaflet | Interactive map and marker rendering |
| Tailwind CSS | Utility-first styling with glassmorphism UI |
| Axios | HTTP client with credential support |
| Socket.IO Client | Real-time WebSocket communication |
| react-hot-toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database with geo-indexing |
| JWT + bcrypt | Authentication and password hashing |
| Socket.IO | WebSocket server for real-time events |
| Mongoose TTL Index | Auto-expiry of 24h reports |
| 2dsphere Index | Geo-proximity pharmacy queries |

### External Services
| Service | Purpose |
|---|---|
| Anthropic API | AI medicine suggestion feature |
| Google Maps | Navigation and routing |
| OpenStreetMap + Leaflet | Map tiles (no billing required) |
| MongoDB Atlas | Cloud database hosting |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                      │
│  SearchBar → Home → MapView → ReportForm → NotifBox     │
│                  Zustand (AuthStore)                    │
└────────────────────┬───────────────┬────────────────────┘
                     │ REST API      │ WebSocket
                     ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                  Express API Server                     │
│  /common-api  /user-api  /admin-api  Socket.IO          │
│  verifyToken middleware + role authorization            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                        │
│  users  medicines  pharmacies  reports                  │
│  2dsphere index    TTL index   interactions[]           │
└─────────────────────────────────────────────────────────┘
```

### Real-Time Event Flow

```
User submits report
       ↓
Backend saves to MongoDB
       ↓
Socket.IO emits "report:created" to nearby room
       ↓
Connected clients receive event instantly
       ↓
Zustand store updates → Notification badge increments
       ↓
Map pins re-render with new report
```

---

## Database Design

### Collections

| Collection | Purpose |
|---|---|
| `users` | Auth, roles, account status |
| `medicines` | Admin-curated medicine list |
| `pharmacies` | Geo-indexed pharmacy locations |
| `reports` | Crowdsourced availability data |
| `verifications` | Community confirm/deny records |

### Key Design Decisions

**Reports embed interactions** — instead of a separate collection, each report contains an `interactions[]` array of `{ userId, action, actedAt }`. This allows a single query to check if a user has acted on a report, with a compound unique index preventing duplicates.

**MongoDB TTL Index** — `expiresAt` field on reports is indexed with TTL. MongoDB automatically deletes expired documents — no cron job, no cleanup code needed.

**GeoJSON + 2dsphere** — pharmacies store location as GeoJSON `Point`. The `$near` operator with `$maxDistance` powers all proximity queries with sub-millisecond performance.

---

## API Reference

### Auth Routes (`/common-api`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create new account |
| POST | `/login` | Login, returns JWT cookie |
| POST | `/logout` | Clear session |
| PATCH | `/change-password` | Update password |

### User Routes (`/user-api`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/nearby` | Active reports near coordinates |
| GET | `/pharmacies/nearby` | Pharmacies within radius, optional medicine filter |
| POST | `/reports` | Submit availability report |
| POST | `/reports/:id/verify` | Confirm or deny a report |
| GET | `/medicines` | List all medicines |
| POST | `/pharmacies` | Add new pharmacy |
| GET | `/users/me` | Own profile |
| PATCH | `/users/me` | Update profile |

### Admin Routes (`/admin-api`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Platform overview counts |
| GET | `/users` | All users |
| PATCH | `/users/:id/status` | Activate / deactivate |
| POST | `/medicines` | Add medicine to curated list |
| PATCH | `/medicines/:id` | Edit medicine |
| PATCH | `/pharmacies/:id/verify` | Verify pharmacy |
| DELETE | `/reports/:id` | Delete any report |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Anthropic API key (for AI suggestions)

### Clone

```bash
git clone https://github.com/yourusername/pharmaatlas.git
cd pharmaatlas
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4040
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key
```

```bash
npm start
# API running at http://localhost:4040
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4040
```

```bash
npm run dev
# App running at http://localhost:5173
```

---

## User Flows

### Finding a Medicine
1. Login → map loads with all nearby pharmacy reports
2. Type medicine name in search bar → autocomplete dropdown appears
3. Select medicine → map pins filter to only pharmacies that stock it
4. Click a pin → popup shows stock level, verify count, distance, ETA
5. Click **Navigate** → opens Google Maps with turn-by-turn directions

### Submitting a Report
1. Click **+** button on Home screen
2. Select medicine from dropdown
3. Search for pharmacy — or add a new one (uses your location automatically)
4. Set stock level and optional note
5. Submit → report appears on map instantly for all nearby users

### Verifying a Report
1. Open notification box (bell icon)
2. See unverified nearby reports in feed
3. Click **Confirm** if you've seen the medicine there → verify count increments
4. Click **Skip** to dismiss without voting

---

## Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT stored in **HTTP-only cookies** — not accessible via JavaScript
- All protected routes validated server-side via `verifyToken` middleware
- Role enforcement on every admin endpoint — not just frontend route guards
- Deactivated users blocked at middleware level
- Ownership check on user report deletion — users can only delete their own reports

---

## Project Structure

```
pharmaatlas/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Home.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ReportForm.jsx
│   │   │   ├── NotificationBox.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── AdminProfile.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── ManageMedicines.jsx
│   │   │   ├── ManagePharmacies.jsx
│   │   │   ├── ManageReports.jsx
│   │   │   ├── AdminStats.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── config/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── MODELS/
│   │   ├── userModel.js
│   │   ├── medicineModel.js
│   │   ├── pharmacieModel.js
│   │   ├── reportModel.js
│   │   └── verificationModel.js
│   ├── ROUTES/
│   │   ├── commonRoute.js
│   │   ├── userRoute.js
│   │   └── adminRoute.js
│   ├── MIDDLEWARES/
│   │   └── verifyToken.js
│   └── server.js
│
└── README.md
```

---

## Future Enhancements

- 📱 **PWA support** — installable on mobile home screen
- 🔊 **Voice search** — search medicines hands-free
- 🌙 **Dark mode** — system-aware theme
- 📊 **Advanced analytics** — shortage trend graphs per city
- 🔄 **Pharmacy inventory sync** — direct API integration with pharmacy POS systems
- 🌍 **Multi-language** — regional language support for wider reach

---

## Author

**Akaash**

Built as an individual project with genuine purpose — making medicine discovery faster for people who need it most.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

*If PharmaAtlas helped you or inspired you, give it a ⭐ on GitHub.*

**PharmaAtlas — Because finding medicine shouldn't be harder than the illness.**

</div>