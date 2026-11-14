# Shuvayan Sarkar — Portfolio

Personal developer portfolio built with React, Vite, Framer Motion and hand-written CSS,
with a small serverless backend (Vercel Functions) for the contact form.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173 (frontend + /api)
npm run build     # production build in /dist
npm run preview   # serve the production build (also serves /api)
```

The `/api` functions run inside the Vite dev/preview server through a small plugin in
[`vite.config.js`](vite.config.js), so no extra tooling (such as `vercel dev`) is needed.

## Contact form backend

[`api/contact.js`](api/contact.js) is a Vercel Serverless Function:

| Request              | Response                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `GET /api/contact`   | `{ configured: true \| false }`. The form only appears when `true`        |
| `POST /api/contact`  | Validates, rate-limits and emails the message through [Resend](https://resend.com) |

Protection: shared validation ([`src/utils/contactValidation.js`](src/utils/contactValidation.js))
on both client and server, a honeypot field, same-origin check, 10 KB body limit, HTML escaping,
and a best-effort limit of 5 messages per 15 minutes per IP.

Until an API key is set, the site shows the email/copy buttons instead of a form, so visitors
never see a form that can't deliver.

### Setup

1. Create a free account at [resend.com](https://resend.com) **using the inbox that should receive
   messages** (`shuvayansarkar357@gmail.com`). Without a verified domain, Resend only delivers to
   the account's own address, which is exactly what a portfolio needs.
2. Create an API key at <https://resend.com/api-keys>.
3. Local: copy `.env.example` to `.env.local` and paste the key into `RESEND_API_KEY`.
   Restart `npm run dev`; the form appears in the Contact section.
4. Vercel: add `RESEND_API_KEY` (and optionally `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) under
   Project → Settings → Environment Variables, then redeploy.

`.env.local` is git-ignored. Never commit the key.

## Editing content

All text, links, skills, projects and timeline entries live in
[`src/data/portfolioData.js`](src/data/portfolioData.js). Components read from it, so most
updates never touch JSX.

| What                 | Where                         | Notes                                                        |
| -------------------- | ----------------------------- | ------------------------------------------------------------ |
| Resume               | `profile.resumeUrl`           | Currently `/Shuvayan_Sarkar_Resume.pdf` in `/public`; replace the file to update it |
| Profile photo        | `profile.avatar`              | Import an image from `src/assets`, set `{ src, alt }`        |
| Project screenshots  | `projects[i].image`           | Import from `src/assets`, set `{ src, alt, width, height }`  |
| Project links        | `projects[i].links[].href`    | `null` shows a disabled "Soon" state                          |

## Structure

```
api/
  contact.js    Contact form function (Vercel) — also served locally by vite.config.js
public/
  Shuvayan_Sarkar_Resume.pdf
src/
  assets/       project screenshots
  components/   Navbar, Hero, About, Skills, Projects, ProjectCard, Journey, Contact, ContactForm,
                Footer, SectionHeading, Reveal (scroll reveal wrapper), brandIcons (GitHub/LinkedIn)
  data/         portfolioData.js — all content
  hooks/        useActiveSection, useContactAvailability, useCopyToClipboard
  utils/        motion.js (animation variants), links.js, contactValidation.js (shared with api/)
  index.css     design tokens, reset, buttons, tags, shared primitives
  App.css       component layouts and responsive rules
```

## Deploy (Vercel)

Import the repository in Vercel. It detects Vite automatically (build `npm run build`, output
`dist`) and deploys everything in `api/` as serverless functions. Add the environment variables
above, then after the first deploy add the live URL to `og:url` in `index.html` and to the
Portfolio project's links.
