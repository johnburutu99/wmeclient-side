<p align="center">
  <img src="/public/wme-logo.svg" alt="WME Logo" width="180" />
</p>

# WME Client Portal (Frontend)

Welcome to the William Morris Endeavor (WME) Client Portal. This modern, enterprise-grade portal is built with Next.js 14, Tailwind CSS, and TypeScript, and is designed for a seamless, branded client experience.

## Getting Started (Codespaces)

1. **Open in GitHub Codespaces** (recommended):
   - Click the green "Code" button in GitHub, then "Open with Codespaces".
   - Codespaces will auto-install all dependencies and set up the dev environment.
2. **Manual Setup:**
   - `cd frontend && npm install`
   - `npm run dev`
   - Visit [http://localhost:3000](http://localhost:3000)

## Features
- WME-branded login, dashboard, bookings, documents, messaging, payments, privacy, and settings
- Modern, responsive UI with gold/black/white palette
- Secure authentication, protected routes, and API integration

## Development
- Edit pages in `app/` and components in `components/`
- Styles are managed with Tailwind CSS and custom classes for WME branding
- Fonts: Geist (customizable in `layout.tsx`)

## Deployment
- See `/infra/README.md` for CI/CD and deployment details
- Codespaces/devcontainer support for instant onboarding

## Brand & Design
- All assets, colors, and typography follow WME brand guidelines
- For design updates, see `/public/` and Tailwind config

---
© {new Date().getFullYear()} William Morris Endeavor. All rights reserved.
