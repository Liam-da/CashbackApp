# Cashback App MVP Tasklist

> Snapshot based on repo review on 2026-01-22.

## 1) Foundations & Repo Hygiene
- [x] Confirm MVP scope (<=10 pages) and define demo success criteria.
  - Notes: Record decisions in README and keep scope tight for demo readiness.
- [x] Update README with app-specific setup (frontend + Convex) and run instructions.
  - Notes: README now includes MVP scope, demo criteria, and local dev steps.
- [ ] Add `.env.example` with required variables (Convex + Clerk).
  - Notes: `.env.example` exists but only includes Convex vars; Clerk keys are missing.
- [ ] Add Prettier + formatting scripts or document formatting expectations.
  - Notes: README mentions formatting expectations, but there is no Prettier config/scripts yet.
- [ ] Adopt conventional commits (document format and examples).
- [ ] Confirm folder structure (src/pages, src/components, src/lib, convex/).
- [x] Scaffold app with Vite + React + TS + Router + ShadCN baseline.
- [x] Decide on styling approach and remove dead CSS files.
  - Notes: Dead CSS files removed; global styles live in `src/styles/globals.css`.
- [x] Fix text encoding for Danish strings (currently garbled in UI).
  - Notes: Normalized Danish strings with Unicode escapes to avoid mojibake across the UI.

## 2) App Shell & Routing
- [x] Render `Navigation` only once and align routes with actual pages.
  - Notes: `Navigation` is rendered once via `AppLayout`, and its links match existing routes.
  - Refs: `core-dependencies-documentation/remix-run-react-router-8a5edab282632443(1).txt` (BrowserRouter/Routes).
- [x] Add a 404/Not Found route and a consistent layout wrapper.
  - Notes: Keeps routing robust as new pages are added.
- [x] Add protected routes once auth is in place.
  - Notes: Use route guards after Clerk integration.
- [x] Build Home/Dashboard page (points balance, recent activity, scan CTA).
  - Notes: Added recent activity list (last 5 or empty state) and scan CTA routed to /scan.

## 3) Global State + Providers
- [x] Unify points state (single source of truth).
  - Notes: Points are sourced from Convex queries across Home, Wallet, Rewards, and PointsOverview.
- [x] Mount `ToastProvider` at app root and verify usage.
  - Notes: `ToastProvider` is mounted in `App` and `useToast` is safe to call.
- [x] Add basket/cart state and scanning state (context or store).
  - Notes: Needed for checkout flow and consistent UI updates.

## 4) Backend (Convex)
- Notes: Use the following schema:
    export default defineSchema({
      users: defineTable({
        name: v.string(),
        email: v.string(),
        birthdate: v.optional(v.string()),
        currentPoints: v.number(),
      }).index("by_email", ["email"]),
      
      items: defineTable({
        barcode: v.int64(),
        name: v.string(),
        price: v.number(),
        category: v.string(),
        creditvalue: v.number(),
        healthy: v.boolean(),
      }).index("by_barcode", ["barcode"]),
      
      cartItem: defineTable({
        userId: v.id("users"),
        itemId: v.id("items"),
        quantity: v.int64(),
      }).index("by_userId", ["userId"]),
      
      pointsLedger: defineTable({
        userId: v.id("users"),
        earned: v.number(),
        spent: v.number(),
        reason: v.string(),
        createdAt: v.number(),
      }).index("by_userId", ["userId"]),
      
      transactions: defineTable({
        userId: v.id("users"),
        itemId: v.id("items"),
        date: v.number(),
        totalAmount: v.number(),
      }).index("by_userId", ["userId"])
        .index("by_date", ["date"]),
      
      store: defineTable({
        name: v.string(),
        location: v.string(),
        openingHours: v.string(),
        contactInfo: v.string(),
        storeId: v.int64(),
      }).index("by_storeId", ["storeId"]),
      
      rewards: defineTable({
        rewardName: v.string(),
        pointsRequired: v.number(),
        description: v.string(),
      }),
    });
- [x] Add Convex client dependency and initialize a real schema.
  - Notes: `convex` dependency is installed and `convex/schema.ts` is present.
  - Refs: `convex/README.md`, `core-dependencies-documentation/get-convex-convex-backend-8a5edab282632443(1).txt` (functions, schemas, React usage).
- [x] Define core tables in `convex/schema.ts`:
  - Notes: users, items, cartItem, pointsLedger, transactions, store, rewards.
- [x] Implement queries/mutations:
  - Notes: product-by-barcode, points balance + ledger list, checkout award points, list rewards, redeem reward, create/read basket.
- [x] Add seed data script for products + rewards.
  - Notes: Keep seed script simple for demo; 20–50 products, ~10 rewards.

## 5) Auth (Clerk)
  - [x] Install Clerk and wrap app with `<ClerkProvider>`.
  - Notes: `/login` renders Clerk `SignIn`.
  - Refs: `core-dependencies-documentation/clerk-clerk-docs-8a5edab282632443(1).txt` (Clerk React components).
  - [x] Configure Clerk + Convex integration (JWT template + providers).
  - Notes: Create JWT template in Clerk, add `convex/auth.config.js`, and use `ConvexProviderWithClerk`.
  - Refs: `core-dependencies-documentation/clerk-clerk-docs-8a5edab282632443(1).txt` ("Integrate Convex with Clerk").
  - [x] Implement protected routes and user context usage.

## 6) Scanning & Product Flow
- [x] Decide barcode scanning approach (Capacitor plugin vs web scanner).
  - Notes: Decision: use `@capacitor/barcode-scanner` (Capacitor plugin). ScanningFlow calls the plugin; product lookup still uses local data.
  - Refs: `core-dependencies-documentation/ionic-team-capacitor-docs-8a5edab282632443(1).txt` (barcode-scanner API, CLI commands).
- [x] Implement barcode scan + manual entry fallback.
  - Notes: Uses `@capacitor/barcode-scanner` in scan flow; manual entry wired. Run `npm run build` then `npx cap sync` to wire native plugin.
  - [x] Add product lookup state (loading, not found, error) and route to Product Details.
  - [x] Create Product Details page.
  - Notes: Show health/cashback info, add-to-basket, zero-cashback UX.

## 7) Basket + Checkout
  - [x] Build Basket page (list items, totals, remove items).
  - [x] Add mocked payment step + checkout confirmation.
  - Notes: Mocked payment flow now awards points via Convex mutation.
  - [x] Add mocked QR flow screens + fake result (clearly marked as mock).
  - Notes: QR placeholder plus simulated success/decline paths in Checkout.
  - [x] Clear basket and show success toast/receipt.

## 8) Points & Wallet
- [x] Replace mocked points with Convex ledger/balance queries.
  - Notes: Home, Rewards, Wallet, and PointsOverview read balances from Convex; checkout awards points through the backend mutation.
- [x] Update Wallet and PointsOverview to render real history.
  - Notes: `Wallet` and `PointsOverview` render Convex balance + ledger, with empty state when no history exists.
- [x] Fix RewardDetails success math.
  - Notes: Success view now uses the remaining points from the redeem mutation.

## 9) Rewards (Gift Shop)
- [x] Replace local rewards data with Convex query.
- [x] Implement redeem flow backed by Convex mutation.
  - Notes: UI exists with mock flow; wire to backend and ledger updates.
- [x] Handle insufficient points with proper error UI and toast.

## 10) UI Consistency
- [x] Align UI components on shadcn patterns (Button, Card, Dialog, Toast).
  - Notes: `src/ui/*` already contains shadcn-style components.
  - Refs: `core-dependencies-documentation/shadcn-ui-ui-8a5edab282632443(2).txt` (installation + component docs).
- [x] Normalize typography and spacing across pages.
- [x] Add missing animations or remove unused ones.
  - Notes: Toast uses `animate-[slideIn...]` without a defined keyframe.

## 11) Mobile (Capacitor)
- [x] Initialize Capacitor and add Android platform.
  - Notes: Added `capacitor.config.ts` plus `android/` and `ios/` folders.
  - Refs: `core-dependencies-documentation/ionic-team-capacitor-docs-8a5edab282632443(1).txt` (getting-started/installation, CLI add/sync, Android guide).
- [x] Configure Android permissions (camera) for scanning.
- [x] Build and test a debug APK.
- [ ] Document Android build steps (SDK/Gradle versions, npx cap sync, run/install).
- [ ] Produce shareable APK artifact and add install/limitations notes.

## 12) QA & Demo Prep
  - [x] Create manual test checklist for all pages/flows.
  - [x] Add edge-case tests (not found product, insufficient points, permission denied).
- [ ] Plan bug bash session + issue triage rules.
  - [x] Prepare demo data + walkthrough script.
  - [x] Add demo contingency plan (manual entry fallback if scan fails).
- [ ] Run end-to-end Android happy path and fix critical bugs.

## 13) Contributor Docs
- [ ] Create `docs/onboarding.md` with setup steps (Clerk + Convex + Android).
- [ ] Add troubleshooting notes and “how to add a new page” mini guide.

## 14) Learning Spikes (Team Onboarding)
- [ ] React + Vite + TS walkthrough (60-90 min) with notes captured.
- [ ] ShadCN UI + Tailwind basics walkthrough (forms, toasts, layout).
- [ ] Convex data modeling + queries/mutations walkthrough.
- [ ] Clerk basics walkthrough (sign-in UI, protected routes, tokens).
- [ ] Capacitor basics walkthrough (plugins, permissions, Android build).

## 15) CI (Stretch)
- [ ] Add GitHub Actions workflow for lint + typecheck + web build.
- [ ] Add GitHub Actions workflow to build Android APK artifact.
