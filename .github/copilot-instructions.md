# Copilot Instructions for Webdesign Project

## Architecture Overview
- **Next.js 15** app router with TypeScript
- **Internationalization**: next-intl with `nl`/`en` locales, default `nl`, always locale prefix (e.g., `/nl/contact`)
- **Backend**: Firebase (Auth, Firestore, Storage) for data and admin authentication
- **Styling**: Tailwind CSS v4 with custom dark theme (`#0A1A2F` bg, `#00E1F0` accent)
- **Email**: Nodemailer via SMTP for contact forms

## Key Patterns
- **Locale Handling**: Use `LocaleLink` component for internal links to auto-prefix locales
- **Translations**: `useTranslations("namespace")` hook; messages in `messages/{locale}.json`
- **Client Components**: Mark with `"use client"`; use `dynamic()` imports for heavy editors (e.g., TipTap)
- **Admin Protection**: Firebase auth in `(protected)` routes; redirect to `/admin/login` on unauth
- **API Routes**: Server actions for forms; validate env vars (SMTP, Firebase)

## Development Workflow
- **Build**: `npm run build` (fix lint errors: no `any` types, use `bg-white/4` not `bg-white/[0.04]`)
- **Env Setup**: `.env.local` with `NEXT_PUBLIC_FIREBASE_*`, `SMTP_*`, `CONTACT_*` vars
- **Firebase**: Deploy functions separately; config in `firebase.json`
- **Linting**: ESLint with Next.js config; run `npm run lint`

## Component Examples
- **Rich Text**: `LabEditor` (dynamic import) + `LabEditorClient` (TipTap)
- **Forms**: Client-side validation; POST to `/api/contact` or `/api/offers`
- **Animations**: Framer Motion for interactive elements
- **SEO**: `next-intl` for meta tags; sitemap in `sitemap.ts`

## Common Pitfalls
- Always use absolute paths with `@/` alias
- Locale routes: `/[locale]/page` structure; middleware handles prefixing
- Firestore: Import from `@/lib/firestore`; use async queries
- Avoid SSR for Firebase auth; handle in client components</content>
<parameter name="filePath">c:\Users\Stefan Plesa\Desktop\Haiduc Honden Services\webdesign\.github\copilot-instructions.md