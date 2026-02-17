import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from "react-router-dom";
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

export default function RewardList() {
  const navigate = useNavigate();
  const rewards = useQuery(api.rewards.listRewards);
  const pointsBalance = useQuery(api.points.getCurrentUserPointsBalance);
  const points = pointsBalance?.currentPoints ?? 0;

  if (rewards === undefined || pointsBalance === undefined) {
    return (
      <div className="page max-w-[1200px] space-y-6">
        <h1 className="page-title">🎁 Gift Shop</h1>
        <div className="space-y-2">
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200"></div>
          <div className="h-2 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="page max-w-[1200px]">
        <EmptyState 
          icon="🎁"
          title="Ingen rewards endnu"
        description="Der er ingen tilg\u00e6ngelige rewards lige nu. Kom tilbage senere!"
        />
      </div>
    );
  }

  return (
    <div className="page max-w-[1200px] space-y-6">
      <div className="page-header">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">🎁 Gift Shop</h1>
            <p className="page-subtitle">
              You have{" "}
              <strong className="text-primary font-semibold">{points}</strong>{" "}
              cashback points
            </p>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/my-rewards")}
          >
            My rewards
          </Button>
        </div>
        <Progress value={80} className="h-2" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => {
          const cost = reward.pointsRequired;
          const canAfford = points >= cost;
          const percentUsed = points > 0 ? (cost / points) * 100 : 0;

          return (
            <Card
              key={reward._id}
              className="flex flex-col gap-4 p-4"
              style={{
                opacity: canAfford ? 1 : 0.6,
                cursor: canAfford ? "pointer" : "default",
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-base font-semibold">{reward.rewardName}</h3>
                <Badge
                  className={
                    canAfford
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }
                >
                  {canAfford ? "Available" : "Need " + (cost - points) + " more"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground flex-1">
                {reward.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cost</span>
                  <span className="text-sm font-semibold text-primary">
                    {cost} points
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded bg-border">
                  <div
                    className={`h-full transition-[width] duration-300 ${
                      canAfford ? "bg-primary" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
              </div>

              <Button
                disabled={!canAfford}
                onClick={() => navigate(`/reward/${reward._id}`)}
                className="mt-auto w-full"
              >
                {canAfford ? "View details" : "Not enough points"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
