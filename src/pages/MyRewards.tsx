import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useToast } from "../components/Toast";

export default function MyRewards() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const rewards = useQuery(api.rewards.listCurrentUserRewards);
  const markUsed = useMutation(api.rewards.markCurrentUserRewardUsed);
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const buildCode = (id: string) => {
    const safeId = id.replace(/[^a-zA-Z0-9]/g, "");
    return `RW-${safeId.slice(-6).toUpperCase()}`;
  };

  const toggleReward = (id: string) => {
    setActiveRewardId((current) => (current === id ? null : id));
  };

  const markRewardUsed = async (id: Id<"userRewards">) => {
    try {
      await markUsed({ userRewardId: id });
      setActiveRewardId(null);
      showToast("Reward marked as used.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to mark reward as used.";
      showToast(message, "error");
    }
  };

  if (rewards === undefined) {
    return (
      <div className="page max-w-[900px] space-y-4">
        <h1 className="page-title">My rewards</h1>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="page max-w-[900px] space-y-4">
        <h1 className="page-title">My rewards</h1>
        <EmptyState
          icon="*"
          title="No rewards yet"
          description="Redeem rewards in the Gift Shop to see them here."
          actionLabel="Go to Gift Shop"
          onAction={() => navigate("/reward")}
        />
      </div>
    );
  }

  return (
    <div className="page max-w-[900px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">My rewards</h1>
          <p className="page-subtitle">
            Use your redeemed rewards in store or at checkout.
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/reward")}
        >
          Back to Gift Shop
        </Button>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const rewardId = String(reward._id);
          const isUsed = reward.usedAt !== undefined;
          const isActive = activeRewardId === rewardId;
          const code = buildCode(rewardId);

          return (
            <Card key={rewardId} className="p-4 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{reward.rewardName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Redeemed {formatDate(reward.redeemedAt)} - {reward.pointsSpent} points
                  </p>
                </div>
                <Badge variant={isUsed ? "secondary" : "default"}>
                  {isUsed ? "Used" : "Available"}
                </Badge>
              </div>

              {isActive && !isUsed && (
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <div className="text-xs text-gray-500">
                    Show this code to use your reward
                  </div>
                  <div className="mt-1 break-all font-mono text-lg tracking-widest">
                    {code}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => toggleReward(rewardId)}
                  disabled={isUsed}
                >
                  {isActive ? "Hide code" : "Use reward"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => markRewardUsed(reward._id)}
                  disabled={isUsed}
                >
                  Mark as used
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
