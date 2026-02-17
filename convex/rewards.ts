import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listRewards = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rewards").collect();
  },
});

export const redeemReward = mutation({
  args: {
    userId: v.id("users"),
    rewardId: v.id("rewards"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const reward = await ctx.db.get(args.rewardId);
    if (!reward) {
      throw new Error("Reward not found");
    }

    if (user.currentPoints < reward.pointsRequired) {
      throw new Error("Insufficient points");
    }

    const remainingPoints = user.currentPoints - reward.pointsRequired;
    const now = Date.now();

    await ctx.db.patch(args.userId, { currentPoints: remainingPoints });
    await ctx.db.insert("pointsLedger", {
      userId: args.userId,
      earned: 0,
      spent: reward.pointsRequired,
      reason: `Redeemed ${reward.rewardName}`,
      createdAt: now,
    });

    await ctx.db.insert("userRewards", {
      userId: args.userId,
      rewardId: reward._id,
      rewardName: reward.rewardName,
      pointsSpent: reward.pointsRequired,
      redeemedAt: now,
    });

    return { remainingPoints };
  },
});

export const redeemCurrentUserReward = mutation({
  args: {
    rewardId: v.id("rewards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const reward = await ctx.db.get(args.rewardId);
    if (!reward) {
      throw new Error("Reward not found");
    }

    if (user.currentPoints < reward.pointsRequired) {
      throw new Error("Insufficient points");
    }

    const remainingPoints = user.currentPoints - reward.pointsRequired;
    const now = Date.now();

    await ctx.db.patch(user._id, { currentPoints: remainingPoints });
    await ctx.db.insert("pointsLedger", {
      userId: user._id,
      earned: 0,
      spent: reward.pointsRequired,
      reason: `Redeemed ${reward.rewardName}`,
      createdAt: now,
    });

    await ctx.db.insert("userRewards", {
      userId: user._id,
      rewardId: reward._id,
      rewardName: reward.rewardName,
      pointsSpent: reward.pointsRequired,
      redeemedAt: now,
    });

    return { remainingPoints };
  },
});

export const listCurrentUserRewards = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      return [];
    }

    const rewards = await ctx.db
      .query("userRewards")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return rewards.sort((a, b) => b.redeemedAt - a.redeemedAt);
  },
});

export const markCurrentUserRewardUsed = mutation({
  args: {
    userRewardId: v.id("userRewards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const reward = await ctx.db.get(args.userRewardId);
    if (!reward) {
      throw new Error("Reward not found");
    }

    if (reward.userId !== user._id) {
      throw new Error("Not authorized");
    }

    if (reward.usedAt) {
      return { usedAt: reward.usedAt };
    }

    const usedAt = Date.now();
    await ctx.db.patch(args.userRewardId, { usedAt });

    return { usedAt };
  },
});
