import { ArrowLeft, TrendingUp, Award } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export default function PointsOverview() {
  const pointsBalance = useQuery(api.points.getCurrentUserPointsBalance);
  const ledger = useQuery(api.points.listCurrentUserPointsLedger);
  const isLoading = pointsBalance === undefined || ledger === undefined;

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const history =
    ledger?.map((entry) => ({
      id: entry._id,
      date: formatDate(entry.createdAt),
      amount: entry.earned > 0 ? entry.earned : entry.spent,
      type: entry.earned > 0 ? 'earned' : 'spent',
      description: entry.reason,
    })) ?? [];

  const totalEarned = (ledger ?? []).reduce((sum, entry) => sum + entry.earned, 0);
  const totalSpent = (ledger ?? []).reduce((sum, entry) => sum + entry.spent, 0);
  const currentPoints = pointsBalance?.currentPoints ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6">
          <LoadingSkeleton type="card" count={2} />
          <LoadingSkeleton type="list" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <div className="rounded-b-[2.25rem] bg-gradient-to-r from-green-500 to-emerald-400 px-4 pb-8 pt-8 text-white shadow-[0_4px_24px_rgba(34,197,94,0.2)] sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold sm:text-2xl">Point-historik</h1>
          </div>

          <Card className="mt-6 border-0 bg-emerald-500 text-white shadow-lg">
            <div className="space-y-4 p-5 sm:p-6">
              <p className="text-sm opacity-90">Nuv\u00e6rende saldo</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{currentPoints} point</h2>
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="opacity-80">Total optjent</p>
                  <p className="mt-1 font-semibold">{totalEarned} point</p>
                </div>
                <div className="sm:text-right">
                  <p className="opacity-80">Brugt</p>
                  <p className="mt-1 font-semibold">{totalSpent} point</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-0 bg-emerald-50 shadow-sm">
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-emerald-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Optjent</span>
              </div>
              <p className="text-2xl font-semibold text-emerald-700">{totalEarned} point</p>
            </div>
          </Card>
          <Card className="border-0 bg-blue-50 shadow-sm">
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-blue-700">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">Niveau</span>
              </div>
              <p className="text-2xl font-semibold text-blue-700">Guld medlem</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Seneste transaktioner</h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <Card className="border border-emerald-100 bg-white shadow-sm">
                <div className="p-4 text-sm text-gray-600">Ingen transaktioner endnu.</div>
              </Card>
            ) : (
              history.map((item) => (
                <Card key={item.id} className="border border-emerald-100 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{item.description}</span>
                        <Badge
                          variant="secondary"
                          className={
                            item.type === 'earned'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {item.type === 'earned' ? 'Optjent' : 'Brugt'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-base font-semibold ${
                          item.type === 'earned' ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {item.type === 'earned' ? '+' : '-'}
                        {item.amount} point
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
