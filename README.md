# AM_Portfolio

Retro Windows-style portfolio with private website editing.

Visitors can view the portfolio, but only the GitHub account listed in `ADMIN_GITHUB_LOGIN` can add, edit, remove, and save content. Saved data lives in Redis through Vercel Marketplace / Upstash Redis.

## 1. Create This Folder In VS Code

Create this project folder:

```txt
AM_Portfolio/
```

Then add the files in the same paths as this folder:

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

## 2. Install And Run Locally

Open the `AM_Portfolio` folder in VS Code, then run:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

At first, saving will not work until Redis and GitHub OAuth are configured. The public portfolio still loads from the default data in `lib/default-content.js`.

## 3. Create A GitHub OAuth App

Go to GitHub:

```txt
GitHub -> profile picture -> Settings -> Developer settings -> OAuth Apps -> New OAuth App
```

For local development, use:

```txt
Application name: AM Portfolio Local
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

After creating the app, copy:

```txt
Client ID
Client Secret
```

Put them into `.env.local`:

```env
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

Also generate a secret:

```bash
openssl rand -base64 32
```

Add it:

```env
AUTH_SECRET=the_generated_secret
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
ADMIN_GITHUB_LOGIN=Moameira
```

Important: `ADMIN_GITHUB_LOGIN` must be your exact GitHub username. Only that GitHub account will be allowed to save edits.

## 4. Add Redis Storage

Vercel KV is no longer the new-project product. For new projects, use Redis from the Vercel Marketplace, commonly Upstash Redis.

On Vercel:

```txt
Project -> Storage / Marketplace -> Redis -> Upstash Redis -> Connect
```

Vercel should add environment variables for you. Locally, copy the Redis values into `.env.local`:

```env
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
```

Restart the local dev server after editing environment variables.

## 5. Editing Content Through The Website

1. Open the site.
2. Click `Owner login`.
3. Sign in with GitHub.
4. If your GitHub username matches `ADMIN_GITHUB_LOGIN`, the `Edit Portfolio` button appears.
5. Add, edit, or remove skills and projects.
6. Click `Save changes`.

After saving, reload the page. The changes should still be there because they are saved in Redis.

## 6. Deploy To Vercel

Create a GitHub repo and push this folder:

```bash
git init
git add .
git commit -m "Initial AM portfolio"
git branch -M main
git remote add origin https://github.com/Moameira/AM_Portfolio.git
git push -u origin main
```

Then in Vercel:

```txt
Vercel -> New Project -> Import GitHub repo -> Deploy
```

Add these environment variables in Vercel Project Settings:

```env
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_SECRET=...
ADMIN_GITHUB_LOGIN=Moameira
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

For production, set:

```env
AUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

## 7. Production GitHub OAuth App

GitHub OAuth Apps only have one callback URL. The easiest clean setup is to create a second OAuth app for production:

```txt
Application name: AM Portfolio Production
Homepage URL: https://your-vercel-domain.vercel.app
Authorization callback URL: https://your-vercel-domain.vercel.app/api/auth/callback/github
```

Then use that production app's Client ID and Client Secret in Vercel.

## Notes

- Do not expose `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, or Redis tokens in public code.
- Public visitors can call `GET /api/content`.
- Only the admin can call `PUT /api/admin/content`.
- The default content is in `lib/default-content.js`; once you save through the UI, Redis becomes the live source.
