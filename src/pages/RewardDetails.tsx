import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useToast } from '../components/Toast';
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function RewardDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const rewards = useQuery(api.rewards.listRewards);
  const pointsBalance = useQuery(api.points.getCurrentUserPointsBalance);
  const redeemReward = useMutation(api.rewards.redeemCurrentUserReward);

  const rewardId = params.id;
  const reward = rewards?.find((item) => item._id === rewardId);
  const pageLoading = rewards === undefined || pointsBalance === undefined;
  const points = pointsBalance?.currentPoints ?? 0;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [remainingPoints, setRemainingPoints] = useState<number | null>(null);

  if (pageLoading) {
    return (
      <div className="page max-w-2xl space-y-6">
        <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="text" count={5} />
      </div>
    );
  }

  if (!reward) {
    return (
      <ErrorState
        title="Reward ikke fundet"
        message="Kunne ikke finde den valgte reward. Den eksisterer m\u00e5ske ikke l\u00e6ngere."
        onRetry={() => navigate("/reward")}
      />
    );
  }

  const canAfford = points >= reward.pointsRequired;
  const pointsNeeded = Math.max(reward.pointsRequired - points, 0);
  const pointsAfterRedeem = remainingPoints ?? points;

  const handleInsufficientPoints = () => {
    const message = `You need ${pointsNeeded} more points`;
    setError(message);
    showToast(message, 'error');
  };

  const handleRedeem = async () => {
    if (!canAfford) {
      handleInsufficientPoints();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await redeemReward({ rewardId: reward._id as Id<"rewards"> });
      setRemainingPoints(result.remainingPoints);
      setSuccess(true);
      showToast('Reward indl\u00f8st!', 'success');

      setTimeout(() => {
        navigate("/reward");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to redeem reward. Please try again.";
      if (message.toLowerCase().includes("insufficient")) {
        handleInsufficientPoints();
      } else {
        setError(message);
        showToast(message, 'error');
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-500 px-4 py-10">
        <Card className="w-full max-w-sm border-0 bg-emerald-600 text-white shadow-xl">
          <div className="space-y-3 p-6 text-center">
            <div className="text-4xl">✓</div>
            <h2 className="text-xl font-semibold">Reward redeemed!</h2>
            <p className="text-sm text-white/90">{reward.rewardName} has been added</p>
            <p className="text-sm text-white/90">{pointsAfterRedeem} points remaining</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="page max-w-2xl space-y-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/reward")}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border-0 bg-emerald-600 text-white shadow-lg">
          <div className="space-y-3 p-6">
            <h2 className="text-xl font-semibold">{reward.rewardName}</h2>
            <p className="text-sm text-white/90">{reward.description}</p>
            <div className="text-3xl font-bold">{reward.pointsRequired} points</div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="space-y-4 p-6">
            <h3 className="section-title">Your balance</h3>
            <div
              className={`rounded-lg px-4 py-3 text-center text-white ${
                canAfford ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            >
              <p className="text-xs opacity-90">Available points</p>
              <h1 className="text-3xl font-semibold">{points}</h1>
            </div>

            {canAfford ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                ✓ You can afford this reward
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                ✗ Need {pointsNeeded} more points
              </div>
            )}
          </div>
        </Card>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            ⚠ {error}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={handleRedeem} disabled={loading} className="w-full">
            {loading ? "Redeeming..." : "Redeem reward"}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/reward")} className="w-full">
            Cancel
          </Button>
        </div>

        <Card className="border border-border bg-[var(--bg-secondary)]">
          <div className="space-y-3 p-4">
            <h4 className="text-sm font-semibold">Redemption details</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground leading-6">
              <li>Wallet will update immediately</li>
              <li>Confirmation will be sent to your email</li>
              <li>View your transaction history anytime</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
