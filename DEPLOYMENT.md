# Survey Hub — Deployment Guide

## Stack

- Node.js 20+ / Express 5 (server-rendered MVC)
- EJS views with `express-ejs-layouts`, Bootstrap 5 + Font Awesome from CDN
- **MongoDB** via Mongoose 8 (documents — there is no SQL anywhere in this project)
- Sessions stored in MongoDB via `connect-mongo`
- Joi validation, `bcrypt` password hashing, `method-override` for PUT/DELETE forms
- No frontend build step — `public/js/*.js` is plain browser JavaScript

Because pages are rendered on the server and sessions live in MongoDB, this app
needs a persistent Node process. **Netlify and Vercel cannot host it** (no
long-running server, no MongoDB).

## Recommended hosting

| Piece | Service | Why |
| --- | --- | --- |
| Web app | **Render — Web Service (Free)** | Runs a persistent Node process, deploys from GitHub, free HTTPS, blueprint included |
| Database | **MongoDB Atlas — M0 Free cluster** | Render has no MongoDB product, so a separate provider is required. Atlas M0 is free forever (512 MB). |

Alternatives for the web app: Koyeb (free web service), Fly.io (free allowance,
needs a Dockerfile). Railway fits the architecture but only gives trial credit.

### Free-tier limits you should know

- Render free web services **sleep after 15 minutes** of inactivity; the first
  request afterwards takes ~30–60 seconds.
- Render free: 512 MB RAM, shared CPU, ephemeral filesystem.
- Atlas M0: 512 MB storage, shared cluster, no backups.

## Required environment variables (Render dashboard)

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | a long random string (Render can generate it) |
| `MONGODB_URI` | Atlas SRV string, e.g. `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/online_survey_system?retryWrites=true&w=majority` |
| `ADMIN_EMAIL` | only needed if you run `npm run seed` |
| `ADMIN_PASSWORD` | only needed if you run `npm run seed` |

`PORT` is injected by Render — do not set it.

The app now exits with a clear message if `MONGODB_URI` or (in production)
`SESSION_SECRET` is missing, instead of failing obscurely.

## Commands

- Build command: `npm ci`
- Start command: `npm start`

There is **no migration step** — Mongoose creates collections and indexes on
first write.

## Step-by-step

1. **Prepare the repository.** From the `original` folder run `git init`,
   `git add .`, `git commit -m "Survey Hub"`, then push to a GitHub repo named
   **Survey Hub**. Check that `.env` is not in the commit (`git status`).
2. **Create the database.** Sign up at <https://www.mongodb.com/atlas>, create a
   free **M0** cluster, add a database user, and under *Network Access* allow
   `0.0.0.0/0` — Render free services have no fixed outbound IP. Copy the
   connection string and append the database name `/online_survey_system`.
3. **Create the web service.** At <https://render.com> choose
   *New → Web Service* and connect the repo. `render.yaml` supplies the runtime,
   plan and commands; if you create the service by hand set Runtime = Node,
   Build = `npm ci`, Start = `npm start`, Plan = Free.
4. **Set the environment variables** from the table above, then deploy.
5. **No database setup is required** — the first registration creates the
   collections automatically.
6. **(Optional) demo data.** In Render's *Shell* tab run `npm run seed`.
   ⚠️ The seed script **deletes and recreates** the sample accounts
   (`admin@example.com`, `riya@example.com`) and their surveys every time it
   runs, so never put it in the build command. Set `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` first so the deployed admin is not the well-known
   `admin@example.com / admin123`.
7. **Test the deployed app:** register → log in → create a survey → add
   questions → publish → open the `/s/<slug>` link in a private window → submit a
   response → check the results page.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `MONGODB_URI is not defined` and the service exits | add the variable in Render. |
| `MongooseServerSelectionError` at startup | Atlas *Network Access* is missing `0.0.0.0/0`, or the password in the URI has unescaped characters (URL-encode them). |
| **Login redirects back to the login page forever in production** | this was caused by the secure session cookie being dropped behind Render's proxy — fixed by `trust proxy`. If it reappears, confirm `NODE_ENV=production` is set and you are visiting the site over **https**. |
| Everyone is logged out after each deploy | was caused by the in-memory session store — now fixed with `connect-mongo`. Check the `sessions` collection exists in Atlas. |
| Build fails compiling `bcrypt` | `bcrypt` is a native module. If no prebuilt binary is available, run `npm remove bcrypt && npm install bcryptjs` and change `require('bcrypt')` to `require('bcryptjs')` in `models/User.js` — the API is identical. |
| First request after idle is slow | expected Render free-tier cold start. |

## Local development is unchanged

```bash
npm install
npm run seed
npm run dev
```

with `.env` copied from `.env.example` and MongoDB running on `127.0.0.1:27017`.
