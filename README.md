# Pfandtastisch

Find nearby pfand (bottle deposit) machines in Berlin, see whether they're working, and leave tips for other recyclers.

- **client/**: React + TypeScript + Vite, MUI, Leaflet, Zustand
- **server/**: Express + MongoDB (Mongoose), JWT auth via Passport, Cloudinary for profile pictures

## Getting started

Requirements: Node 22, Yarn, a MongoDB database (the `supermarkets` collection needs a `2dsphere` index on `loc`, which Mongoose creates on startup).

```bash
cd server && yarn install && cp .env.example .env
```

```bash
cd client && yarn install && cp .env.example .env.local
```

Fill in both env files, then start the API and the client together:

```bash
cd server && yarn dev:all
```

The client runs on http://localhost:5173 and the API on http://localhost:5000.

### Environment variables

| Where  | Variable                     | Purpose                                                                 |
| ------ | ---------------------------- | ----------------------------------------------------------------------- |
| server | `MONGO_URI`                  | MongoDB connection string (required)                                    |
| server | `JWT_SECRET`                 | Secret for signing login tokens (required)                              |
| server | `CLIENT_ORIGIN`              | Comma-separated origins allowed by CORS (default: production client and `http://localhost:5173`) |
| server | `CLOUDINARY_*`               | Cloudinary credentials for profile picture uploads                      |
| client | `VITE_SERVER_BASE`           | URL of the API server                                                   |
| client | `VITE_JAWG_MAP_ACCESS_TOKEN` | Jawg map tiles token                                                    |

## Scripts

| Directory | Command        | What it does                         |
| --------- | -------------- | ------------------------------------ |
| server    | `yarn dev`     | API with auto-reload                 |
| server    | `yarn dev:all` | API and client together              |
| server    | `yarn start`   | API without auto-reload              |
| server    | `yarn test`    | API tests (no database needed)       |
| client    | `yarn dev`     | Vite dev server                      |
| client    | `yarn lint`    | ESLint                               |
| client    | `yarn build`   | Type-check and production build      |

## API

| Method | Path                                          | Auth | Description                                    |
| ------ | --------------------------------------------- | ---- | ---------------------------------------------- |
| POST   | `/api/users/new`                              |      | Sign up (multipart, optional `image_url` file) |
| POST   | `/api/users/login`                            |      | Log in, returns `{token, user}`                |
| GET    | `/api/users/me`                               | ✓    | Current user                                   |
| PATCH  | `/api/users/me`                               | ✓    | Update username/email/picture; password change needs `currentPassword` |
| GET    | `/api/businesses/supermarketsWithPfandAutomat` |      | `?longitude&latitude&radius` (meters, max 10000) |
| GET    | `/api/businesses/supermarketById/:id`         |      | One machine with its comments                  |
| POST   | `/api/businesses/supermarkets/:id/comments`   | ✓    | Add a comment `{comment}`                      |
| DELETE | `/api/businesses/comments/:commentId`         | ✓    | Delete your own comment                        |
| PATCH  | `/api/businesses/supermarkets/:id/status`     | ✓    | Report `{isOperational: boolean}`              |

Authenticated routes expect `Authorization: Bearer <token>`. Login and signup are rate limited.
