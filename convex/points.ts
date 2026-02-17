import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPointsBalance = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return { currentPoints: user.currentPoints };
  },
});

export const listPointsLedger = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const ledger = await ctx.db
      .query("pointsLedger")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return ledger.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getCurrentUserPointsBalance = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      return { currentPoints: 0 };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!user) {
      return { currentPoints: 0 };
    }
    return { currentPoints: user.currentPoints };
  },
});

export const listCurrentUserPointsLedger = query({
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

    const ledger = await ctx.db
      .query("pointsLedger")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return ledger.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const awardCurrentUserPoints = mutation({
  args: {
    points: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.points <= 0) {
      throw new Error("Points must be greater than zero");
    }

    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const name =
      identity?.name ||
      [identity?.givenName, identity?.familyName].filter(Boolean).join(" ") ||
      email;

    const userId =
      existing?._id ??
      (await ctx.db.insert("users", {
        name,
        email,
        currentPoints: 0,
      }));

    const currentPoints = existing?.currentPoints ?? 0;
    const nextPoints = currentPoints + args.points;
    const now = Date.now();

    await ctx.db.patch(userId, { currentPoints: nextPoints });
    await ctx.db.insert("pointsLedger", {
      userId,
      earned: args.points,
      spent: 0,
      reason: args.reason ?? "Checkout",
      createdAt: now,
    });

    return { currentPoints: nextPoints };
  },
});
