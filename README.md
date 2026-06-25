# LegalLens

AI-powered legal document analysis for Indian users. Upload rent agreements, property papers, or contracts — our AI explains every clause in plain language.

Built with Next.js 14, Supabase, and Google Gemini 2.5 Flash.

## Features

- **AI Analysis** — Google Gemini reads your document and identifies clauses, obligations, risks, and monetary amounts
- **Plain Language** — Complex legal jargon explained in simple Hindi, Marathi, Tamil, Telugu, Bengali, or English
- **Secure Storage** — Documents stored in Supabase Storage with per-user RLS policies
- **Interactive Chat** — Ask follow-up questions about any analyzed document
- **Dashboard** — View all your documents and their analysis in one place
- **Reminders** — Set reminders for rent payments, renewal dates, and more

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **AI:** Google Gemini 2.5 Flash API
- **Styling:** Tailwind CSS + CSS variables + `styled-jsx`

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier)
- A Google Gemini API key

### Setup

1. Clone the repo:

```bash
git clone https://github.com/your-username/legallens.git
cd legallens
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

4. Set up your Supabase project:

   - Run `supabase-schema.sql` in your Supabase SQL Editor to create tables, RLS policies, and storage

5. Start the dev server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SECRET_KEY` | Supabase secret (service_role) key |
| `GEMINI_API_KEY` | Google Gemini API key |

## Project Structure

```
legallens/
├── app/                  # Next.js 14 App Router pages & API routes
│   ├── api/              # Backend API endpoints
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── results/          # Analysis results pages
│   └── upload/           # Document upload page
├── components/           # React components
│   ├── animations/       # Framer Motion animations
│   ├── home/             # Landing page sections
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client helpers
├── hooks/                # Custom React hooks
├── supabase-schema.sql   # Database schema & RLS policies
├── middleware.js          # Next.js middleware for auth
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## License

MIT
