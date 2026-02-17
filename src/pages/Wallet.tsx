import { useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { Card } from '../ui/card';

export default function Wallet() {
  const { showToast } = useToast();
  const pointsBalance = useQuery(api.points.getCurrentUserPointsBalance);
  const ledger = useQuery(api.points.listCurrentUserPointsLedger);
  const isLoading = pointsBalance === undefined || ledger === undefined;
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current && !isLoading) {
      showToast('Wallet data hentet!', 'success');
      hasShownToast.current = true;
    }
  }, [isLoading, showToast]);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const transactions = (ledger ?? []).map((entry) => ({
    id: entry._id,
    amount: entry.earned - entry.spent,
    reason: entry.reason,
    timestamp: formatDate(entry.createdAt),
  }));

  const currentPoints = pointsBalance?.currentPoints ?? 0;

  if (isLoading) {
    return (
      <div className="page max-w-2xl space-y-6">
        <h1 className="page-title">Wallet</h1>
        <div className="mb-6 space-y-2">
          <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 w-1/2 animate-pulse rounded bg-gray-200"></div>
        </div>
        <h2 className="section-title">Transaction history</h2>
        <LoadingSkeleton type="list" count={4} />
      </div>
    );
  }

  return (
    <div className="page max-w-2xl space-y-6">
      <h1 className="page-title">Wallet</h1>

      <Card className="shadow-sm">
        <div className="space-y-2 p-5">
          <h2 className="section-title">Points balance</h2>
          <p className="text-3xl font-bold text-green-600">{currentPoints} points</p>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="section-title">Transaction history</h2>

        {transactions.length === 0 ? (
          <EmptyState
            icon="$"
            title="Ingen transaktioner endnu"
            description="Start med at scanne kvitteringer for at optjene point!"
            actionLabel="Scan kvittering"
            onAction={() => window.location.href = '/'}
          />
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li key={tx.id}>
                <Card className="shadow-sm">
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount} points
                      </p>
                      <p className="text-sm text-gray-600">{tx.reason}</p>
                      <p className="text-xs text-gray-500">{tx.timestamp}</p>
                    </div>
                    <div className="text-right text-sm font-semibold text-gray-700">
                      {tx.amount > 0 ? 'Earned' : 'Spent'}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
