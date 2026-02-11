# EDUVENTS — Educational Events Platform

> A full-stack educational events discovery and listing platform built with **Next.js 16**, **MongoDB**, **Stripe**, and **AWS S3**. Deployed on **AWS Amplify**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Pages & Routes](#pages--routes)
- [API Routes](#api-routes)
- [Key Components](#key-components)
- [Services & Libraries](#services--libraries)
- [Authentication](#authentication)
- [Payment Flow](#payment-flow)
- [Email Notifications](#email-notifications)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Development](#development)

---

## Overview

EDUVENTS is a platform where educators can **discover** and **list** educational events — including CPD training, webinars, conferences, award shows, festivals, exhibitions, and podcasts across the UK.

### Core Features

| Feature | Description |
|---|---|
| **Event Discovery** | Browse, search, and filter approved events by category, format, subject area, educational phase, and date range |
| **Event Listing** | Organisers submit events via a multi-step form with image upload and Stripe payment (£99 listing fee) |
| **Admin Dashboard** | Review pending events, approve/reject submissions, edit event details, toggle featured status |
| **Featured Events** | Admin-curated carousel on the homepage showcasing highlighted events |
| **Email Notifications** | Automated emails for payment confirmation, admin alerts, and approval/rejection updates |
| **SEO** | Dynamic sitemap, robots.txt, and semantic HTML |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, React Compiler) |
| **Runtime** | React 19 |
| **Language** | TypeScript 5 |
| **Database** | MongoDB via Mongoose 9 |
| **Payments** | Stripe Checkout (GBP) |
| **File Storage** | AWS S3 |
| **Email** | Nodemailer (SMTP / Gmail) |
| **UI Components** | Radix UI primitives + shadcn/ui pattern |
| **Styling** | Tailwind CSS 4 + tailwindcss-animate |
| **Forms** | React Hook Form + Zod validation |
| **Date Handling** | date-fns 4, react-date-range |
| **Charts** | Recharts 3 |
| **Toast Notifications** | Sonner |
| **Deployment** | AWS Amplify |

---

## Project Structure

```
edivents-next/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── page.tsx            # Homepage (hero, featured carousel, latest events)
│   │   ├── layout.tsx          # Root layout with Providers wrapper
│   │   ├── globals.css         # Global styles & Tailwind config
│   │   ├── about/              # About Us page
│   │   ├── admin/              # Admin dashboard (protected)
│   │   ├── contact/            # Contact page
│   │   ├── event/[id]/         # Event detail page (dynamic)
│   │   ├── events/             # Events listing with filters & search
│   │   ├── list-event/         # Event submission form
│   │   ├── login/              # Admin login page
│   │   ├── privacy-policy/     # Privacy policy
│   │   ├── terms-and-conditions/
│   │   ├── terms-of-use/
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── sitemap.ts          # Dynamic sitemap generation
│   │   ├── robots.ts           # Robots.txt generation
│   │   └── api/
│   │       ├── events/         # GET (list/filter) + POST (create event)
│   │       │   └── [id]/       # GET/PUT/DELETE single event
│   │       ├── admin/
│   │       │   └── events/     # Admin event management
│   │       │       └── [id]/   # Admin single event operations
│   │       ├── auth/
│   │       │   └── login/      # POST admin login
│   │       └── checkout/       # POST create Stripe session
│   │           ├── verify/     # POST verify payment
│   │           └── cleanup/    # POST cleanup failed sessions
│   ├── components/
│   │   ├── Layout.tsx          # Page layout (Header + Footer wrapper)
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer with links
│   │   ├── Providers.tsx       # AuthProvider + Toaster + QueryClient
│   │   ├── EventCard.tsx       # Event card for grids
│   │   ├── FeaturedCarousel.tsx # Auto-playing featured events carousel
│   │   ├── ListEventContent.tsx # Multi-step event submission form
│   │   ├── SearchBar.tsx       # Search input component
│   │   ├── CategoryBadge.tsx   # Category label badge
│   │   ├── SubjectTagInput.tsx # Multi-select tag input for subjects
│   │   ├── PhaseTagInput.tsx   # Multi-select tag input for phases
│   │   ├── TimeInput.tsx       # Custom time picker input
│   │   ├── admin/
│   │   │   ├── EventRow.tsx        # Event row in admin table
│   │   │   ├── PendingEventCard.tsx # Pending event review card
│   │   │   └── EventEditDialog.tsx  # Event edit modal dialog
│   │   └── ui/                 # shadcn/ui primitives (14 components)
│   │       ├── button.tsx, input.tsx, dialog.tsx, select.tsx,
│   │       ├── tabs.tsx, switch.tsx, calendar.tsx, popover.tsx,
│   │       ├── label.tsx, textarea.tsx, separator.tsx,
│   │       ├── radio-group.tsx, alert-dialog.tsx, sonner.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Admin authentication context
│   ├── data/
│   │   └── events.ts           # TypeScript types, enums, seed data
│   ├── hooks/
│   │   └── (custom hooks)
│   ├── lib/
│   │   ├── mongodb.ts          # MongoDB connection with caching
│   │   ├── s3.ts               # AWS S3 upload/delete helpers
│   │   ├── email.ts            # Nodemailer email templates
│   │   └── utils.ts            # cn(), safeFormatDate(), safeConvertTo12Hour()
│   └── models/
│       └── Event.ts            # Mongoose Event schema
├── public/                     # Static assets (logo, favicons, SVGs)
├── amplify.yml                 # AWS Amplify build configuration
├── next.config.ts              # Next.js config (env vars, React Compiler)
├── tailwind.config.mjs         # Tailwind theme & custom design tokens
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Data Model

### Event Schema (`src/models/Event.ts`)

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | String | ✅ | Event name (max 100 chars) |
| `description` | String | ✅ | Short description (max 2000 chars) |
| `fullDescription` | String | — | Extended description (legacy) |
| `category` | String | ✅ | One of: Webinar, Podcast, Conference, CPD Training, Awards Show, Festival, Exhibition |
| `format` | String | ✅ | In-Person, Virtual, or Hybrid |
| `subjectAreas` | [String] | — | e.g. English, Maths, Science, STEM, Leadership, Technology, Inclusion, Assessment, Wellbeing, Humanities, Geography, SEND, Governance |
| `phases` | [String] | — | e.g. Primary, Secondary, Further Education, Higher Education, Special Schools, Nursery, Independent |
| `startDate` | String | ✅ | Format: `YYYY-MM-DD` |
| `endDate` | String | ✅ | Format: `YYYY-MM-DD` |
| `startTime` | String | ✅ | Format: `HH:MM` (24hr) |
| `endTime` | String | ✅ | Format: `HH:MM` (24hr) |
| `location` | String | ✅ | Venue or "Online via …" |
| `organiser` | String | ✅ | Organisation name (max 50 chars) |
| `organiserEmail` | String | ✅ | Contact email (validated) |
| `image` | String | ✅ | S3 URL of event image |
| `bookingUrl` | String | ✅ | External booking/registration link |
| `featured` | Boolean | — | Admin-toggled featured flag (default: false) |
| `status` | String | — | `pending` → `approved` / `rejected` |
| `submissionDate` | String | — | Auto-set to current date |
| `isFree` | Boolean | — | Whether the event is free (default: true) |
| `priceFrom` | Number | — | Price range start |
| `priceTo` | Number | — | Price range end |
| `isAdminCreated` | Boolean | — | True if created via admin dashboard |
| `paymentStatus` | String | — | `unpaid` / `paid` |
| `stripeSessionId` | String | — | Stripe Checkout session ID |

Timestamps (`createdAt`, `updatedAt`) are auto-managed by Mongoose.

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero section, search, featured carousel, latest events grid, CTA |
| `/events` | Events Listing | Full event browser with category/format/subject/phase/date filters, search, sort, pagination |
| `/event/[id]` | Event Detail | Full event info, date/time, location, pricing, sharing, booking link |
| `/list-event` | List Your Event | Multi-step form (details → image → pricing → preview → payment) |
| `/admin` | Admin Dashboard | Tabs: Pending Events, All Events. Approve/reject, edit, toggle featured |
| `/login` | Admin Login | Email + password authentication |
| `/about` | About Us | Company information |
| `/contact` | Contact Us | Contact page |
| `/privacy-policy` | Privacy Policy | Legal page |
| `/terms-and-conditions` | Terms & Conditions | Legal page |
| `/terms-of-use` | Terms of Use | Legal page |

---

## API Routes

### Events API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List events with filtering (search, category, format, subject, phase, date range, sort) |
| `POST` | `/api/events` | Submit new event (multipart form with image upload → S3) |
| `GET` | `/api/events/[id]` | Get single event by ID |
| `PUT` | `/api/events/[id]` | Update event |
| `DELETE` | `/api/events/[id]` | Delete event |

### Admin API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/events` | Get all events (including pending) |
| `PUT` | `/api/admin/events/[id]` | Update event status (approve/reject), toggle featured, edit details |

### Auth API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Validate admin credentials |

### Checkout API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/checkout` | Create Stripe Checkout session (£99.00 GBP) |
| `POST` | `/api/checkout/verify` | Verify payment status after redirect |
| `POST` | `/api/checkout/cleanup` | Clean up expired/failed checkout sessions |

---

## Key Components

### Public-Facing

| Component | File | Purpose |
|---|---|---|
| `Layout` | `Layout.tsx` | Wraps pages with `Header` + `Footer` |
| `Header` | `Header.tsx` | Responsive navigation with mobile menu |
| `Footer` | `Footer.tsx` | Footer links and copyright |
| `EventCard` | `EventCard.tsx` | Event card with image, category badge, date/time, price, and link |
| `FeaturedCarousel` | `FeaturedCarousel.tsx` | Auto-playing Embla carousel for featured events |
| `SearchBar` | `SearchBar.tsx` | Search input with magnifying glass icon |
| `ListEventContent` | `ListEventContent.tsx` | Multi-step event submission form (~1000 lines) |
| `SubjectTagInput` | `SubjectTagInput.tsx` | Multi-select chips for subject areas |
| `PhaseTagInput` | `PhaseTagInput.tsx` | Multi-select chips for educational phases |
| `TimeInput` | `TimeInput.tsx` | Custom time picker with AM/PM |

### Admin

| Component | File | Purpose |
|---|---|---|
| `EventRow` | `admin/EventRow.tsx` | Event row in the "All Events" table with status, actions |
| `PendingEventCard` | `admin/PendingEventCard.tsx` | Pending event card with approve/reject buttons |
| `EventEditDialog` | `admin/EventEditDialog.tsx` | Full event edit modal with all fields |

### Providers

| Component | File | Purpose |
|---|---|---|
| `Providers` | `Providers.tsx` | Wraps app with `AuthProvider`, `Toaster`, `QueryClientProvider` |
| `AuthProvider` | `context/AuthContext.tsx` | Manages admin authentication state |

---

## Services & Libraries

### `src/lib/mongodb.ts` — Database Connection
- Cached Mongoose connection to prevent connection leak during hot reloads
- Uses `MONGODB_URI` from environment

### `src/lib/s3.ts` — File Storage
- **`uploadToS3(filePath, folderName?)`** — Uploads local file to S3, returns URL, auto-deletes local file
- **`deleteFromS3(key)`** — Deletes file from S3 bucket
- Supports images, videos, documents, and audio files

### `src/lib/email.ts` — Email Notifications
- Uses Nodemailer with Gmail SMTP
- **`sendEventConfirmationEmail()`** — Confirms payment to organiser
- **`sendAdminNewEventNotification()`** — Alerts admin of new submission
- **`sendStatusUpdateEmail()`** — Notifies organiser of approval/rejection

### `src/lib/utils.ts` — Utility Functions
- **`cn()`** — Merges Tailwind classes (clsx + tailwind-merge)
- **`safeFormatDate()`** — Safely formats date strings with `date-fns`, handles invalid values
- **`safeConvertTo12Hour()`** — Converts 24hr time to 12hr format safely

---

## Authentication

Admin authentication uses a simple credential-based system:

1. Admin credentials are stored in the `ADMIN_CREDENTIALS` environment variable (JSON format)
2. Login is validated server-side via `POST /api/auth/login`
3. On success, `isAdminAuthenticated` flag is stored in `localStorage`
4. The `AuthContext` provider manages auth state client-side
5. Protected routes (e.g. `/admin`) redirect unauthenticated users to `/login`

> **Note:** This is not session/JWT-based. It relies on localStorage for persistence.

---

## Payment Flow

The event listing payment flow works as follows:

```
Organiser submits event form
        │
        ▼
POST /api/events (status: "pending", paymentStatus: "unpaid")
        │
        ▼
Event saved to MongoDB with image uploaded to S3
        │
        ▼
POST /api/checkout → Creates Stripe Checkout session (£99 GBP)
        │
        ▼
Redirect to Stripe Checkout page
        │
        ▼
On success → Redirect to /list-event?success=true&session_id=...
        │
        ▼
POST /api/checkout/verify → Marks paymentStatus as "paid"
        │
        ▼
Sends confirmation email to organiser
Sends notification email to admin
        │
        ▼
Admin reviews event in /admin dashboard
        │
        ▼
Approve → status: "approved" → Event goes live → Email sent
Reject  → status: "rejected" → Email sent
```

---

## Email Notifications

| Trigger | Recipient | Template |
|---|---|---|
| Payment confirmed | Organiser | Payment confirmation with event title |
| New event submitted | Admin | New event details with link to admin dashboard |
| Event approved | Organiser | Approval confirmation with link to live events |
| Event rejected | Organiser | Rejection notice |

All emails are sent from `SMTP_FROM` via Gmail SMTP using Nodemailer.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# AWS S3
ACCESS_KEY_ID=AKIA...
SECRET_ACCESS_KEY=...
REGION=eu-west-2
BUCKET=your-bucket-name

# Stripe
STRIPE_SECRET_KEY=sk_live_...

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="EDUVENTS <your-email@gmail.com>"
ADMIN_EMAIL=admin@yourdomain.com

# Admin Auth
ADMIN_CREDENTIALS={"email":"admin@example.com","password":"yourpassword"}
```

---

## Deployment

### AWS Amplify

The project is configured for AWS Amplify deployment via `amplify.yml`:

- **Pre-build:** Installs dependencies, writes environment variables to `.env.production`
- **Build:** Runs `npm run build` (Next.js production build)
- **Artifacts:** Deploys the `.next` directory
- **Caching:** Caches `node_modules` and `.next/cache`
- **Secrets:** All environment variables are stored as Amplify secrets

### CI/CD

- GitHub Actions workflow at `.github/workflows/pr-review.yml` for automated PR reviews

---

## Development

### Prerequisites
- Node.js (v20+)
- npm
- MongoDB instance (Atlas or local)
- AWS account with S3 bucket
- Stripe account
- Gmail account with App Password for SMTP

### Getting Started

```bash
# Install dependencies
npm install

# Create .env.local (see Environment Variables section)

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Key Design Decisions

- **App Router only** — No Pages Router; all routes use the Next.js App Router pattern
- **Client Components** — Most pages are `"use client"` since they involve state, effects, and interactivity
- **Defensive date handling** — All date/time formatting uses `safeFormatDate()` and `safeConvertTo12Hour()` to prevent runtime crashes from invalid data
- **S3 direct upload** — Event images are uploaded server-side to S3 via the API route (not client-side presigned URLs)
- **Single Event model** — All event states (pending, approved, rejected) use a single Mongoose model with status filtering
