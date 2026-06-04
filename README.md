```
Project Information

Project Name: Proposal Tracker
Internal tool for capturing inbound project inquiries, generating branded PDF proposals, and managing won deals on a kanban board.

Team Members:
    Nicole Cespedes
    Jonathan Hubbard
    Troy Wenzel 
    Johnna Auman 
    Charlie Estrada
    
Tech Stack: Python + Flask, TypeScript + Next.js

Project Structure:
Proposal-Tracker/
├── .gitignore
├── README.md
├── backend/                        
│   ├── run.py                      Entry point — starts the Flask server
│   ├── requirements.txt            Python dependencies
│   ├── .env.example                Environment variable template (copy to .env)
│   └── app/
│       ├── __init__.py             App factory — creates and configures Flask app
│       ├── config.py               Loads environment-based settings (dev/prod)
│       ├── models.py               Database models (SQLAlchemy)
│       ├── blueprints/             Route handlers, one file per domain
│       │   ├── auth.py             Login, logout, token handling
│       │   ├── intake.py           Public form submission endpoint
│       │   └── submissions.py      Submission list, detail view, notes
│       ├── migrations/             Auto-generated DB migration scripts (Alembic)
│       └── services/               Business logic (PDF generation, email, etc.)
│
└── frontend/                       
    ├── next.config.js              Next.js configuration
    ├── tsconfig.json               TypeScript configuration
    ├── package.json                JS dependencies
    ├── .env.example                Environment variable template (copy to .env.local)
    ├── public/                     Static assets — logo, favicon, brand files
    └── src/
        ├── middleware.ts           Intercepts requests — enforces auth on protected routes
        ├── app/                    All pages live here (Next.js App Router)
        │   ├── layout.tsx          **Main Frame** ROOT LAYOUT — wraps every page (global styles, fonts)
        │   ├── page.tsx            Public intake form (home page, no login required)
        │   ├── login/
        │   │   └── page.tsx        Login page
        │   └── dashboard/          Everything here requires authentication
        │       ├── layout.tsx      DASHBOARD LAYOUT — adds sidebar/nav to all dashboard pages
        │       ├── page.tsx        Main dashboard — submission list view
        │       ├── proposals/
        │       │   └── page.tsx    Proposals list and management
        │       └── submissions/
        │           └── [id]/
        │               └── page.tsx  Submission detail page + notes ([id] = dynamic route)
        ├── components/             Reusable UI components (buttons, cards, modals, etc.)
        ├── lib/
        │   └── api.ts              Typed functions for calling the Flask backend
        └── types/
            └── index.ts            Shared TypeScript types (Submission, Proposal, User, etc.)
```
