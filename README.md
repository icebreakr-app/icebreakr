# Icebreakr

Next.js 14 SaaS app for generating personalized cold email icebreakers from a prospect URL.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- OpenAI (`gpt-4o-mini`)
- Stripe subscriptions

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all required environment variables.
3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Routes

- `/` Landing page
- `/app` Generator app with free limit + Pro upgrade
- `/success` Post-checkout success page
- `POST /api/generate` Generate 5 icebreakers
- `POST /api/checkout` Create Stripe subscription checkout session
- `POST /api/verify-pro` Check active subscription by email
