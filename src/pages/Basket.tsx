import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EmptyState } from "../components/EmptyState";
import { useBasket } from "../context/BasketContext";

export default function Basket() {
  const { items, removeItem, updateQuantity } = useBasket();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPoints = items.reduce((sum, item) => sum + (item.points ?? 0) * item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="page max-w-2xl space-y-4">
        <h1 className="page-title">Basket</h1>
        <EmptyState
          icon="🧺"
          title="Your basket is empty"
          description="Scan a product to add it to your basket."
          actionLabel="Scan product"
          onAction={() => {
            window.location.href = "/scan";
          }}
        />
      </div>
    );
  }

  return (
    <div className="page max-w-2xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">Basket</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>{totalItems} item(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Total points</span>
            <span className="text-gray-900 font-semibold">{totalPoints}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimated total</span>
            <span className="text-gray-900 font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map((item) => {
          const linePoints = (item.points ?? 0) * item.quantity;
          const linePrice = (item.price ?? 0) * item.quantity;

          return (
            <Card key={item.id} className="shadow-sm">
              <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>Qty {item.quantity}</CardDescription>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Points</span>
                  <span className="text-gray-900">{linePoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="text-gray-900">${linePrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button className="w-full h-12" onClick={() => navigate("/checkout")}>
        Proceed to checkout
      </Button>
    </div>
  );
}
