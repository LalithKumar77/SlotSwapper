# SlotSwapper

A small full-stack project for swapping event slots.

Repository: https://github.com/LalithKumar77/SlotSwapper

## Quick start (Windows / PowerShell)

1. Clone the repo

```powershell
git clone https://github.com/LalithKumar77/SlotSwapper.git
cd SlotSwapper
```

2. Backend

- Change to the backend folder, install dependencies and create a `.env` file.

```powershell
cd backend
npm install
```

- Create a file named `.env` in `backend/` with at least the following keys (example values shown):

```
MONGO_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3000
PRODUCTION=false
```

Notes:
- `MONGO_URI` can point to a local MongoDB instance or a MongoDB Atlas connection string.
- `FRONTEND_URL` is used by the backend cors configuration and should match where the frontend will run (default Vite port is `5173`).
- `PRODUCTION=true` changes cookie `sameSite`/`secure` behaviour.

Start the backend in development mode (uses nodemon):

```powershell
npm run dev
```

Or in production mode:

```powershell
npm start
```

The backend default port is `3000` (can be overridden with the `PORT` env var). The API root will be `http://localhost:3000/api` by default.

3. Frontend

- Open a new terminal and change to the frontend folder, then install dependencies:

```powershell
cd ../frontend
npm install
```

- Create a Vite env file at `frontend/.env` (Vite expects `VITE_` prefixed vars) with the backend base URL if you need to override the default:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the frontend dev server (Vite):

```powershell
npm run dev
```

Default frontend URL: `http://localhost:5173`

To create a production build and preview it locally:

```powershell
npm run build
npm run preview
```

## Environment variables summary

- Backend (`backend/.env`):
  - `MONGO_URI` (required) — MongoDB connection string
  - `JWT_SECRET` (required) — secret for access tokens
  - `JWT_REFRESH_SECRET` (required) — secret for refresh tokens
  - `FRONTEND_URL` (recommended) — frontend origin for CORS
  - `PORT` (optional) — backend port (default 3000)
  - `PRODUCTION` (optional) — set to `true` in production

- Frontend (`frontend/.env`):
  - `VITE_API_BASE_URL` (optional) — e.g. `http://localhost:3000/api`

## Useful scripts

- Backend (from `backend/`):
  - `npm run dev` — start backend with nodemon
  - `npm start` — start backend with node

- Frontend (from `frontend/`):
  - `npm run dev` — start Vite dev server
  - `npm run build` — build production bundle
  - `npm run preview` — preview built bundle

## Notes & Troubleshooting

- CORS / Cookies: The backend uses cookie-based auth and is configured to allow origins listed in `FRONTEND_URL` (and a couple of defaults). If you run frontend on a different port or host, add that URL to the backend `.env` as `FRONTEND_URL` and restart the backend.

- If you see `MongoDB connection error` in the backend logs, verify `MONGO_URI` and that your MongoDB instance is reachable.

- If `nodemon` or `vite` are not recognized after `npm install`, ensure you are using Node.js >= 16 and npm is available on PATH.

- The frontend expects the API base to expose these routes (examples):
  - `POST /api/auth/register` — register
  - `POST /api/auth/login` — login
  - `POST /api/auth/logout` — logout
  - `GET /api/events` — fetch user events

## Contributing

If you'd like to contribute: fork the repo, create a branch, and open a PR with your changes.

## License

This project uses the license in the repository root (`LICENSE`).
