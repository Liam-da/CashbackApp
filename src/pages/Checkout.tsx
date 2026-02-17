import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";
import { useBasket } from "../context/BasketContext";
import type { BasketItem } from "../context/BasketContext";

type PaymentMethod = "card" | "mobilepay";
type CheckoutStep = "review" | "qr" | "processing" | "result" | "success";
type MockPaymentResult = "approved" | "declined";
type Receipt = {
  items: BasketItem[];
  totals: { totalItems: number; totalPoints: number; totalPrice: number };
  paymentMethod: PaymentMethod;
};

export default function Checkout() {
  const { items, clearBasket } = useBasket();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const awardPoints = useMutation(api.points.awardCurrentUserPoints);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [step, setStep] = useState<CheckoutStep>("review");
  const [mockResult, setMockResult] = useState<MockPaymentResult | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPoints = items.reduce((sum, item) => sum + (item.points ?? 0) * item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
    return { totalItems, totalPoints, totalPrice };
  }, [items]);

  const finalizeCheckout = async () => {
    const receiptSnapshot: Receipt = {
      items: items.map((item) => ({ ...item })),
      totals,
      paymentMethod,
    };
    setReceipt(receiptSnapshot);
    clearBasket();
    try {
      if (totals.totalPoints > 0) {
        await awardPoints({ points: totals.totalPoints, reason: "Checkout" });
      }
      showToast("Payment confirmed! Points added to your wallet.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment confirmed, but points could not be added.";
      showToast(message, "error");
    }
    setStep("success");
  };

  const handleQrStart = () => {
    setMockResult(null);
    setStep("qr");
  };

  const handleMockResult = (result: MockPaymentResult) => {
    setMockResult(result);
    setStep("processing");
    window.setTimeout(() => {
      setStep("result");
    }, 1200);
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="page max-w-2xl space-y-4">
        <h1 className="page-title">Checkout</h1>
        <EmptyState
          icon="!"
          title="Your basket is empty"
          description="Add items before checking out."
          actionLabel="Go to basket"
          onAction={() => navigate("/basket")}
        />
      </div>
    );
  }

  if (step === "success") {
    const confirmation = receipt ?? {
      items: [],
      totals,
      paymentMethod,
    };
    return (
      <div className="page max-w-2xl space-y-4">
        <h1 className="page-title">Checkout confirmation</h1>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Payment confirmed</CardTitle>
            <CardDescription>Thanks for your purchase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span className="text-gray-900 font-semibold">{confirmation.totals.totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Paid</span>
              <span className="text-gray-900 font-semibold">${confirmation.totals.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Points earned</span>
              <span className="text-gray-900 font-semibold">{confirmation.totals.totalPoints}</span>
            </div>
            <div className="text-xs text-gray-500">Payment method: {confirmation.paymentMethod}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
            <CardDescription>Items purchased</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            {confirmation.items.length === 0 ? (
              <div>No receipt items available.</div>
            ) : (
              confirmation.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-900">${((item.price ?? 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="w-full sm:flex-1" onClick={() => navigate("/wallet")}
          >
            View wallet
          </Button>
          <Button variant="ghost" className="w-full sm:flex-1" onClick={() => navigate("/basket")}
          >
            Back to basket
          </Button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="page max-w-2xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="page-title">Processing payment</h1>
          <Badge variant="secondary">Mock</Badge>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Authorizing your payment</CardTitle>
            <CardDescription>This is a mocked payment step.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-sm text-gray-600">
            <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <div className="text-center">
              <p>Contacting the register for QR approval...</p>
              <p className="text-xs text-gray-500">Total: ${totals.totalPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "result") {
    const resolvedResult: MockPaymentResult = mockResult ?? "approved";
    const isApproved = resolvedResult === "approved";

    return (
      <div className="page max-w-2xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="page-title">{isApproved ? "Payment approved" : "Payment declined"}</h1>
          <Badge variant={isApproved ? "secondary" : "destructive"}>Mock result</Badge>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{isApproved ? "QR scan completed" : "QR scan failed"}</CardTitle>
            <CardDescription>
              {isApproved
                ? "This is a simulated approval. You can finish checkout."
                : "This is a simulated decline. Try again or change payment."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Total due</span>
              <span className="text-gray-900 font-semibold">${totals.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment method</span>
              <span className="text-gray-900 font-semibold">{paymentMethod}</span>
            </div>
            <div className="text-xs text-gray-500">Result is mocked for the MVP demo.</div>
          </CardContent>
        </Card>
        {isApproved ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full h-12 sm:flex-1" onClick={finalizeCheckout}>
              Finish checkout
            </Button>
            <Button variant="ghost" className="w-full h-12 sm:flex-1" onClick={handleQrStart}>
              Show QR again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full h-12 sm:flex-1" onClick={handleQrStart}>
              Try again
            </Button>
            <Button variant="ghost" className="w-full h-12 sm:flex-1" onClick={() => setStep("review")}>
              Change payment
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="page max-w-2xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="page-title">QR payment</h1>
          <Badge variant="secondary">Mock</Badge>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Show this QR at checkout</CardTitle>
            <CardDescription>Cashier scans it to charge your selected payment method.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border bg-gray-50 text-xs font-semibold text-gray-500 sm:h-52 sm:w-52">
              QR CODE (MOCK)
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-gray-900 font-semibold">${totals.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment method</span>
              <span className="text-gray-900 font-semibold">{paymentMethod}</span>
            </div>
            <div className="text-xs text-gray-500">QR flow is mocked for the MVP demo.</div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="w-full h-12 sm:flex-1" onClick={() => handleMockResult("approved")}>
            Simulate scan success
          </Button>
          <Button variant="outline" className="w-full h-12 sm:flex-1" onClick={() => handleMockResult("declined")}>
            Simulate scan failure
          </Button>
        </div>
        <Button variant="ghost" className="w-full h-12" onClick={() => setStep("review")}>
          Back to payment
        </Button>
      </div>
    );
  }

  return (
    <div className="page max-w-2xl space-y-4">
      <h1 className="page-title">Checkout</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
          <CardDescription>{totals.totalItems} item(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="text-gray-900">${((item.price ?? 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t">
            <span>Total</span>
            <span className="text-gray-900 font-semibold">${totals.totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Payment</CardTitle>
            <Badge variant="secondary">Mock</Badge>
          </div>
          <CardDescription>Select a mocked payment method before generating the QR code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Card ending in 4242
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="mobilepay"
              checked={paymentMethod === "mobilepay"}
              onChange={() => setPaymentMethod("mobilepay")}
            />
            MobilePay
          </label>
        </CardContent>
      </Card>

      <Button className="w-full h-12" onClick={handleQrStart}>
        Continue to QR payment
      </Button>
    </div>
  );
}
