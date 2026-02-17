# Demo Data and Walkthrough (MVP)

This doc defines demo data and a walkthrough script that covers every current app use case referenced in tickets.csv.

## Data sources
- Product lookup: `src/data/products.ts`
- Rewards catalog: `convex/seed.ts`
- Points ledger: created via checkout and reward redemption

## Demo user
- Clerk test user: demo.cashback@example.com (any Clerk test account works)
- Start with 0 points; points are earned via checkout

## Product barcodes (scan + product details)
Use manual input on the Scan screen.

| Barcode | Product | Points | Cashback | Notes |
| --- | --- | --- | --- | --- |
| 5700000000009 | Mixed Salad | 9 | 5% | Healthy, earns points |
| 5700000000005 | Greek Yogurt | 6 | 5% | Healthy, earns points |
| 5700000000015 | Chocolate Bar | 1 | 0% | Zero cashback use case |

## Edge-case barcodes
- 99999999: product not found
- 00000000: lookup error (forced)

## Rewards catalog (seeded)
Seeded rewards are in `convex/seed.ts`. Use these for demo:

| Reward | Points Required | Use Case |
| --- | --- | --- |
| Free Coffee | 50 | Affordable after one checkout |
| Healthy Snack Voucher | 120 | Insufficient points case |
| 10% Grocery Discount | 200 | Insufficient points case |
| Cooking Class Entry | 500 | High-cost reward |

## Basket setup for points
Use these quantities to generate points for the demo:

- Affordable reward demo (50+ points): 5x Mixed Salad (45) + 1x Greek Yogurt (6) = 51 points
- Insufficient points demo: 1x Mixed Salad (9) + 1x Greek Yogurt (6) = 15 points

## Walkthrough script (happy path)
1) Login
- Sign in with demo.cashback@example.com.
- Confirm protected routes now load (Home, Wallet, Rewards).

2) Home / Dashboard
- Show points balance (starts at 0).
- Tap Scan CTA to go to /scan.

3) Scan product (manual entry)
- Enter barcode 5700000000009.
- Confirm Product Details page opens with points and cashback.

4) Product details
- Tap "Add to basket".
- Use Back to return to Scan.
- Enter barcode 5700000000015 to show zero cashback product.
- Add to basket again (shows zero cashback messaging).

5) Basket
- Open Basket.
- Adjust quantities to reach 52 points total.
- Verify totals update.
- Proceed to Checkout.

6) Checkout (mocked QR flow)
- Pick payment method (card or mobilepay).
- Continue to QR payment.
- Simulate scan success, then finish checkout.
- Confirm success screen shows receipt items and totals.

7) Wallet and Points Overview
- Open Wallet from success screen.
- Verify points balance increased and a ledger entry exists.
- Open Points Overview to show history and totals.

8) Rewards (Gift Shop)
- Open Gift Shop (/reward).
- Show Free Coffee (50 points) is available; others are locked.
- Open Free Coffee and redeem.
- Confirm success screen and redirect back to list.

9) My Rewards
- Open My Rewards.
- Expand the redeemed reward to show the code.
- Mark it as used.

## Demo contingency plan (scan failure fallback)
If camera scan fails or permissions are denied, switch to manual entry:

1) On the Scan screen, choose manual barcode input.
2) Enter a known good barcode from the demo list (e.g., 5700000000012 or 5700000000029).
3) If a barcode fails, retry with the other known good barcode.
4) Continue the walkthrough from Product Details.

## Optional edge-case mini-demos
- Product not found: Scan -> manual entry 99999999 -> "Product not found" screen.
- Lookup error: Scan -> manual entry 00000000 -> "Lookup failed" screen.
- Insufficient points: open a 120+ reward and try redeeming.
- Permission denied: sign out, then navigate to /wallet to see redirect to /login.
