# Zira Fashions — Web Demo

Next.js 14 e-commerce demo for **@zirafashions** (Lagos, Nigeria).

## Features
- WhatsApp-first checkout — no cart, every Order button opens WhatsApp with a pre-filled message
- OG image generation via `/api/og` — product images render as rich cards in WhatsApp
- Virtual try-on powered by **Gemini 3.1 Flash Image (Nano Banana 2)**
- Sanity CMS product catalog
- Next.js 14 App Router (RSC-first)
- Tailwind CSS with full design token system
- Cormorant Garamond + DM Sans editorial type pairing

## Stack
| Layer | Tech |
|-|-|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| CMS| Sanity.io |
| Try-On AI | Gemini API `gemini-3.1-flash-image-preview` |
| Images | Cloudinary |
| OG Images | @vercel/og |
| Hosting | Vercel |

## Setup
```bash
cp .env.example .env.local
# Fill in all values
npm install
npm run dev
```

## Key env vars
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Zira's WhatsApp Business number (digits only, no +)
- `GEMINI_API_KEY` — from [hlstudio.google.com/api-keys](https://aistudio.google.com/api-keys)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`  — from your Sanity project

## Project by
Olugbemi Tolulope ([@coderhema](https://github.com/coderhema)) for @zirafashions.