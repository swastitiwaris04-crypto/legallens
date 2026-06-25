# LegalLens — Project Report

> **Live:** https://legallens-sage.vercel.app/  
> **Repo:** https://github.com/swastitiwaris04-crypto/legallens

---

## 1. Overview

LegalLens is an AI-powered legal document analysis SaaS built for Indian users. It allows users to upload legal documents (rent agreements, property deeds, contracts, etc.) and receive an instant plain-language breakdown of every clause, obligation, and risk — without needing a lawyer.

### Problem Statement

- Legal documents are written in complex jargon that most people cannot understand
- Lawyers are expensive and inaccessible for everyday legal needs (rent agreements, NDAs, etc.)
- Existing tools are either too technical or do not support Indian languages and document types

### Solution

- AI-powered document analysis using Google Gemini 2.5 Flash
- Plain-language explanations in 6 Indian languages
- Free to use with optional account for history and reminders

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes (serverless) |
| Authentication | Supabase Auth | Email/password + Google OAuth |
| Database | Supabase PostgreSQL | Users, documents, analyses, reminders |
| Storage | Supabase Storage | Document file uploads (PDF, images) |
| AI | Google Gemini 2.5 Flash | Clause extraction, risk analysis, chat |
| Deployment | Vercel | Hosting (serverless functions) |
| Styling | Tailwind CSS + CSS variables + styled-jsx | UI with Primer.com-inspired design |
| Animations | Framer Motion | Scroll reveals, page transitions |
| PDF | pdf-parse, jimp, tesseract.js | PDF text extraction + OCR for scanned images |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User)                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Vercel (Next.js 14 App Router)              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  Pages   │  │  API     │  │  Middleware            │  │
│  │ (SSR/CSR)│  │ Routes   │  │  (Auth protection)    │  │
│  └──────────┘  └────┬─────┘  └───────────────────────┘  │
│                     │                                     │
└─────────────────────┼─────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼────┐ ┌──────▼──────┐
│   Supabase   │ │Google  │ │   EmailJS   │
│  (DB/Auth/   │ │Gemini  │ │  (reminder  │
│   Storage)   │ │   AI   │ │  emails)    │
└──────────────┘ └────────┘ └─────────────┘
```

### Key Design Decisions

- **Serverless-first:** All backend logic lives in Next.js API routes — no separate server
- **Supabase SSR:** Uses `@supabase/ssr` for cookie-based auth (works with server components and middleware)
- **Cookie-based auth:** Session stored in `sb-{ref}-auth-token` cookie, read by middleware and server components
- **Inline CSS with styled-jsx:** Avoids CSS-in-JS runtime cost while keeping component-scoped styles
- **No template UI libraries:** Every component hand-built for the Primer.com-inspired design language

---

## 4. Database Schema

### Tables

#### `profiles`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK, FK → auth.users) | User ID |
| email | text | User email |
| full_name | text | Display name |
| avatar_url | text | Profile picture |
| created_at | timestamptz | Signup timestamp |
| updated_at | timestamptz | Last update |

#### `documents`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK → profiles.id) | Owner |
| filename | text | Original file name |
| file_type | text | MIME type |
| file_path | text | Supabase Storage path (nullable) |
| content_text | text | Extracted text content |
| language | text | Analysis language code |
| created_at | timestamptz | Upload timestamp |
| updated_at | timestamptz | Last update |

#### `analyses`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| document_id | uuid (FK → documents.id) | Document reference |
| user_id | uuid (FK → profiles.id) | Owner |
| risk_score | text | Low / Medium / High |
| document_type | text | Detected type (Rent Agreement, etc.) |
| result_json | jsonb | Full AI output (clauses, obligations, amounts, summary) |
| created_at | timestamptz | Analysis timestamp |

#### `reminders`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK → profiles.id) | Owner |
| document_id | uuid (FK → documents.id) | Associated document |
| title | text | Reminder title |
| description | text | Details |
| due_date | date | When to remind |
| status | text | pending / sent / completed |
| created_at | timestamptz | Creation timestamp |

#### `share_links`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| document_id | uuid (FK → documents.id) | Shared document |
| user_id | uuid (FK → profiles.id) | Creator |
| token | text (unique) | Shareable token |
| expires_at | timestamptz | Expiration (optional) |
| created_at | timestamptz | Creation timestamp |

### Row-Level Security (RLS)

Every table has per-user RLS policies:
- `Users can CRUD own rows only`
- Storage buckets restrict file access to the owning user
- Share links are readable by anyone with the token (unauthenticated)

---

## 5. Feature Breakdown

### 5.1 Landing Page

Sections in order:
1. **Hero** — Dynamic card showing signup CTA (guest), upload CTA (no docs), or most recent document analysis (signed-in user)
2. **How It Works** — 3-step explainer with animations
3. **Features Grid** — 6 feature cards with icons
4. **Document Types** — Scrollable list of supported document types
5. **Why LegalLens** — 3 benefit cards (AI-powered, Plain Language, Free & Private)
6. **CTA Section** — Final call to action

### 5.2 Authentication

- Email/password signup and login
- Google OAuth (configured in Supabase, requires Google Cloud credentials)
- Protected routes via Next.js middleware
- Server-side session validation

### 5.3 Document Upload

- File drop zone (PDF, images)
- Text paste input
- Language selector (6 Indian languages)
- Real-time upload progress indicator
- Server extracts text using pdf-parse (PDFs) or Tesseract OCR (images)
- Text sent to Gemini for analysis

### 5.4 AI Analysis (`POST /api/analyze`)

1. Receives document text + language
2. Sends to Gemini 2.5 Flash with structured prompt
3. Parses JSON response containing:
   - `document_type` — detected document category
   - `risk_score` — Low / Medium / High
   - `summary` — 2-3 sentence plain language overview
   - `clauses[]` — individual clauses with title, original text, simple explanation, and red flag status
   - `obligations[]` — action items with party, description, and deadline
   - `key_amounts[]` — monetary values with label, amount, and description
   - `red_flags[]` — high-risk terms requiring attention
4. Saves complete `result_json` to `analyses` table
5. Returns analysis data to client

### 5.5 Document Chat (`POST /api/chat`)

- Takes document context + user question
- Sends to Gemini with conversation history
- Returns AI-generated answer
- Preserves context across messages

### 5.6 Results Page

- Risk score badge (color-coded)
- Red flag banner (highlights critical issues)
- Summary card (plain language overview)
- Clause list (expandable cards)
- Obligations checklist
- Key amounts table
- Chat window (ask follow-ups)
- Export to PDF

### 5.7 Dashboard

- Grid of user's documents with analysis metadata
- Empty state when no documents exist

### 5.8 Reminders

- Create reminders linked to documents
- List with status tracking (pending / sent / completed)
- CRUD operations via API

### 5.9 Share

- Generate shareable links with unique tokens
- Optional expiration
- Public access to analysis results

---

## 6. AI Integration (Gemini 2.5 Flash)

### Model: `gemini-2.5-flash`

The app originally used `gemini-1.5-flash` which was deprecated and removed from the API. Upgraded to `gemini-2.5-flash`.

### Prompt Engineering

The analyze endpoint sends a structured prompt requesting JSON output:

```
You are a legal document analyzer for Indian users. ...
Analyze the following document and return a JSON object with:
- document_type
- risk_score (Low/Medium/High)
- summary
- clauses[] (title, original_text, simple_explanation, is_red_flag)
- obligations[] (party, description, deadline)
- key_amounts[] (label, amount, description)
- red_flags[] (clause, explanation)
```

### Rate Limiting

In-memory rate limiter: 10 requests/hour per IP (resets on server restart).

---

## 7. Project Structure

```
legallens/
├── app/
│   ├── (auth)/                     # Auth pages
│   │   ├── callback/route.js       # OAuth callback handler
│   │   ├── login/page.jsx          # Login page
│   │   └── signup/page.jsx         # Signup page
│   ├── api/
│   │   ├── analyze/route.js        # AI analysis endpoint
│   │   ├── chat/route.js           # Document chat endpoint
│   │   ├── documents/
│   │   │   ├── route.js            # List/create documents
│   │   │   └── [id]/route.js       # Get/delete document
│   │   ├── reminders/
│   │   │   ├── route.js            # List/create reminders
│   │   │   └── [id]/route.js       # Update/delete reminder
│   │   ├── share/
│   │   │   ├── route.js            # Create share link
│   │   │   └── [token]/route.js    # Access shared analysis
│   │   └── user/profile/route.js   # User profile + stats
│   ├── compare/page.jsx            # Document comparison page
│   ├── dashboard/page.jsx          # User dashboard
│   ├── obligations/[id]/page.jsx   # Obligations view
│   ├── results/[id]/page.jsx       # Analysis results
│   ├── upload/page.jsx             # Document upload
│   ├── globals.css                 # Global styles + CSS variables
│   ├── layout.jsx                  # Root layout (Navbar + Footer)
│   └── page.jsx                    # Landing page
├── components/
│   ├── animations/
│   │   ├── PageTransition.jsx      # Page enter/exit animation
│   │   ├── RevealOnScroll.jsx      # Intersection Observer reveal
│   │   └── StaggerGrid.jsx         # Staggered children animation
│   ├── compare/
│   │   ├── DiffViewer.jsx          # Side-by-side diff
│   │   └── TwoColumnUpload.jsx     # Dual upload UI
│   ├── dashboard/
│   │   ├── DocumentCard.jsx        # Document thumbnail card
│   │   └── EmptyState.jsx          # No-documents placeholder
│   ├── home/
│   │   ├── CTASection.jsx          # Final call-to-action
│   │   ├── DocumentTypes.jsx       # Supported document types
│   │   ├── FeaturesGrid.jsx        # Feature cards
│   │   ├── HeroSection.jsx         # Hero with dynamic card
│   │   ├── HowItWorks.jsx          # 3-step explainer
│   │   └── WhyLegalLens.jsx        # Benefit cards
│   ├── layout/
│   │   ├── Footer.jsx              # Site footer
│   │   └── Navbar.jsx              # Navigation bar
│   ├── results/
│   │   ├── ChatMessage.jsx         # Single chat bubble
│   │   ├── ChatWindow.jsx          # Chat interface
│   │   ├── ClauseCard.jsx          # Expandable clause card
│   │   ├── ClauseList.jsx          # Clauses section
│   │   ├── DocumentHeader.jsx      # Document metadata
│   │   ├── ExportButton.jsx        # PDF export trigger
│   │   ├── KeyAmounts.jsx          # Monetary values table
│   │   ├── ObligationsList.jsx     # Obligations checklist
│   │   ├── RedFlagBanner.jsx       # High-risk alert
│   │   ├── RiskScoreBadge.jsx      # Risk level indicator
│   │   └── SummaryCard.jsx         # Plain language summary
│   ├── ui/
│   │   ├── Badge.jsx               # Tag/badge component
│   │   ├── Button.jsx              # Reusable button
│   │   ├── Card.jsx                # Generic card wrapper
│   │   ├── Divider.jsx             # Section divider
│   │   ├── Modal.jsx               # Modal dialog
│   │   ├── Skeleton.jsx            # Loading skeleton
│   │   ├── Spinner.jsx             # Loading spinner
│   │   ├── Toast.jsx               # Notification toast
│   │   └── index.js                # UI barrel export
│   └── upload/
│       ├── FileDropzone.jsx        # Drag-and-drop file input
│       ├── LanguageSelector.jsx    # Language dropdown
│       ├── TextPasteInput.jsx      # Text area input
│       └── UploadProgress.jsx      # SSE progress bar
├── hooks/
│   ├── useChat.js                  # Chat API hook
│   ├── useDocumentAnalysis.js      # Analysis polling hook
│   └── useToast.js                 # Toast notification hook
├── lib/
│   ├── supabase/
│   │   ├── admin.js                # Service-role client
│   │   ├── client.js               # Browser client helpers
│   │   ├── middleware.js            # Middleware Supabase client
│   │   └── server.js               # Server component client
│   ├── errors.js                   # Error classes + handler
│   ├── exportPDF.js                # PDF generation
│   ├── fileProcessor.js            # File type detection
│   ├── gemini.js                   # Gemini API wrapper
│   ├── ocr.js                      # Tesseract OCR integration
│   ├── pdfParser.js                # PDF text extraction
│   ├── rateLimiter.js              # IP-based rate limiting
│   └── utils.js                    # Shared utilities
├── middleware.js                    # Next.js middleware (auth)
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind configuration
├── jsconfig.json                   # Path alias (@/)
├── supabase-schema.sql             # Full database schema
├── .env.example                    # Environment template
└── package.json
```

---

## 8. Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--accent` | `#2D5016` | Forest green — primary actions, headings |
| `--accent-light` | `rgba(45, 80, 22, 0.08)` | Subtle green backgrounds |
| `--bg-primary` | `#FAF7F2` | Cream — page backgrounds |
| `--bg-secondary` | `#F5F0E8` | Slightly darker cream — sections |
| `--bg-card` | `#FFFFFF` | White — cards, inputs |
| `--text-primary` | `#1A1A1A` | Near-black — body text |
| `--text-secondary` | `#6B6B6B` | Gray — secondary text |
| `--text-muted` | `#999999` | Light gray — captions |
| `--border` | `#E8E2D8` | Light beige — borders |
| `--success` | `#2D5016` | Green — positive indicators |
| `--danger` | `#D32F2F` | Red — errors, high-risk flags |

### Typography
- **Headings:** Playfair Display (700, serif)
- **Body:** Inter (400/500/600, sans-serif)
- **Monospace:** system-ui (code)

### Key Components
- `btn-primary` — Solid green button
- `btn-secondary` — Outlined/ghost button
- `card` — Rounded white container with shadow
- `container-main` — Max-width 1200px centered wrapper

---

## 9. Error Handling

- Custom `AppError` class with status codes and error codes
- Unified `errorHandler` for API routes (consistent JSON error responses)
- Client-side error states in all forms
- Gemini API failure handled with fallback messages
- Rate limiting returns 429 with retry-after header

---

## 10. Security

- Row-Level Security on all database tables
- Supabase service-role key used only in admin server client (never exposed to browser)
- File uploads restricted by MIME type (PDF, images only)
- No sensitive data in client-side bundles
- HTTP-only cookies for auth sessions
- Rate limiting on analyze endpoint

---

## 11. Deployment

### Frontend + API: Vercel
- Auto-deploys from GitHub `main` branch
- Serverless functions for all API routes
- Edge middleware for auth checks

### Database + Auth + Storage: Supabase
- PostgreSQL database with RLS
- Built-in auth with email/password and Google OAuth
- File storage with per-user bucket policies

### Environment Variables (required on Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_SECRET_KEY=<secret-key>
GEMINI_API_KEY=<google-gemini-api-key>
```

### Known Issues & Limitations
- Google OAuth requires Google Cloud Console credentials (not yet configured)
- EmailJS reminder notifications are placeholders (no real email sending)
- Rate limiter is in-memory (resets on Vercel cold starts)
- No real file type validation on the server beyond MIME check
- Gemini model may return inconsistent JSON structure occasionally
- OCR accuracy depends on image quality

---

## 12. Development History

### Phase 1 — Project Scaffolding
- Created Next.js 14 project with App Router
- Set up project structure (pages, components, lib)
- Configured Tailwind CSS and CSS variables
- Created Supabase schema with 5 tables and RLS policies

### Phase 2 — Infrastructure Setup
- Created Supabase project with real credentials
- Enabled Google OAuth provider
- Configured storage bucket with security policies
- Set up environment variables

### Phase 3 — Bug Fixes & Stabilization
- Fixed Supabase SSR cookie methods (get/set/remove)
- Added missing `createClient()` export in admin client
- Created `jsconfig.json` for `@/` path alias
- Updated Gemini model from deprecated `1.5-flash` to `2.5-flash`
- Added error handling for Gemini API failures
- Removed invalid `language` column from client queries
- Removed dead code (old supabase.js, deprecated route)
- Cleaned up next.config.js

### Phase 4 — Testing & Verification
- Verified all 8 API endpoints return correct responses
- Created test user and ran full authentication flow
- Tested document analysis with real file
- Cleaned up test data

### Phase 5 — UI Enhancements
- Made hero card dynamic based on auth state and document presence
- Replaced Testimonials section with Why LegalLens benefit grid
- Fixed JSX syntax issues (RiskBadge component)

### Phase 6 — Deployment
- Created README, .gitignore, .env.example
- Pushed to GitHub
- Deployed to Vercel
- Fixed build errors (force-dynamic on profile route, Suspense boundary on login page)

---

## 13. Future Roadmap

- [ ] Configure Google OAuth with real Google Cloud credentials
- [ ] Wire up EmailJS for reminder notifications
- [ ] Replace SSE polling in UploadProgress with real `/api/analyze/stream` endpoint
- [ ] Add real file type validation and size limits
- [ ] Improve OCR accuracy with image preprocessing
- [ ] Add document comparison feature (side-by-side diff)
- [ ] Implement team/shared workspaces
- [ ] Add mobile app (React Native)
- [ ] Payment integration for premium features
- [ ] Audit log for document access

---

## 14. Conclusion

LegalLens successfully delivers on its core promise: making legal documents understandable for everyday Indians. The combination of Next.js 14, Supabase, and Google Gemini provides a scalable, cost-effective architecture that can grow with user demand. The app is deployed and functional, with a clear path forward for additional features and polish.
