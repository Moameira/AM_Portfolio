<div align="center">

# AM Portfolio

### A retro Windows-style personal portfolio with a private GitHub-authenticated CMS

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)](https://react.dev)
[![Auth.js](https://img.shields.io/badge/Auth.js-GitHub%20OAuth-111?style=for-the-badge)](https://authjs.dev)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis-00E9A3?style=for-the-badge&logo=redis&logoColor=111)](https://upstash.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## Overview

AM Portfolio is my personal portfolio website, designed with a nostalgic Windows 95/98 interface. It keeps the playful desktop experience from the original static HTML version, including the boot sequence, Start menu, taskbar, desktop icons, CRT-style hero section, and animated typewriter role text.

The project has been upgraded from a static portfolio into a small full-stack web app. Visitors can view the portfolio normally, while only I can sign in with GitHub OAuth and edit portfolio content directly through the website UI. Saved edits persist in Redis, so skills, projects, and profile updates remain available after refreshes and future visits.

---

## Features

- Retro Windows 95/98-inspired interface
- Animated boot sequence before the portfolio loads
- Desktop icons, Start menu, taskbar, and live clock
- CRT-style hero window with animated role/typewriter text
- Public read-only portfolio for visitors
- Private owner-only edit mode
- GitHub OAuth authentication with Auth.js / NextAuth
- Admin authorization by GitHub username
- Editable skills and projects through the browser
- Persistent content storage with Upstash Redis
- API routes for public content loading and protected admin saving
- Vercel-ready deployment

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 15 |
| UI | React 19 |
| Styling | CSS3, custom retro design system |
| Authentication | Auth.js / NextAuth with GitHub OAuth |
| Authorization | GitHub username allow-list |
| Database | Upstash Redis |
| Hosting | Vercel |
| Version Control | Git + GitHub |

---

## Project Structure

```txt
AM_Portfolio/
├── app/
│   ├── api/
│   │   ├── admin/content/route.js
│   │   ├── auth/[...nextauth]/route.js
│   │   └── content/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   ├── auth.js
│   ├── content-store.js
│   └── default-content.js
├── .env.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

---

## How It Works

Visitors load the portfolio through the public page. The frontend fetches portfolio content from:

```txt
GET /api/content
```

That endpoint returns saved Redis content if it exists. If Redis is empty, the app falls back to `lib/default-content.js`.

Editing is protected. Only a signed-in GitHub user whose username matches `ADMIN_GITHUB_LOGIN` can save content through:

```txt
PUT /api/admin/content
```

If someone else visits the site, they can read the portfolio but cannot modify anything.

---

## Local Setup

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Run the app locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

Create `.env.local` for local development:

```env
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
ADMIN_GITHUB_LOGIN=Moameira
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

Important: never commit `.env.local`. It contains private secrets and is ignored by Git.

---

## GitHub OAuth Setup

Create a GitHub OAuth app for local development:

```txt
GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App
```

Use:

```txt
Application name: AM Portfolio Local
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

Copy the GitHub OAuth Client ID and Client Secret into `.env.local`:

```env
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

For production, create a second GitHub OAuth app with the Vercel URL:

```txt
Homepage URL: https://your-vercel-domain.vercel.app
Authorization callback URL: https://your-vercel-domain.vercel.app/api/auth/callback/github
```

---

## Redis Setup

Create an Upstash Redis database and copy the REST credentials:

```env
UPSTASH_REDIS_REST_URL=your_rest_url
UPSTASH_REDIS_REST_TOKEN=your_rest_token
```

After editing environment variables, restart the dev server:

```bash
npm run dev
```

Then sign in, edit a skill or project, save, and refresh the page. If the change remains, Redis persistence is working.

---

## Deploying To Vercel

Push the project to GitHub:

```bash
git init
git add .
git commit -m "Initial portfolio with admin CMS"
git branch -M main
git remote add origin https://github.com/Moameira/AM_Portfolio.git
git push -u origin main
```

Then import the repository on Vercel:

```txt
Vercel -> New Project -> Import Git Repository -> Deploy
```

Add the same environment variables in:

```txt
Vercel Project -> Settings -> Environment Variables
```

For production, use:

```env
AUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

After adding environment variables, redeploy the project.

---

## Skills I Gained From This Project

These are resume-ready skills learned or strengthened while building this project:

- Built a full-stack portfolio application with Next.js and React
- Converted a static HTML/CSS website into a dynamic CMS-backed web app
- Implemented GitHub OAuth authentication using Auth.js / NextAuth
- Added owner-only authorization with a GitHub username allow-list
- Designed protected API routes for private content editing
- Created public API routes for read-only portfolio content
- Integrated Upstash Redis as persistent cloud storage
- Managed environment variables and application secrets securely
- Deployed a Next.js application to Vercel
- Connected a GitHub repository to a production deployment workflow
- Debugged authentication, missing secret, and API response errors
- Improved error handling for failed save requests
- Preserved a custom retro UI while adding full-stack functionality
- Structured project data for editable skills, projects, education, and experience
- Practiced Git, GitHub repository setup, commits, remotes, and deployment flow

Resume version:

```txt
Built and deployed a full-stack Next.js portfolio with GitHub OAuth admin authentication, protected API routes, and persistent Upstash Redis storage. Converted a static HTML/CSS portfolio into a CMS-style web app where only the verified owner can edit and save content through the UI.
```

---

## Future Improvements

- Add image upload support for project screenshots
- Add editable education and experience sections in the admin UI
- Add content validation before saving
- Add preview/draft mode before publishing
- Add automatic backups of Redis content

---

## Author

**Mohamed Ameira**

- GitHub: [Moameira](https://github.com/Moameira)
- LinkedIn: [Mohamed Ameira](https://linkedin.com/in/mohamed-ameira-8122b31a7)
- Portfolio: coming soon

---

<div align="center">

Built with nostalgia, Next.js, GitHub OAuth, Redis, and a lot of debugging.

</div>
