import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useBasket } from "../context/BasketContext";
import { useToast } from "../components/Toast";
import { findProductByBarcode, mapItemToProduct } from "../data/products";
import type { Product } from "../data/products";

type LocationState = {
  product?: Product;
};

export default function ProductDetails() {
  const { barcode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const convex = useConvex();
  const { addItem } = useBasket();
  const { showToast } = useToast();

  const state = location.state as LocationState | null;
  const [product, setProduct] = useState<Product | null>(state?.product ?? null);
  const [isLoading, setIsLoading] = useState(!state?.product && Boolean(barcode));

  useEffect(() => {
    let isCancelled = false;

    if (state?.product) {
      setProduct(state.product);
      setIsLoading(false);
      return;
    }

    if (!barcode) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      setIsLoading(true);
      let nextProduct: Product | null = null;

      try {
        const parsedBarcode = BigInt(barcode);
        const item = await convex.query(api.items.getItemByBarcode, {
          barcode: parsedBarcode,
        });
        if (item) {
          nextProduct = mapItemToProduct(item);
        }
      } catch (error) {
        nextProduct = findProductByBarcode(barcode);
      }

      if (!isCancelled) {
        setProduct(nextProduct);
        setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [barcode, convex, state?.product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page max-w-lg space-y-4">
          <LoadingSkeleton type="card" count={1} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <ErrorState
        title="Product not found"
        message="We could not find a product for this barcode."
        onRetry={() => navigate("/scan")}
      />
    );
  }

  const cashbackLabel = product.cashbackPercent > 0 ? `${product.cashbackPercent}% cashback` : "No cashback";
  const pointsLabel = product.points > 0 ? `Earn up to ${product.points} points` : "No points for this product";
  const showZeroCashback = product.cashbackPercent === 0 || product.points === 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      quantity: 1,
      points: product.points,
      price: product.price,
    });
    showToast("Added to basket", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page max-w-lg space-y-4">
        <Button variant="ghost" className="w-full justify-start px-0 sm:w-auto" onClick={() => navigate(-1)}>
          Back
        </Button>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <CardDescription>
              {product.brand} · {product.size}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between gap-4">
              <span>Category</span>
              <span className="text-right text-gray-900">{product.category}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Barcode</span>
              <span className="text-right text-gray-900 break-all">{product.barcode}</span>
            </div>
            {product.price !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span>Price</span>
                <span className="text-right text-gray-900">${product.price.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div
              className={`rounded-lg px-3 py-2 font-medium ${
                product.isHealthy ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
              }`}
            >
              {product.isHealthy ? "Healthy choice" : "Not in healthy selection"}
            </div>
            <p>
              {product.isHealthy
                ? "Scan your receipt with this product to earn points."
                : "This product does not contribute to health points yet."}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Cashback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Potential</span>
              <span className="text-gray-900 font-semibold">{cashbackLabel}</span>
            </div>
            <div>{pointsLabel}</div>
          </CardContent>
        </Card>

        {showZeroCashback && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            No cashback for this product yet. Scan eligible items to earn points.
          </div>
        )}

        <Button className="w-full h-12" onClick={handleAdd}>
          Add to basket
        </Button>
      </div>
    </div>
  );
}
