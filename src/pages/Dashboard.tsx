import { Apple, Gift, History, Scan, TrendingUp } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { motion } from 'framer-motion';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  points: number;
}

export default function Dashboard({ onNavigate, points }: DashboardProps) {
  const ledger = useQuery(api.points.listCurrentUserPointsLedger);
  const isLoading = ledger === undefined;

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const recentActivity =
    ledger
      ?.slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((entry) => ({
        id: entry._id,
        date: formatDate(entry.createdAt),
        points: entry.earned - entry.spent,
        reason: entry.reason,
      })) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-400 pb-24">
      <div className="rounded-b-[2.25rem] bg-gradient-to-r from-green-500 to-emerald-400 px-4 pb-10 pt-8 shadow-[0_8px_32px_rgba(34,197,94,0.2)] sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm opacity-90 sm:text-base">Hej, velkommen tilbage!</p>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sund K\u00f8b</h1>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 shadow sm:h-14 sm:w-14">
              <Apple className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md border-0 bg-emerald-500 text-white shadow-lg">
              <div className="space-y-3 p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <p className="text-sm opacity-90">Din saldo</p>
                  <TrendingUp className="h-5 w-5 opacity-80" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold leading-none sm:text-4xl">
                    {points} Point
                  </h2>
                  <p className="text-sm opacity-90">i sundhedspoint</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-6 sm:px-6">
        <Card className="border border-emerald-100 shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Scan className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold">Scan your receipt</h3>
              <p className="text-sm text-gray-600">Earn points in seconds.</p>
            </div>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => onNavigate('scan')}>
              Scan
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            onClick={() => onNavigate('points-overview')}
            className="cursor-pointer border border-blue-100 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold">Point-historik</h4>
              <p className="text-sm text-gray-600">Se dine optjente point</p>
            </div>
          </Card>
          <Card
            onClick={() => onNavigate('rewards')}
            className="cursor-pointer border border-amber-100 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-base font-semibold">Brug dine point</h4>
              <p className="text-sm text-gray-600">Se hvordan du kan bruge point</p>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Recent activity</h3>
            <Button size="sm" variant="ghost" onClick={() => onNavigate('points-overview')}>
              View all
            </Button>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="list" count={3} />
          ) : recentActivity.length === 0 ? (
            <Card className="border border-dashed border-gray-200 bg-white text-center shadow-sm">
              <div className="space-y-3 p-5">
                <p className="text-sm text-gray-600">No recent activity yet.</p>
                <Button size="sm" onClick={() => onNavigate('scan')}>
                  Scan a receipt
                </Button>
              </div>
            </Card>
          ) : (
            recentActivity.map((entry) => (
              <Card key={entry.id} className="border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.reason}</p>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      entry.points >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {entry.points >= 0 ? '+' : ''}
                    {entry.points} pts
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
