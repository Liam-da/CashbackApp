import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <Card className="mx-auto w-full max-w-md border-dashed bg-muted/30 text-center">
      <div className="flex flex-col items-center gap-4 p-6 sm:p-8">
        <div className="text-4xl sm:text-5xl" role="img" aria-label="Empty state">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 sm:text-base max-w-sm">{description}</p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="w-full sm:w-auto">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
