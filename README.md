# Vilgro Frontend

React + TypeScript single-page app for the Vilgro platform, built with Rsbuild. It covers public marketing pages, authentication, role-based dashboards (Admin, Banking, SPO), assessments, onboarding, loan requests, and PDF/report utilities.

## Version
- App version: `1.0.0` (see `package.json`)

## Tech stack
- React 19 + TypeScript
- Rsbuild for bundling/dev server
- Redux Toolkit + Redux Persist for state
- React Router 7 for routing
- Styling: Tailwind CSS v4, CSS modules
- UI: Radix UI, Headless UI, Lucide Icons, Framer Motion
- Forms & validation: React Hook Form + Zod
- Data: Axios; charts with Recharts; PDF generation with jsPDF

## Key library versions
- React `19.1.1`, React DOM `19.1.1`
- React Router DOM `7.9.1`
- Redux Toolkit `2.9.0` + React Redux `9.2.0` + Redux Persist `6.0.0`
- React Hook Form `7.63.0` + Zod `4.1.11`
- Axios `1.7.9`
- Recharts `3.3.0`
- Rsbuild `@rsbuild/core 1.5.6` + `@rsbuild/plugin-react 1.4.0`
- Tailwind CSS `4.1.13`
- TypeScript `5.9.2`

## Project layout
- `src/app`: store setup (`store.ts`, `rootReducer.ts`)
- `src/router`: route declarations and role routing helpers
- `src/services`: API layer (`api.ts`, `adminApi.ts`, `assessmentApi.ts`) and `endpoints.ts`
- `src/features`: Redux slices for admin/banking/spo/auth/assessment/etc.
- `src/components`: page-level and shared UI (auth, assessments, onboarding, loan, home/marketing sections)
- `src/roles`: role-specific screens for Admin, Banking, SPO
- `src/utils`: helpers such as PDF generation

## API configuration
`src/services/endpoints.ts` defines `BASE_URL` (currently `http://13.222.130.172/api`) and all endpoint paths. Update `BASE_URL` if you target a different backend. Environment variables are not wired yet, so changes must be made in that file.

## Prerequisites
- Node.js 18+ recommended
- Yarn 4 (project sets `packageManager: "yarn@4.10.2"`). Run `corepack enable` if Yarn 4 is not available.

## Setup
Install dependencies:
```bash
corepack enable
yarn install
```

## Run locally
Start the dev server (opens in browser):
```bash
yarn dev
```
App runs at [http://localhost:3000](http://localhost:3000).

## Build & preview
Create a production build:
```bash
yarn build
```

Preview the production build locally:
```bash
yarn preview
```

Build artifacts output to `dist/` by default.

## Notes
- Tailwind CSS v4 is enabled via `tailwind.config.js` and PostCSS config.
- PDF reports are generated under `src/utils/generatePDFReport.ts` and `src/utils/generateUserAssessmentPDF.ts`.
