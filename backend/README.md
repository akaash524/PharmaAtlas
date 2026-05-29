# PharmaAtlas Backend

A scalable backend infrastructure for **PharmaAtlas**, a real-time medicine availability and pharmacy discovery platform.

This backend powers location-aware medicine reporting, nearby pharmacy discovery, verification workflows, authentication, and intelligent medicine availability tracking.

Designed with scalability, security, and modular architecture in mind.

---

# Overview

PharmaAtlas helps users quickly locate medicines from nearby pharmacies through community-driven reporting and real-time availability updates.

The backend provides:

* Authentication & Authorization
* Medicine Availability Reporting
* Nearby Pharmacy Discovery
* Geospatial Queries
* Verification & Moderation System
* Report Expiry Logic
* Role-based Access Control
* RESTful APIs
* Secure Cookie-based Sessions

---

# Core Features

## Authentication System

* JWT Authentication
* Secure HTTP-only Cookies
* User Registration & Login
* Logout Support
* Protected Routes
* Role-based Authorization

---

## Medicine Reporting

Users can:

* Submit medicine availability reports
* Add stock information
* Attach pharmacy references
* Add additional notes
* View personal reports
* Delete submitted reports

---

## Nearby Pharmacy Discovery

Integrated geolocation system allowing users to:

* Find nearby pharmacies
* Search pharmacies dynamically
* Add new pharmacies
* Discover pharmacies within configurable radius
* Use MongoDB geospatial indexing

---

## Verification System

Admins can:

* Confirm reports
* Deny inaccurate reports
* Moderate community submissions
* Track report interaction counts

---

## Expiry Logic

Reports automatically become outdated after a configured duration.

System includes:

* Expiry tracking
* Remaining availability timers
* Expired report handling

---

## Geospatial Search

Uses MongoDB GeoJSON and geospatial indexes for:

* Nearby pharmacy lookup
* Radius-based filtering
* Fast location queries
* Real-time pharmacy discovery

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* bcryptjs
* cookie-parser

## Utilities

* dotenv
* cors
* nodemon

---

# Architecture

```bash id="v0stfr"
backend/
│
├── CONFIG/
│   ├── db.js
│
├── CONTROLLERS/
│
├── MIDDLEWARES/
│
├── MODELS/
│
├── ROUTES/
│
├── SERVICES/
│
├── utils/
│
├── .env
├── package.json
├── server.js
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env id="6w9xwa"
PORT=4040

MONGO_DB_URL=your_mongodb_connection_url

JWT_SECRET_KEY=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

---

# Installation

## Clone Repository

```bash id="qpkjvh"
git clone <repository-url>
```

---

## Navigate to Backend

```bash id="78b1c4"
cd backend
```

---

## Install Dependencies

```bash id="a4v7p0"
npm install
```

---

# Running The Server

## Development Mode

```bash id="s99h6q"
npm run dev
```

---

## Production Mode

```bash id="l2xjlwm"
npm start
```

---

# Server URL

```bash id="5f7v0x"
http://localhost:4040
```

---

# API Modules

# Authentication APIs

## Register User

```http id="pwyw5t"
POST /user-api/register
```

---

## Login User

```http id="ppdqq7"
POST /user-api/login
```

---

## Logout User

```http id="qdl9sy"
POST /user-api/logout
```

---

# Medicine APIs

## Get Medicines

```http id="1cl0sk"
GET /user-api/medicines
```

---

# Pharmacy APIs

## Get Nearby Pharmacies

```http id="6l4s2q"
GET /user-api/pharmacies/nearby
```

### Query Parameters

```bash id="n23olz"
lat
lng
radius
```

---

## Add New Pharmacy

```http id="7h5ctg"
POST /user-api/pharmacies
```

---

# Report APIs

## Create Report

```http id="6rb9iu"
POST /user-api/reports
```

---

## Get My Reports

```http id="0yprxq"
GET /user-api/my-reports
```

---

## Verify Report

```http id="r8kg2g"
POST /reports/:id/verify
```

---

## Delete Report

```http id="oj4vgm"
DELETE /reports/:id
```

---

# Authentication & Security

The backend includes multiple security layers:

* Password hashing with bcrypt
* JWT token validation
* Protected middleware
* Role-based route protection
* HTTP-only cookie sessions
* Secure CORS configuration
* Input validation
* Restricted admin routes

---

# Geolocation Implementation

Pharmacies are stored using MongoDB GeoJSON structure.

Example:

```js id="vkx97j"
location: {
  type: "Point",
  coordinates: [longitude, latitude]
}
```

This enables:

* Radius-based pharmacy search
* Distance filtering
* Nearby pharmacy discovery
* Fast geospatial queries

---

# Scalability Considerations

The backend is designed with modular architecture for scalability.

Supports future integration of:

* Socket.IO real-time updates
* AI-based medicine recommendations
* Push notifications
* Report analytics
* Pharmacy reputation system
* Cloud media uploads
* Advanced caching
* Microservices migration

---

# Scripts

## Run Development Server

```bash id="zjlwm4"
npm run dev
```

---

## Start Production Server

```bash id="zhr7ee"
npm start
```

---

# Future Enhancements

Planned improvements include:

* Real-time report broadcasting
* AI-powered medicine alternatives
* Intelligent pharmacy ranking
* User reputation scoring
* Report trust system
* Advanced admin dashboard
* Analytics & monitoring
* Multi-language support

---

# Author

Akaash

---

# License

This project is licensed under the MIT License.
