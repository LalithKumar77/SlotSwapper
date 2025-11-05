# SlotSwapper Backend API

A peer-to-peer time-slot scheduling application backend built with Node.js, Express, MongoDB, and JWT authentication.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Data Models](#data-models)
- [Project Structure](#project-structure)

---

## Overview

SlotSwapper allows users to:
- Manage their calendar events with busy/swappable slots
- Mark events as "SWAPPABLE" for others to see
- Request swaps with other users' swappable slots
- Accept or reject incoming swap requests
- Automatically exchange event ownership when a swap is accepted

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access & Refresh tokens with httpOnly cookies)
- **Password Hashing:** Argon2
- **Dependencies:**
  - `express` - Web framework
  - `mongoose` - MongoDB ODM
  - `jsonwebtoken` - JWT creation/validation
  - `argon2` - Password hashing
  - `cookie-parser` - Parse cookies
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment variables
  - `morgan` - HTTP request logger
  - `nanoid` - Unique ID generation

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Steps

1. **Navigate to the backend directory**
   ```powershell
   cd D:\SlotSwapper\backend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Create a `.env` file** in the `backend` folder with the following variables:

---

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/slotswapper?retryWrites=true&w=majority

# JWT Secrets (use strong random strings)
JWT_SECRET=your-super-secret-access-token-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-here

# Server Configuration
PORT=3000
PRODUCTION=false

# Optional: Frontend origin for CORS (if using a separate frontend)
FRONTEND_ORIGIN=http://localhost:3001
```

**Important:**
- Replace `<username>` and `<password>` with your MongoDB credentials
- Use strong, random secrets for JWT_SECRET and JWT_REFRESH_SECRET
- Set `PRODUCTION=true` when deploying to production

---

## Running the Server

### Development Mode (with auto-reload)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

You should see:
```
MongoDB Connected Successfully
Server is running on port 3000
```

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT tokens | No |
| POST | `/api/auth/logout` | Logout and clear tokens | No |
| PUT | `/api/auth/update-password` | Update user password | Yes |

### Event Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events for logged-in user | Yes |
| POST | `/api/events` | Create a new event | Yes |
| PUT | `/api/events/:id` | Update an event (by eventid) | Yes |
| DELETE | `/api/events/:id` | Delete an event (by eventid) | Yes |

### Swap Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swappable-slots` | Get all swappable slots from other users | Yes |
| POST | `/api/swap-request` | Create a swap request | Yes |
| POST | `/api/swap-response/:requestCode` | Accept/reject a swap request | Yes |
| GET | `/api/pending-swap-requests` | Get all pending swap requests | Yes |

---

## Testing with Postman

### Initial Setup in Postman

1. **Create a new Postman Collection** named "SlotSwapper API"
2. **Set Base URL Variable:**
   - Click on the collection → Variables tab
   - Add variable: `baseUrl` = `http://localhost:3000`

### Authentication Flow

#### 1. Register User A

**Request:**
```
POST {{baseUrl}}/api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "alice",
  "gmail": "alice@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "message": "user created successfully",
  "user": {
    "username": "alice",
    "gmail": "alice@example.com",
    "_id": "507f1f77bcf86cd799439011",
    "createdAt": "2025-11-05T10:00:00.000Z"
  }
}
```

---

#### 2. Login User A

**Request:**
```
POST {{baseUrl}}/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "gmail": "alice@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful"
}
```

**Important:** Postman will automatically store the `accessToken` and `refreshToken` cookies. These will be sent with subsequent requests.

---

#### 3. Register and Login User B

Repeat steps 1-2 with different credentials:

**Register User B:**
```json
{
  "username": "bob",
  "gmail": "bob@example.com",
  "password": "password456"
}
```

**Login User B:**
```json
{
  "gmail": "bob@example.com",
  "password": "password456"
}
```

**Tip:** Use Postman's cookie manager to switch between users, or use different Postman tabs/windows.

---

### Event Management

#### 4. Create Event (User A)

**Request:**
```
POST {{baseUrl}}/api/events
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Team Meeting",
  "startTime": "2025-11-05T10:00:00.000Z",
  "endTime": "2025-11-05T11:00:00.000Z"
}
```

**Expected Response (201):**
```json
{
  "message": "Event created successfully",
  "event": {
    "title": "Team Meeting",
    "eventid": "a1b2c3d",
    "startTime": "2025-11-05T10:00:00.000Z",
    "endTime": "2025-11-05T11:00:00.000Z",
    "status": "BUSY",
    "userId": "507f1f77bcf86cd799439011",
    "_id": "507f191e810c19729de860ea",
    "createdAt": "2025-11-05T09:00:00.000Z",
    "updatedAt": "2025-11-05T09:00:00.000Z"
  }
}
```

**Save the `eventid`** (e.g., "a1b2c3d") for the next steps.

---

#### 5. Get My Events (User A)

**Request:**
```
GET {{baseUrl}}/api/events
```

**Expected Response (200):**
```json
[
  {
    "eventid": "a1b2c3d",
    "title": "Team Meeting",
    "startTime": "2025-11-05T10:00:00.000Z",
    "endTime": "2025-11-05T11:00:00.000Z",
    "status": "BUSY"
  }
]
```

---

#### 6. Update Event to SWAPPABLE (User A)

**Request:**
```
PUT {{baseUrl}}/api/events/a1b2c3d
```
*Replace `a1b2c3d` with the actual `eventid` from step 4*

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "SWAPPABLE"
}
```

**Expected Response (200):**
```json
{
  "message": "Event updated",
  "event": {
    "eventid": "a1b2c3d",
    "title": "Team Meeting",
    "startTime": "2025-11-05T10:00:00.000Z",
    "endTime": "2025-11-05T11:00:00.000Z",
    "status": "SWAPPABLE",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

---

#### 7. Create Swappable Event (User B)

**Switch to User B's cookies** in Postman, then:

**Request:**
```
POST {{baseUrl}}/api/events
```

**Body (raw JSON):**
```json
{
  "title": "Focus Block",
  "startTime": "2025-11-06T14:00:00.000Z",
  "endTime": "2025-11-06T15:00:00.000Z"
}
```

**Save the returned `eventid`** (e.g., "x9y8z7w")

Then update it to SWAPPABLE:

**Request:**
```
PUT {{baseUrl}}/api/events/x9y8z7w
```

**Body:**
```json
{
  "status": "SWAPPABLE"
}
```

---

### Swap Flow

#### 8. View Swappable Slots (User B)

**Request:**
```
GET {{baseUrl}}/api/swappable-slots
```

**Expected Response (200):**
```json
[
  {
    "eventid": "a1b2c3d",
    "title": "Team Meeting",
    "startTime": "2025-11-05T10:00:00.000Z",
    "endTime": "2025-11-05T11:00:00.000Z",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": null,
      "email": null
    },
    "status": "SWAPPABLE"
  }
]
```

**Note:** `name` and `email` will be `null` because the User model uses `username` and `gmail` fields. This is a known issue in the controller populate call.

---

#### 9. Create Swap Request (User B)

User B offers their slot (`x9y8z7w`) for User A's slot (`a1b2c3d`).

**Request:**
```
POST {{baseUrl}}/api/swap-request
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "mySlotId": "x9y8z7w",
  "theirSlotId": "a1b2c3d"
}
```

**Expected Response (201):**
```json
{
  "message": "Swap request created",
  "requestCode": "aB12Cd"
}
```

**Save the `requestCode`** (e.g., "aB12Cd") for the next step.

**What happens:**
- Both events (`a1b2c3d` and `x9y8z7w`) status changes to `SWAP_PENDING`
- A SwapRequest document is created with status `PENDING`

---

#### 10. View Pending Swap Requests (User A)

**Switch to User A's cookies**, then:

**Request:**
```
GET {{baseUrl}}/api/pending-swap-requests
```

**Expected Response (200):**
```json
{
  "message": "Pending swap requests retrieved successfully",
  "count": 1,
  "data": [
    {
      "_id": "507f191e810c19729de860eb",
      "requestCode": "aB12Cd",
      "requesterId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": null,
        "email": null
      },
      "receiverId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": null,
        "email": null
      },
      "mySlotId": "x9y8z7w",
      "theirSlotId": "a1b2c3d",
      "status": "PENDING",
      "createdAt": "2025-11-05T10:30:00.000Z",
      "updatedAt": "2025-11-05T10:30:00.000Z"
    }
  ]
}
```

---

#### 11. Accept Swap Request (User A)

**Request:**
```
POST {{baseUrl}}/api/swap-response/aB12Cd
```
*Replace `aB12Cd` with the actual `requestCode` from step 9*

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "accept": true
}
```

**Expected Response (200):**
```json
{
  "message": "Swap accepted successfully"
}
```

**What happens:**
- SwapRequest status changes to `ACCEPTED`
- Event `a1b2c3d` owner changes from User A to User B
- Event `x9y8z7w` owner changes from User B to User A
- Both events status changes to `BUSY`

---

#### 12. Reject Swap Request (Alternative to Step 11)

If User A wants to reject instead:

**Body (raw JSON):**
```json
{
  "accept": false
}
```

**Expected Response (200):**
```json
{
  "message": "Swap request rejected"
}
```

**What happens:**
- SwapRequest status changes to `REJECTED`
- Both events status revert to `SWAPPABLE`

---

#### 13. Verify Swap (User A)

After accepting, check User A's events:

**Request:**
```
GET {{baseUrl}}/api/events
```

**Expected Response (200):**
```json
[
  {
    "eventid": "x9y8z7w",
    "title": "Focus Block",
    "startTime": "2025-11-06T14:00:00.000Z",
    "endTime": "2025-11-06T15:00:00.000Z",
    "status": "BUSY"
  }
]
```

User A now has User B's event!

---

### Additional Endpoints

#### Update Password

**Request:**
```
PUT {{baseUrl}}/api/auth/update-password
```

**Body (raw JSON):**
```json
{
  "password": "password123",
  "newPassword": "newPassword456"
}
```

**Expected Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

#### Logout

**Request:**
```
POST {{baseUrl}}/api/auth/logout
```

**Expected Response (200):**
```json
{
  "message": "Sign out Successfully done"
}
```

**What happens:**
- Refresh token is removed from the database
- Both `accessToken` and `refreshToken` cookies are cleared

---

#### Delete Event

**Request:**
```
DELETE {{baseUrl}}/api/events/a1b2c3d
```
*Replace `a1b2c3d` with the actual `eventid`*

**Expected Response (200):**
```json
{
  "message": "Event deleted"
}
```

---

## Data Models

### User Schema
```javascript
{
  username: String (required, unique),
  gmail: String (required, unique),
  password: String (required, hashed with argon2),
  refreshTokens: [
    {
      token: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Event Schema
```javascript
{
  eventid: String (unique, auto-generated with nanoid),
  title: String (required),
  startTime: Date (required),
  endTime: Date (required),
  status: String (enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"], default: "BUSY"),
  userId: ObjectId (ref: "User", required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### SwapRequest Schema
```javascript
{
  requestCode: String (unique, auto-generated with nanoid),
  requesterId: ObjectId (ref: "User", required),
  receiverId: ObjectId (ref: "User", required),
  mySlotId: String (required, references Event.eventid),
  theirSlotId: String (required, references Event.eventid),
  status: String (enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js       # User registration, login, logout, password management
│   ├── eventController.js      # Event CRUD operations
│   └── swapController.js       # Swap request logic
├── db/
│   └── db.js                   # MongoDB connection
├── middlewares/
│   ├── authMiddleware.js       # JWT verification and token rotation
│   └── morganLogger.js         # HTTP request logging
├── models/
│   ├── user.js                 # User schema
│   ├── Event.js                # Event schema
│   └── SwapRequest.js          # SwapRequest schema
├── routes/
│   ├── authRoute.js            # Auth endpoints
│   ├── eventRoute.js           # Event endpoints
│   └── swapRoute.js            # Swap endpoints
├── utils/
│   └── jwtUtils.js             # JWT token generation and verification
├── .env                        # Environment variables (not in repo)
├── package.json
├── server.js                   # Main application entry point
└── README.md                   # This file
```

---

## Authentication Details

### JWT Token Strategy

- **Access Token:**
  - Expires in 15 minutes
  - Stored in httpOnly cookie
  - Used for API authentication

- **Refresh Token:**
  - Expires in 7 days
  - Stored in httpOnly cookie and database
  - Used to rotate access tokens automatically

### Token Rotation

When an access token expires, the `authMiddleware` automatically:
1. Validates the refresh token
2. Generates new access and refresh tokens
3. Updates the database
4. Sets new cookies
5. Allows the request to proceed

This happens transparently—no action needed from the client.

---

## Common Issues & Troubleshooting

### 1. `req.body` is undefined

**Cause:** Missing `Content-Type: application/json` header

**Solution:** Ensure all POST/PUT requests have:
```
Content-Type: application/json
```

### 2. Cookies not being sent

**Cause:** Postman cookie jar not enabled or CORS issues

**Solution:**
- In Postman: Ensure cookies are enabled for the domain
- For cross-origin requests: Configure CORS in `server.js` with credentials

### 3. MongoDB connection error

**Cause:** Invalid `MONGO_URI` or network issues

**Solution:**
- Verify your MongoDB Atlas credentials
- Check IP whitelist in MongoDB Atlas
- Ensure your connection string is correctly formatted

### 4. "User not found" during token rotation

**Cause:** Refresh token not in database or expired

**Solution:** Login again to generate new tokens

### 5. Event not found when updating/deleting

**Cause:** Using MongoDB `_id` instead of `eventid`

**Solution:** Use the `eventid` field (e.g., "a1b2c3d"), not the `_id`

---

## Security Considerations

- **Passwords:** Hashed with Argon2 (industry-standard)
- **JWT Secrets:** Use strong, random strings (32+ characters)
- **httpOnly Cookies:** Prevents XSS attacks
- **Token Expiration:** Access tokens expire in 15 minutes
- **Production Mode:** Set `PRODUCTION=true` for secure cookies (HTTPS only)
- **CORS:** Configure allowed origins in production

---



**Happy Testing! 🚀**
