# QA Manual Test Checklist (MVP)

Scope: current routes in `src/App.tsx` and primary user flows (scan, basket, checkout, rewards).

## Preflight
- [ ] App runs locally (`npm install`, `npm run dev`) and loads in browser.
- [ ] Test user signed in (Clerk) or use mocked auth as needed.

## Global / App Shell
- [ ] Protected routes redirect to `/login` when signed out.
- [ ] Bottom navigation renders and links to Home, Scan, Wallet, Basket, Login/Account.
- [ ] Toasts show for success/error events (add to basket, wallet load, reward redemption).

## Login
- [ ] Signed-out state shows Clerk sign-in.
- [ ] Successful sign-in routes to `/`.
- [ ] Sign out sends user back to `/login`.

## Home / Dashboard
- [ ] Points balance loads (with loading state first).
- [ ] "Scan" CTA navigates to `/scan`.
- [ ] "Point-historik" card navigates to `/points-overview`.
- [ ] "Brug dine point" card navigates to `/reward`.
- [ ] Recent activity list shows latest items or empty state.

## Points Overview
- [ ] Current balance, total earned, and total spent render.
- [ ] Transaction list shows entries or empty-state card.
- [ ] Back button returns to previous page.

## Scan (Product)
- [ ] Scan page opens with ready state.
- [ ] "Start scanning" opens scanner or shows error on cancel.
- [ ] Manual barcode entry works and triggers lookup.
- [ ] Valid barcode navigates to `/product/:barcode`.
- [ ] Invalid barcode shows "not found" or error message.
- [ ] Cancel returns to previous page.

## Product Details
- [ ] Product info renders (name, brand, size, price, category).
- [ ] Cashback/points section displays expected labels.
- [ ] "Add to basket" adds item and shows toast.
- [ ] Not found state shows error and "Scan" retry.

## Basket
- [ ] Empty state shows "Scan product" CTA.
- [ ] Added items list with quantity controls and remove.
- [ ] Summary totals update with quantity changes.
- [ ] "Proceed to checkout" navigates to `/checkout`.

## Checkout
- [ ] Empty state routes back to basket.
- [ ] Review step lists items and total.
- [ ] Payment method selection toggles between card and mobilepay.
- [ ] "Continue to QR payment" shows mock QR page.
- [ ] Simulate scan success -> processing -> result -> success.
- [ ] Simulate scan failure -> result -> retry or change payment.
- [ ] Success page shows receipt items and totals.
- [ ] "View wallet" opens wallet and shows added points (if any).

## Wallet
- [ ] Balance loads with loading state first.
- [ ] Transaction list shows entries or empty-state CTA.
- [ ] Wallet toast appears after data load.

## Rewards
- [ ] Reward list renders loading and empty states.
- [ ] Rewards show affordability status and disabled button when insufficient points.
- [ ] "View details" opens reward details.
- [ ] Redeem success shows confirmation and redirects to list.
- [ ] Insufficient points shows error toast/message.

## My Rewards
- [ ] Empty state CTA routes to Gift Shop.
- [ ] Reward cards show code when "Use reward" is clicked.
- [ ] "Mark as used" updates status to Used.

## Not Found
- [ ] Unknown route shows 404 page with "Back to home" link.
