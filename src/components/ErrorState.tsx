import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Noget gik galt",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Card
      className="mx-auto w-full max-w-md border-red-200 bg-red-50/70 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-4 p-6 sm:p-8">
        <div className="text-4xl sm:text-5xl" role="img" aria-label="Error">
          ⚠️
        </div>
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{title}</h3>
        <p className="text-sm text-gray-600 sm:text-base max-w-sm">{message}</p>
        {onRetry && (
          <Button variant="destructive" onClick={onRetry} className="w-full sm:w-auto">
            Pr\u00f8v igen
          </Button>
        )}
      </div>
    </Card>
  );
}
