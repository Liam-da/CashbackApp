import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentPoints = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return { currentPoints: user.currentPoints };
  },
});

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      return existing._id;
    }

    const name =
      identity?.name ||
      [identity?.givenName, identity?.familyName].filter(Boolean).join(" ") ||
      email;

    return await ctx.db.insert("users", {
      name,
      email,
      currentPoints: 0,
    });
  },
});
