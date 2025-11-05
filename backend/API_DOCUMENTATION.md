# SlotSwapper API Documentation (Updated)

Base URL (deployed): `https://<your-backend-domain>`

Base URL (local): `http://localhost:3000`

Notes:
- All routes in this project are mounted under `/api` (e.g. `/api/auth/register`).
- Endpoints marked 🔒 require authentication via HttpOnly cookies (`accessToken` / `refreshToken`). The server expects requests with credentials (cookies) enabled.

---

## Authentication

All auth routes live under `/api/auth`.

### Register — Create a new user
POST /api/auth/register

Request JSON:
```json
{
  "username": "alice",
  "gmail": "alice@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "message": "user created successfully",
  "user": { "_id": "...", "username": "alice", "gmail": "alice@example.com" }
}
```

Notes: password is hashed server-side before saving.

---

### Login — Authenticate user
POST /api/auth/login

Request JSON:
```json
{
  "gmail": "alice@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": { "id": "...", "username": "alice", "gmail": "alice@example.com" }
}
```

Behavior:
- On successful login the server sets two HttpOnly cookies: `accessToken` and `refreshToken`.
- For cross-site cookie usage the server must set cookies with `SameSite=None` and `Secure=true`. In this project that behavior is enabled when a production-like env var is set (the server checks `PRODUCTION` or `isProd` / `NODE_ENV === 'production'` depending on your configuration). Ensure you set `PRODUCTION=true` (or `isProd=true`) in Vercel if you need `Secure` + `SameSite=None`.
- Frontend must send requests with credentials: `fetch(..., { credentials: 'include' })` or `axios(..., { withCredentials: true })`.

---

### Logout — Sign out
POST /api/auth/logout

Response (200):
```json
{ "message": "Sign out Successfully done" }
```

Behavior: clears `accessToken` and `refreshToken` cookies and removes the refresh token from the user's stored tokens.

---

### Update Password (Authenticated)
PUT /api/auth/update-password 🔒

Request JSON:
```json
{
  "password": "oldPassword123",
  "newPassword": "newPassword456"
}
```

Response (200):
```json
{ "message": "Password updated successfully" }
```

This route requires the authentication middleware (cookie-based JWT verification). If the access token is expired but a valid refresh token exists, the middleware will rotate tokens and set new cookies.

---

## Events

All event routes live under `/api/events` and require authentication.

### Get My Events
GET /api/events 🔒

Response (200): array of event objects (returns an empty array if none found)
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

Notes: The API returns 200 with an empty array when the user has no events (preferred for collection endpoints).

---

### Create Event
POST /api/events 🔒

Request JSON:
```json
{
  "title": "Team Meeting",
  "startTime": "2025-11-05T10:00:00.000Z",
  "endTime": "2025-11-05T11:00:00.000Z",
  "description": "Optional"
}
```

Response (201):
```json
{
  "message": "Event created successfully",
  "event": { "eventid": "a1b2c3d", "title": "Team Meeting", "startTime": "...", "endTime": "...", "status": "BUSY", "userId": "..." }
}
```

---

### Update Event
PUT /api/events/:id 🔒

Request example (partial update):
```json
{ "status": "SWAPPABLE" }
```

Response (200):
```json
{ "message": "Event updated", "event": { ... } }
```

---

### Delete Event
DELETE /api/events/:id 🔒

Response (200):
```json
{ "message": "Event deleted" }
```

---

## Swap / Slot Exchange

Swap routes are mounted under `/api` via `swapRoute`.

### Get Swappable Slots
GET /api/swappable-slots 🔒

Response (200): array of events with status `SWAPPABLE`, excluding the requesting user's events.

### Create Swap Request
POST /api/swap-request 🔒

Request JSON:
```json
{
  "mySlotId": "a1b2c3d",
  "theirSlotId": "x9y8z7w"
}
```

Response (201):
```json
{ "message": "Swap request created", "requestCode": "aB12Cd" }
```

### Respond to Swap Request
POST /api/swap-response/:requestCode 🔒

Request JSON:
```json
{ "accept": true }
```

Response (200): success message (`Swap accepted successfully` or `Swap request rejected`).

### Get My Swap Requests
GET /api/swap-requests 🔒

Response (200): structured object with `incoming` and `outgoing` request lists and counts.

Notes: There is a `getPendingSwapRequestsHandler` in the controller, but it is not currently wired to a route; use `/api/swap-requests` to get a user's requests.

---

## Authentication & Cookies (Important)

- Cookies used: `accessToken` (short-lived), `refreshToken` (longer-lived).
- For cross-origin frontends the following must be true:
  - Server sets cookies with `SameSite=None` and `Secure=true` (set `PRODUCTION=true` / `isProd=true` in Vercel so server sets these flags).
  - Frontend must call the API with credentials: `fetch(..., { credentials: 'include' })` or `axios(..., { withCredentials: true })`.
  - Server CORS config must include the frontend origin and `credentials: true` so `Access-Control-Allow-Credentials` and `Access-Control-Allow-Origin` are present.

## Common status codes
- 200 OK — successful GET or other non-creation responses
- 201 Created — successful POST that creates a resource
- 400 Bad Request — invalid input
- 401 Unauthorized — missing/invalid tokens
- 403 Forbidden — user not allowed
- 404 Not Found — single resource not found (not used for empty collections)
- 500 Server Error — unexpected errors

---

If you'd like, I can:
- add examples for `fetch` / `axios` showing credentials usage,
- add pagination examples for `/api/events`, or
- generate an OpenAPI spec (swagger) from the routes.

