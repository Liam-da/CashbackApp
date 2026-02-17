# QA Edge-Case Tests (MVP)

Target: product scan lookup, reward redemption, and auth/permission gating.

## 1) Product not found (barcode lookup)
Precondition: App is signed in and on `/scan` (product scan flow).

Steps:
1. Choose manual barcode input.
2. Enter `99999999` (or any barcode not in the product list).
3. Submit.

Expected:
- "Product not found" state is shown.
- "Try again" returns to ready state.
- "Back" returns to previous page.

## 2) Product lookup error (forced)
Precondition: App is signed in and on `/scan` (product scan flow).

Steps:
1. Choose manual barcode input.
2. Enter `00000000`.
3. Submit.

Expected:
- "Lookup failed" state is shown.
- Error message prompts retry.
- "Try again" returns to ready state.

## 3) Insufficient points when redeeming a reward
Precondition: Current points balance is lower than selected reward cost.

Steps:
1. Go to `/reward` and open a reward you cannot afford.
2. Click "Redeem reward".

Expected:
- Error toast shows required points (e.g., "You need X more points").
- Inline error message is visible.
- User remains on reward details page.

## 4) Permission denied / protected route
Precondition: Sign out.

Steps:
1. Navigate directly to `/wallet` (or `/reward`, `/basket`, `/checkout`).

Expected:
- Redirected to `/login`.
- Protected content does not render while signed out.
