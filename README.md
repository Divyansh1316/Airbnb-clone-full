# Airbnb Clone

A full-stack property discovery and booking app built with Next.js, React, TypeScript, Prisma, and MongoDB. Guests can browse and reserve stays, hosts can publish listings, and signed-in users can manage favorites, reviews, and wishlist collections.

For the architecture, data model, API flows, and implementation details, see the [Technical Overview](docs/TECHNICAL_OVERVIEW.md).

## Features

- Browse stays by category, location, dates, and guest/room/bathroom counts.
- Switch between a listing grid and a country-level map view.
- View listing details, availability, host information, amenities, and up to four similar stays.
- Create reservations and manage guest trips or host reservations.
- Save listings to favorites and named wishlist collections.
- Submit or update a review after a completed stay.
- Sign in with Google, GitHub, or email and password.
- Select light, dark, or device-based appearance.
- Create listings with Cloudinary-hosted images.
- Responsive layout and optimized property images.

## Tech Stack

| Area | Technology |
| --- | --- |
| Web framework | Next.js 16 App Router, plus a Pages API route for NextAuth |
| UI | React 19, TypeScript, Tailwind CSS 3 |
| Data | MongoDB with Prisma 5 |
| Authentication | NextAuth 4, Google/GitHub OAuth, credentials, bcrypt |
| Maps | Leaflet and React Leaflet, OpenStreetMap tiles |
| Images | Cloudinary upload widget and Next.js Image optimization |
| UI utilities | React Hook Form, Zustand, Axios, React Hot Toast, next-themes |

Node.js 24.x is the project runtime. The version is pinned in `package.json` and `.nvmrc`; `package-lock.json` records the exact dependency versions. Use Node 24 locally and select **24.x** in Vercel under **Project Settings → Build and Deployment → Node.js Version**. Redeploy after changing the Vercel setting.

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add the values for your **development** database and OAuth apps to `.env.local` (or your existing local `.env`). Required variables:

   ```text
   DATABASE_URL=
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_ID=
   GITHUB_SECRET=
   ```

   Keep `.env` and `.env.local` private and out of version control. Do not point local development at a production database. Next.js loads local environment files automatically; do not commit either file.

   Generate a local `NEXTAUTH_SECRET` with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. Sync Prisma with the development database when setting up a fresh database or after changing `prisma/schema.prisma`:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

   `db push` changes the database schema. Run it only with the intended development `DATABASE_URL`.

4. Start the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Local OAuth callbacks

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Add the local callback to the Google OAuth client. GitHub OAuth Apps allow one callback URL, so use a separate OAuth App for local development. Restart the dev server after changing environment variables. If a session reports a JWT decryption error after changing `NEXTAUTH_SECRET`, clear localhost cookies and sign in again.

### Production build

```bash
npm run build
npm run start
```

The build script generates the Prisma client before building Next.js. Set production environment variables and OAuth callback URLs in the hosting platform; do not use production values for a local preview.

For Vercel, configure Node.js **24.x** in the project settings and keep the production branch set to `master`. Pull requests receive preview deployments; merging a passing pull request into `master` triggers a production deployment.

### Useful commands

```bash
npm run lint       # ESLint
npx prisma generate
npx prisma db push # Apply Prisma schema to the configured MongoDB database
```

## Project Layout

```text
app/
  actions/       Server-side data access and session helpers
  api/           App Router API handlers
  components/    Shared UI, listing views, modals, and forms
  hooks/         Client state hooks
  libs/          Prisma client, property options, and rate limiting
  providers/     Theme and toast providers
  listings/      Listing detail route
  wishlists/     Wishlist collection routes
pages/api/
  auth/          NextAuth handler (Pages Router API endpoint)
prisma/
  schema.prisma  MongoDB data model
docs/
  TECHNICAL_OVERVIEW.md
```

## Technical Notes

- The Prisma schema includes users, OAuth accounts, listings, reservations, listing amenities, reviews, and wishlist collections.
- Reservation dates and price are checked on the server. The server calculates the total using the listing price and selected nights.
- Review submissions require a completed reservation. A unique user/listing pair allows one review per guest per listing, which can be updated.
- Wishlist handlers verify collection ownership before changes.
- The registration limiter is in-memory and per process. Deployments with multiple app instances should use a shared rate-limit store.
- The app uses `proxy.ts` to protect trips, reservations, properties, and favorites pages. API handlers also perform their own authentication and validation where required.
- The shared route loader is rendered by `app/loading.tsx`. Its two-ring expanding/fading animation is defined in `app/globals.css`, so it is present on initial page refresh as well as client-side navigation.

## Documentation

- [Technical Overview](docs/TECHNICAL_OVERVIEW.md): architecture, request flows, data model, endpoints, and implementation notes.

## Author

Divyansh Dhaundiyal · [GitHub](https://github.com/Divyansh1316)
