# PharmaAtlas

A full-stack intelligent medicine availability and pharmacy discovery platform built to help users quickly locate medicines nearby through real-time community-powered reporting.

PharmaAtlas combines:

* Real-time medicine reporting
* Interactive map visualization
* AI-powered medicine suggestions
* Nearby pharmacy discovery
* Report verification system
* Google Maps navigation support
* Admin moderation tools

Designed with scalability, performance, and modern UI/UX principles in mind.

---

# Overview

Finding medicines quickly during emergencies can be difficult, especially for rare or urgent medications.

PharmaAtlas solves this problem by enabling users to:

* Report medicine availability in real time
* Discover nearby pharmacies
* Search medicines instantly
* View reports directly on maps
* Navigate to pharmacies through Google Maps
* Receive AI-powered suggestions
* Verify report authenticity

The platform acts as a collaborative medicine intelligence network.

---

# Key Features

## Real-Time Medicine Reporting

Users can:

* Submit medicine availability reports
* Set stock levels
* Add pharmacy information
* Include notes and updates
* Track report expiry

---

## Interactive Map Visualization

The platform includes a dynamic map system where users can:

* View nearby medicine reports
* Explore pharmacies geographically
* Open detailed report panels
* Interact with real-time markers

---

## AI-Powered Suggestion System

Integrated AI features provide:

* Smart medicine suggestions
* Nearby alternative discovery
* Faster search assistance
* Intelligent medicine recommendation workflows

---

## Nearby Pharmacy Discovery

Built-in geolocation support allows users to:

* Find pharmacies nearby
* Search pharmacies dynamically
* Add new pharmacies
* View verified pharmacies

---

## Google Maps Navigation Integration

Users can navigate directly to pharmacy locations using Google Maps integration.

Features include:

* Live location routing
* One-click navigation
* Geographic pharmacy discovery
* Route optimization support

---

## Verification System

Community-driven verification helps maintain data accuracy.

Admins can:

* Confirm reports
* Deny invalid reports
* Moderate submissions
* Track verification interactions

---

## Admin Dashboard

Administrative controls include:

* User management
* Medicine management
* Pharmacy moderation
* Report moderation
* Platform analytics

---

## Real-Time Notification System

The platform now supports live real-time medicine reporting updates using Socket.IO.

Users instantly receive notifications when:

* A new medicine report is submitted nearby
* Medicine availability changes
* Nearby pharmacies receive new stock reports

Features include:

* Live notification badge updates
* Instant cross-browser synchronization
* Real-time report delivery
* Dynamic UI updates without page refresh
* Community interaction workflows (verify / deny / skip)

---


# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Zustand
* Axios

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Maps & Location

* Geolocation API
* Google Maps Navigation
* Coordinate-based pharmacy search

---

## AI Features

* AI-powered medicine suggestions
* Intelligent recommendation workflows
* Search assistance system

---

## Realtime Communication

* Socket.IO
* WebSocket-based live updates

---

# Architecture Highlights

## Frontend Architecture

Modern component-driven architecture with:

* Reusable UI components
* Centralized state management
* Protected routing
* Modular feature organization

---

## Backend Architecture

Scalable REST API architecture including:

* Authentication layer
* Role-based access control
* Secure middleware
* Structured controllers/services

---

# Database Design

The system includes structured relationships between:

* Users
* Medicines
* Pharmacies
* Reports
* Verifications

Core entities support:

* Real-time medicine reporting
* Verification workflows
* Pharmacy discovery
* User interactions

---

## Realtime Architecture

PharmaAtlas uses a real-time event-driven architecture powered by Socket.IO.

Workflow:

```text
User submits report
        ↓
Backend emits "report:created"
        ↓
Connected clients receive event
        ↓
Zustand store updates instantly
        ↓
Notification UI refreshes automatically
```

This enables:

* Live medicine availability tracking
* Instant community updates
* Real-time collaborative verification

---


# Core Functionalities

## User Features

* Register/Login
* Report medicine availability
* Search medicines
* Explore nearby pharmacies
* Manage personal reports
* Use AI assistance
* Navigate via maps

---

## Admin Features

* Manage medicines
* Manage pharmacies
* Manage reports
* Verify submissions
* Monitor users

---

# Security Features

* JWT authentication
* Protected routes
* Role-based authorization
* Secure API middleware
* HTTP-only cookie support

---

# UI/UX Highlights

The application includes:

* Production-level responsive design
* Glassmorphism interfaces
* Interactive map overlays
* Smooth transitions
* Dynamic modals
* Real-time UI feedback
* Professional dashboard experience
* Live notification system
* Instant report updates
* Dynamic real-time interactions
* Seamless cross-session synchronization


---

# Folder Structure

```bash id="m1n2o3"
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── README.md
```

---

# Installation

## Clone Repository

```bash id="p4q5r6"
git clone <repository-url>
```

---

# Frontend Setup

```bash id="s7t8u9"
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash id="v1w2x3"
http://localhost:5173
```

---

# Backend Setup

```bash id="y4z5a6"
cd backend
npm install
npm start
```

Backend runs on:

```bash id="b7c8d9"
http://localhost:4040
```

---

# Environment Variables

## Backend `.env`

```env id="e1f2g3"
PORT=4040
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---

## Frontend `.env`

```env id="h4i5j6"
VITE_API_URL=http://localhost:4040
```

---

# API Capabilities

The backend provides APIs for:

* Authentication
* Medicine management
* Pharmacy discovery
* Nearby pharmacy search
* Report creation
* Verification workflows
* User management

---

# Performance Optimizations

The platform includes:

* Optimized rendering
* Efficient state management
* Reduced unnecessary re-renders
* Debounced searching
* Modular component structure

---

# Future Enhancements

Planned improvements include:

* Advanced AI medicine predictions
* Pharmacy inventory sync
* Progressive Web App support
* Dark mode
* Voice search
* Mobile application

---

# Use Cases

PharmaAtlas is useful for:

* Emergency medicine discovery
* Rare medicine tracking
* Community-driven healthcare support
* Pharmacy availability monitoring
* Faster medicine access workflows

---

# Production Readiness

The platform follows production-grade standards including:

* Scalable architecture
* Modular code organization
* Secure authentication
* Professional UI system
* Optimized API communication
* Maintainable component structure

---

# Live Deployment

## Frontend

🌐 https://pharma-atlas.vercel.app

## Backend API

⚙️ https://pharmaatlas.onrender.com

---

# Author

Akaash

---

# License

This project is licensed under the MIT License.
