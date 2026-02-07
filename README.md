# Personal Notifier App

A location-based peer-to-peer alert system.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or URI provided in `.env`)

### 1. Backend
**Windows (PowerShell):**
```powershell
# Standard
cd server
npm run dev

# If scripts are blocked:
cmd /c "cd server && npm run dev"
```

**Mac/Linux:**
```bash
cd server && npm run dev
```

### 2. Frontend
**Windows (PowerShell):**
```powershell
# Standard
cd client
npm run dev

# If scripts are blocked:
cmd /c "cd client && npm run dev"
```

## Architecture
- **Server**: Node.js, Express, Socket.io, MongoDB. Handles auth, location tracking, and alert dispatch.
- **Client**: React, Vite, TailwindCSS, Leaflet. PWA for mobile use.

## Features
- **Geofenced Alerts**: Only users within the active region send/receive alerts.
- **Network Priority**: Users on Mobile Data are notified first.
- **Admin Control**: Web dashboard to approve users and manage regions.
- **Privacy**: Users outside the region are not tracked.

## Verification
To verify the core logic (Geofencing & Priority) without the UI:
```bash
cd server
npx ts-node src/verifyLogic.ts
```

## Admin Setup
To create an Admin user (so you can access `/admin`):
```bash
cd server
# Replace with your phone number

# Windows (PowerShell) - Standard
npx ts-node src/seedAdmin.ts +1234567890

# Windows (PowerShell) - If scripts are blocked:
cmd /c "npx ts-node src/seedAdmin.ts +1234567890"

# Mac/Linux
npx ts-node src/seedAdmin.ts +1234567890
```
Then login with that phone number in the app and navigate to `/admin`.
