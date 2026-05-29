# PharmaAtlas Frontend

A modern, responsive frontend for **PharmaAtlas** — a real-time medicine availability and nearby pharmacy discovery platform.

Built using React and modern frontend architecture principles, the application delivers a fast, scalable, and production-ready user experience.

---

# Overview

PharmaAtlas enables users to:

* Discover nearby pharmacies
* Report medicine availability
* Search medicines quickly
* View live medicine reports on maps
* Receive intelligent medicine suggestions
* Track and manage personal reports

The frontend focuses on:

* Smooth user experience
* Responsive UI
* Real-time interaction
* Clean modern design
* Modular component architecture

---

# Features

## Authentication System

* User Registration
* User Login
* Protected Routes
* Persistent Authentication
* Role-based UI Rendering

---

## Interactive Map System

* Real-time report visualization
* Interactive medicine report markers
* Dynamic report selection
* Detailed report side panel

---

## Medicine Reporting

Users can:

* Submit medicine availability reports
* Select nearby pharmacies
* Add custom pharmacies
* Set stock levels
* Add additional notes
* Manage submitted reports

---

## Nearby Pharmacy Discovery

* Geolocation-enabled pharmacy search
* Dynamic filtering
* Nearby pharmacy suggestions
* Verified pharmacy indicators

---

## AI Suggestion System

Integrated AI-powered assistance for:

* Medicine suggestions
* Smart recommendations
* Faster discovery workflow

---

## Notifications System

* Real-time notification UI
* Report interaction updates
* User activity alerts

---

## User Dashboard

* View personal reports
* Delete reports
* Profile management
* Account controls

---

# Tech Stack

## Frontend Framework

* React.js
* Vite

## State Management

* Zustand

## HTTP Client

* Axios

## Styling

* Tailwind CSS

## Maps & Location

* Geolocation API
* Interactive Map Components

---

# Project Structure

```bash id="e1u2t3"
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── Components/
│   │   ├── AdminProfile.jsx
│   │   ├── AdminStats.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── ManageMedicines.jsx
│   │   ├── ManagePharmacies.jsx
│   │   ├── ManageReports.jsx
│   │   ├── ManageUsers.jsx
│   │   ├── MapView.jsx
│   │   ├── MyReports.jsx
│   │   ├── NotificationBox.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Register.jsx
│   │   ├── ReportById.jsx
│   │   ├── ReportCard.jsx
│   │   ├── ReportForm.jsx
│   │   ├── RootLayout.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SuggestionBox.jsx
│   │   ├── UserProfile.jsx
│   │
│   ├── config/
│   │   ├── api.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── mapStore.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│
├── package.json
```

---

# UI Highlights

The frontend includes:

* Modern glassmorphism effects
* Responsive layouts
* Floating action interfaces
* Dynamic modals
* Animated transitions
* Interactive report cards
* Professional dashboard styling
* Production-level Tailwind UI system

---

# Installation

## Clone Repository

```bash id="i8o9p0"
git clone <repository-url>
```

---

## Navigate to Frontend

```bash id="m2n3b4"
cd frontend
```

---

## Install Dependencies

```bash id="c5v6x7"
npm install
```

---

# Running The Frontend

## Development Mode

```bash id="d8f9g0"
npm run dev
```

---

## Production Build

```bash id="h1j2k3"
npm run build
```

---

# Development Server

```bash id="l4m5n6"
http://localhost:5173
```

---

# Environment Configuration

Create a `.env` file in the frontend root.

```env id="o7p8q9"
VITE_API_URL=http://localhost:4040
```

---

# Authentication Flow

The frontend uses:

* JWT-based authentication
* HTTP-only cookies
* Persistent auth state
* Zustand global state management

---

# State Management

## Zustand Stores

### authStore.js

Handles:

* Authentication state
* Current user data
* Login/logout
* Protected session management

---

### mapStore.js

Handles:

* Map state
* Selected report markers
* Location data
* Report interactions

---

# Responsive Design

The frontend is optimized for:

* Desktop devices
* Tablets
* Mobile screens
* Large displays

Uses fully responsive Tailwind utility architecture.

---

# Core Components

## ReportForm

Advanced medicine reporting interface featuring:

* Nearby pharmacy search
* Dynamic stock selection
* Pharmacy creation
* Professional modal UI

---

## ReportCard

Production-level medicine report card system with:

* Verification controls
* Expiry tracking
* Stock indicators
* Admin moderation tools

---

## MapView

Interactive medicine report visualization system.

Supports:

* Report marker rendering
* Real-time interaction
* Dynamic report selection

---

# Security Features

* Protected frontend routes
* Role-based rendering
* Session persistence
* Controlled admin access
* Error boundaries

---

# Performance Optimizations

* Lazy rendering patterns
* Optimized state updates
* Efficient component structure
* Scroll performance improvements
* Reduced unnecessary re-renders

---

# Future Enhancements

Planned frontend improvements include:

* Real-time WebSocket updates
* AI-powered medicine recommendations
* Progressive Web App support
* Dark mode
* Offline report caching
* Push notifications
* Advanced analytics dashboard

---

# Author

Akaash

---

# License

This project is licensed under the MIT License.
