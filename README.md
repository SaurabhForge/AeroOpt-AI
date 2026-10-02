# ✈️ AeroOpt AI — Intelligent Air Operations & Resource Optimisation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node.js-22.x-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Dual--Engine-DC382D.svg?logo=redis)](https://redis.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101.svg?logo=socketdotio)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock%20AgentCore-FF9900.svg?logo=amazon-aws)](https://aws.amazon.com/bedrock/)

> **Air Power: Dynamic Air Operations & Resource Optimisation System**  
> An AI-enabled decision-support platform designed for authorized military and air operations planners. AeroOpt AI consolidates fragmented airframe availability, crew readiness, severe weather restrictions, and mission priorities into a single operational picture, computing optimal sortie schedules in **sub-20 milliseconds**.

---

## 🌐 Live Cloud Deployment

* **AWS S3 Live Portal:** [http://aeroopt-ai-frontend-473412285410.s3-website.ap-south-1.amazonaws.com](http://aeroopt-ai-frontend-473412285410.s3-website.ap-south-1.amazonaws.com)
* **Local Development Dashboard:** `http://localhost:5173`
* **Local Backend API & WebSocket Server:** `http://localhost:5000`

---

## 🔑 Operational Credentials

| Role | User ID (Email ID) | Security Access Key | Scope |
|---|---|---|---|
| **Wing Commander / Admin** | `saurabhkr` *(or `saurabhkr@aeroopt.ai`)* | `Password@1234` | Full tactical authority, registry administration, audit inspection |
| **Flight Operations Planner** | `planner` *(or `planner@aeroopt.ai`)* | `Planner@1234` | Schedule optimization, what-if disruption simulations, assignment approvals |
| **Air Marshal / Chief of Staff** | `admin` *(or `admin@aeroopt.ai`)* | `Admin@1234` | Command oversight, policy configuration, schedule rollback |

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────────────────────┐
                               │             AeroOpt Tactical Mission HUD               │
                               │        (React 19 + TailwindCSS + Recharts SPA)         │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         HTTPS REST / WSS Socket.IO
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │              Node.js Express API Gateway               │
                               │     (JWT Auth, Rate Limiter, Audit Trail Middleware)    │
                               └──────────────┬──────────────────────────┬──────────────┘
                                              │                          │
                        Sub-millisecond Cache │                          │ Persistent State
                                              ▼                          ▼
                               ┌────────────────────────┐      ┌────────────────────────┐
                               │   Redis Dual Engine    │      │   MongoDB Data Store   │
                               │ • Schedule Caching     │      │ • Fleet Registry       │
                               │ • 24h Lockout Keys     │      │ • Crew Duty Records    │
                               │ • Real-Time Telemetry  │      │ • Mission Sorties      │
                               └────────────────────────┘      │ • Weather Conditions   │
                                                               │ • Immutable Audit Log  │
                                                               └────────────────────────┘
                                              │
                                              ▼
                               ┌────────────────────────────────────────────────────────┐
                               │          Constraint-Based Optimisation Engine          │
                               │ • Multi-Resource Feasibility Matcher (<20ms runtime)  │
                               │ • Dynamic Replanning & Disruption Diff Simulator       │
                               │ • Predictive Airframe Risk & Crew Fatigue Scorer       │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │           Amazon Bedrock AgentCore Runtime             │
                               │ • Natural Language Mission Reasoner (Claude 3.5)       │
                               │ • CDK-Synthesized Cloud Infrastructure                 │
                               └────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Operational Modules

### 1. Unified Operations Dashboard (`/`)
* **Fleet Readiness Donut**: Real-time visualization of Serviceable, Scheduled Maintenance, and Grounded assets.
* **Mission Task Stream**: Dynamic queue ordered by tactical priority (P1–P5) and countdown to mission deadline.
* **Airspace & Sector Weather Map**: Operational status for Northern, Western, and Southern sectors with active airspace restriction levels.
* **Live Socket.IO Stream**: Zero-refresh event feed broadcasting resource state changes across all connected dispatch terminals.

### 2. Fleet & Airframe Registry (`/fleet`)
* Comprehensive tracking for 10 military airframes across multiple classes:
  * **F-16C Fighting Falcon** (Air Superiority)
  * **C-130J Super Hercules** (Tactical Airlift)
  * **UH-60 Black Hawk** (Combat SAR / Medevac)
  * **P-8A Poseidon** (Maritime Surveillance & ASW)
  * **MQ-9 Reaper** (Persistent ISR)
* Tracks airframe hours against maximum limits, fuel tank reserves, and maintenance windows.
* Inline status transitions (`SERVICEABLE`, `MAINTENANCE`, `GROUNDED`, `MISSION`) that immediately trigger automatic cache invalidation.

### 3. Crew Duty & Readiness Roster (`/crew`)
* Detailed roster of 8 flight personnel with rank, active type-ratings, and duty status (`AVAILABLE`, `ON_DUTY`, `REST`, `SICK`).
* 7-day cumulative duty hour meters with automated visual indicators for fatigue thresholds (60-hour regulatory limit).

### 4. Mission Task Scheduling (`/tasks`)
* 12 priority-sorted mission profiles covering Air Defence Patrols, Forward Operating Base Resupply, Medevac, Long-Range Maritime Recon, and Combat Air Patrols.
* Sortie parameters include aircraft type requirements, estimated duration, sector destination, and weather sensitivity flags.

### 5. Constraint-Based Resource Optimiser (`/optimiser`)
* **Hard Constraints Enforced:**
  1. *Aircraft Serviceability*: Excludes grounded airframes and aircraft with active maintenance windows.
  2. *Crew Certification*: Ensures flight officers hold valid type-ratings for assigned aircraft.
  3. *Fatigue & Rest Regulations*: Enforces strict 60-hour weekly duty limits and mandatory rest windows.
  4. *Airspace Weather Safety*: Blocks weather-sensitive missions from sectors with severe convective restrictions (Level ≥ 3).
* **Multi-Objective Optimization:** Tasks are sorted by weighted priority descending and deadline ascending. Load balancing allocates airframes with highest fuel levels and crew with lowest accumulated fatigue.
* **Performance:** Executes in **< 20ms**, providing transparent reasons for any unassigned missions (e.g. `No qualified crew available for F-16C`).

### 6. Dynamic Replanning & What-if Scenario Simulator (`/scenarios`)
* Simulate operational disruptions in seconds:
  * Sudden Airframe Grounding (e.g. hydraulic fault AOG on AO-06).
  * Flight Crew Illness / Medical Hold.
  * Incursion of severe convective weather storms.
* Generates an immediate **Before vs. After** comparison table displaying affected sorties, recovered flights, and replanning latency.

### 7. Predictive Readiness & Risk Scoring (`/reports`)
* **Aircraft Maintenance Risk Index**: Algorithmic scoring evaluating flight hour saturation and days elapsed since depot overhaul.
* **Crew Fatigue Index**: Calculates rest deficits to forecast pilot availability over rolling 72-hour windows.

### 8. Human-in-the-Loop Approval & Immutable Audit Trail (`/audit`)
* Ensures autonomous AI recommendations require authorized human sign-off before becoming active orders of battle.
* Planners review proposed sortie allocations and click **Approve** or **Reject**.
* Every state transition is recorded in an immutable audit ledger capturing user identity, timestamp, action type, and JSON payload diffs.

### 9. Indian Air Force Portal & Security Enforcements (`/login`)
* Authentic visual recreation of the **Indian Air Force portal**:
  * Official high-resolution Indian Air Force Crest with golden Ashoka Lions, Himalayan Eagle, and Devanagari motto banner (*नभः स्पृशं दीप्तम्*).
  * Dynamic gradient Captcha with randomized characters, noise, strike-through line, and instant refresh.
* **Security Policies:**
  * Typed credentials are never auto-completed or auto-replaced.
  * Caution warning alert displaying remaining attempts on incorrect password.
  * **10-Attempt Limit**: Automatically locks the terminal for **24 hours** after 10 consecutive failed attempts across both Redis and MongoDB.

---

## ⚡ Redis Dual-Engine Caching Architecture

AeroOpt AI features an integrated Redis caching layer configured with dual-engine resilience:

1. **Sub-Millisecond Schedule Cache:**
   * Baseline optimization results are stored in Redis (`cache:optimizer:schedule:latest`) with a 5-minute TTL.
   * Repeated queries hit Redis with **0.8ms latency** rather than re-computing.
   * Smart invalidation flushes the cache the instant any airframe, crew, weather, or task record changes.
2. **Atomic Lockout Management:**
   * Failed attempts are tracked via `auth:attempts:${email}` with atomic increments.
   * Lockout status is maintained in `auth:lock:${email}` with native Redis 24-hour expiration (`EX 86400`).
3. **Zero-Config Resilient Fallback:**
   * If a live Redis server is running on `redis://127.0.0.1:6379`, `ioredis` connects automatically.
   * If Redis is not installed on a presentation machine, it falls back to an embedded in-memory TTL cache with identical APIs so the demo never crashes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, Vite 8, TailwindCSS 3.4, Recharts, Lucide Icons, Zustand |
| **Backend API** | Node.js, Express.js 4, Socket.IO 4, JWT, BcryptJS, Express-Validator |
| **Database** | MongoDB, Mongoose 8 (with embedded zero-config fallback) |
| **Cache & Real-time** | Redis (`ioredis`), Dual-Engine In-Memory Cache |
| **AI & Agentic Core** | Amazon Bedrock AgentCore CLI (`@aws/agentcore`), Strands TypeScript SDK |
| **Cloud Infrastructure** | AWS S3 (Static Website Hosting), AWS CDK Toolkit (`CDKToolkit` in `ap-south-1`) |

---

## 🚀 Local Installation & Setup

### Prerequisites
* **Node.js** v18 or higher (Node v20+ recommended)
* **npm** v9 or higher
* *(Optional)* MongoDB and Redis installed locally. If not present, AeroOpt AI will automatically start its zero-config embedded database and cache.

### 1. Clone Repository
```bash
git clone https://github.com/SaurabhForge/AeroOpt-AI.git
cd AeroOpt-AI
```

### 2. Setup & Start Backend Server
```bash
cd server
npm install
node index.js
```
*The server will start on `http://localhost:5000` and automatically seed the initial fleet, crew, weather, and mission records.*

### 3. Setup & Start Frontend Dashboard
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
*The client dashboard will launch at `http://localhost:5173`.*

---

## 📡 API Reference Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate ops personnel & issue JWT | No |
| `GET` | `/api/aircraft` | Retrieve all 10 airframe readiness states | Yes (Bearer) |
| `PATCH` | `/api/aircraft/:id/status` | Update airframe status & invalidate cache | Yes (Bearer) |
| `GET` | `/api/crew` | List all flight personnel & duty hours | Yes (Bearer) |
| `GET` | `/api/tasks` | List all mission tasks sorted by priority | Yes (Bearer) |
| `POST` | `/api/optimize` | Run constraint optimizer (Redis cached) | Yes (Bearer) |
| `DELETE` | `/api/optimize/cache` | Purge optimizer Redis cache | Yes (Bearer) |
| `GET` | `/api/scenarios` | List what-if disruption scenarios | Yes (Bearer) |
| `POST` | `/api/scenarios/:id/run` | Execute dynamic replanning simulation | Yes (Bearer) |
| `GET` | `/api/reports/readiness` | Generate predictive risk & fatigue indices | Yes (Bearer) |
| `GET` | `/api/audit` | Fetch immutable planner decision trail | Yes (Bearer) |
| `GET` | `/api/system/status` | Real-time health metrics for Redis & DB | No |

---

## 👨‍✈️ Author & Credits

* **Lead Engineer:** [Saurabh Kumar](https://github.com/SaurabhForge)
* **Team Member**: [Ashish Kumar](https://github.com/Ashish666-28)
* **Team Member**: [Vishwas havalada](https://github.com/vishwa424)
* **Problem Statement:** Air Power — Dynamic Air Operations & Resource Optimisation
* **Organization:** Ministry of Defence (MoD) Decision Support System

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
