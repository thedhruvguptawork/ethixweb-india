# Ethixweb India — Full Stack Developer Assessment

A responsive, India-focused redesign concept for Ethixweb, built with React, Vite, Tailwind CSS, Express, MongoDB, and JWT-protected admin access.

## Live links

- **Website:** https://ethixweb-india-sandy.vercel.app/
- **Admin:** https://ethixweb-india-sandy.vercel.app/admin
- **Backend health:** https://ethixweb-india-fojx.onrender.com/api/health
- **Repository:** https://github.com/thedhruvguptawork/ethixweb-india

> The admin page is accessed directly at `/admin`. It does not need to be linked from the public navigation. Share demo credentials with the assessor through the assessment submission, not in this public repository.

## Features

- Responsive landing page with services, concept work, company perspective, process, and enquiry form.
- Enquiry API backed by MongoDB.
- Server-side input validation with Zod.
- Honeypot field for basic bot/spam protection.
- Rate limiting for enquiry submissions and admin login.
- Helmet security headers and CORS configuration.
- JWT-protected admin API to list enquiries and update their status.
- Admin statuses: `new`, `contacted`, `qualified`, and `closed`.

## Tech stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express
- MongoDB and Mongoose
- Zod validation
- bcryptjs password hashing
- JSON Web Tokens
- Helmet, CORS, and express-rate-limit

## Local development

### Requirements
- Node.js (LTS recommended)
- npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/thedhruvguptawork/ethixweb-india.git
cd ethixweb-india
```

### 2. Install and configure the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace_with_a_bcrypt_hash
```

Generate a bcrypt hash using the installed `bcryptjs` package. Run this inside the `server` directory and replace the sample password with a private password of your choice:

```bash
node -e "require('bcryptjs').hash('YOUR_PRIVATE_PASSWORD', 12).then(console.log)"
```

Copy the printed hash into `ADMIN_PASSWORD_HASH`. The plaintext password is only for the login; store the hash in the server environment, never in source code.

Start the API:

```bash
npm start
```

The API runs at `http://localhost:5000` (or the port configured in your environment).

### 3. Install and configure the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Environment variables

### Backend (Render or local server)

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the server; Render provides this automatically. |
| `MONGODB_URI` | MongoDB connection string. |
| `CLIENT_URL` | Exact deployed frontend origin allowed by CORS, without a trailing slash. |
| `JWT_SECRET` | Long, random secret used to sign admin tokens. |
| `ADMIN_USERNAME` | Admin login username. |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password. |

### Frontend (Vercel or local client)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL, with no trailing slash and no `/api` suffix. |

After changing a Vercel environment variable, redeploy the frontend. After changing a Render environment variable, wait for the backend to redeploy.

## API routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check. |
| `POST` | `/api/leads` | Validate and save a new enquiry. |
| `POST` | `/api/admin/login` | Verify credentials and issue a JWT. |
| `GET` | `/api/admin/leads` | List recent leads; requires `Authorization: Bearer <token>`. |
| `PATCH` | `/api/admin/leads/:id` | Update a lead status; requires a valid admin JWT. |

## Design rationale: what makes it India-specific?

The concept frames the business for Indian businesses and audiences without relying on decorative stereotypes. The “Indian ambition, global standards” positioning recognises the pace and diversity of India's business landscape. The experience is mobile-first, with prominent calls to action, straightforward service language, and a short enquiry flow that collects familiar business contact details. The visual style stays premium and modern while the content emphasises practical outcomes, discoverability, automation, and growth.

## What was improved in this redesign?

- A clearer hero message and more prominent enquiry calls to action.
- Services grouped into readable categories so visitors can scan the offering.
- A consistent dark, red-accented visual system, responsive layouts, and subtle motion.
- A more direct contact flow with client-side and server-side validation.
- Database persistence for enquiries rather than hardcoded form responses.
- A protected admin area for reviewing leads and tracking their status.
- Security basics including environment-based secrets, password hashing, rate limiting, a honeypot, and JWT-protected admin endpoints.

## Concept work disclaimer

The portfolio cards shown on the site are illustrative concept projects created for this assessment; they are not presented as real client case studies.

## Deployment notes

- Frontend is deployed on Vercel.
- Backend is deployed on Render.
- MongoDB Atlas stores enquiry records.
- Configure `CLIENT_URL` to the exact Vercel origin, e.g. `https://ethixweb-india-sandy.vercel.app`.
- Configure `VITE_API_URL` to the Render base URL, e.g. `https://ethixweb-india-fojx.onrender.com`.
- Never commit `.env` files, database credentials, JWT secrets, or plaintext admin passwords.

## Assessment demo access

The admin dashboard is available at `/admin`. Set the demo username and password in the Render environment variables and provide the assessor with those credentials through the assessment form or another private channel. Do **not** publish the plaintext password or production secrets in this repository.

## Validation checklist

- [ ] Submit a valid test enquiry and confirm it appears in MongoDB.
- [ ] Confirm invalid form fields are rejected by the API.
- [ ] Confirm `/admin` loads after the Vercel SPA rewrite is deployed.
- [ ] Confirm admin login succeeds with the demo credentials.
- [ ] Confirm the leads list loads and status changes persist.
- [ ] Run PageSpeed Insights for mobile and desktop and record the actual results.
