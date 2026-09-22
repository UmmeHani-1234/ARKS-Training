# ARKS Leads Dashboard

## Overview
Small Next.js application built as a Phase 1 deliverable for ARKS Training.  
Demonstrates understanding of Next.js App Router, API routes, TypeScript, and the Git/GitHub PR workflow.

## Features
- 📊 **Dashboard home** — summary stats (Total / New / Contacted / Converted) + recent leads preview
- 📋 **All Leads page** — searchable, filterable table of all leads
- 🔌 **API endpoint** — `GET /api/leads` returns JSON lead data
- 🔄 **Frontend → API data flow** — pages fetch from the API, not hardcoded arrays
- 🌐 **Next.js App Router routing** — `app/page.tsx` vs `app/leads/page.tsx`
- 🛠️ **TypeScript throughout** — shared `Lead` type across API and UI

## Tech Stack
| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Runtime    | Node.js 22              |

## Project Structure
```
leads-dashboard/
├── app/
│   ├── layout.tsx          # Root layout (nav, footer)
│   ├── page.tsx            # Dashboard home  →  /
│   ├── globals.css
│   ├── leads/
│   │   └── page.tsx        # All Leads page  →  /leads
│   └── api/
│       └── leads/
│           └── route.ts    # API endpoint    →  GET /api/leads
├── components/
│   ├── StatCard.tsx        # Reusable stat card
│   └── LeadsTable.tsx      # Searchable leads table (client component)
└── lib/
    └── leads.ts            # Lead type + mock dataset
```

## API

### `GET /api/leads`

Returns the full list of leads as JSON.

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "name": "Aisha Rahman",
    "email": "aisha@gmail.com",
    "status": "New",
    "company": "TechVentures",
    "date": "2024-09-01"
  }
]
```

**Status codes used:**
| Code | Meaning         |
|------|-----------------|
| 200  | Success         |
| 500  | Server error    |

> **Phase 2** will add `POST`, `PUT`, and `DELETE` endpoints backed by a real database.

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

| URL                              | What you see          |
|----------------------------------|-----------------------|
| `http://localhost:3000`          | Dashboard + stats     |
| `http://localhost:3000/leads`    | All leads table       |
| `http://localhost:3000/api/leads`| Raw JSON API response |

## Testing the API with Postman

1. Start the dev server: `npm run dev`
2. Open Postman
3. **Method:** `GET`
4. **URL:** `http://localhost:3000/api/leads`
5. Hit **Send** — you should receive a `200 OK` with the JSON array above.

## Git Workflow Used

```
main
  └── feature/leads-dashboard
        ├── feat: scaffold next.js project
        ├── feat: add mock leads API endpoint
        ├── feat: build dashboard home page
        ├── feat: add leads route with search
        └── docs: add README
               ↓ Pull Request
               ↓ Code review
               ↓ Merge → main
```

## Author
Built by [Umme Hani](https://github.com/UmmeHani-1234) as part of ARKS Phase 1 Training.
