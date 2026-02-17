import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const items = await Promise.all(
      cartItems.map(async (entry) => {
        const item = await ctx.db.get(entry.itemId);
        if (!item) return null;
        return {
          cartId: entry._id,
          itemId: entry.itemId,
          quantity: entry.quantity,
          item,
        };
      })
    );

    return items.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  },
});

export const addToCart = mutation({
  args: {
    userId: v.id("users"),
    itemId: v.id("items"),
    quantity: v.int64(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (existing) {
      const updatedQuantity = existing.quantity + args.quantity;
      await ctx.db.patch(existing._id, { quantity: updatedQuantity });
      return existing._id;
    }

    return await ctx.db.insert("cartItem", {
      userId: args.userId,
      itemId: args.itemId,
      quantity: args.quantity,
    });
  },
});

export const updateCartItemQuantity = mutation({
  args: {
    userId: v.id("users"),
    itemId: v.id("items"),
    quantity: v.int64(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (!existing) {
      throw new Error("Cart item not found");
    }

    if (args.quantity <= 0n) {
      await ctx.db.delete(existing._id);
      return existing._id;
    }

    await ctx.db.patch(existing._id, { quantity: args.quantity });
    return existing._id;
  },
});

export const removeCartItem = mutation({
  args: {
    userId: v.id("users"),
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (!existing) {
      return null;
    }

    await ctx.db.delete(existing._id);
    return existing._id;
  },
});

export const clearCart = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const entry of cartItems) {
      await ctx.db.delete(entry._id);
    }

    return cartItems.length;
  },
});

export const checkoutCart = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const cartItems = await ctx.db
      .query("cartItem")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalPoints = 0;
    let totalAmount = 0;
    const now = Date.now();

    for (const cartItem of cartItems) {
      const item = await ctx.db.get(cartItem.itemId);
      if (!item) {
        throw new Error("Item not found");
      }
      const quantity = Number(cartItem.quantity);
      const itemTotal = item.price * quantity;
      totalAmount += itemTotal;
      totalPoints += item.creditvalue * quantity;

      await ctx.db.insert("transactions", {
        userId: args.userId,
        itemId: cartItem.itemId,
        date: now,
        totalAmount: itemTotal,
      });
    }

    await ctx.db.patch(args.userId, {
      currentPoints: user.currentPoints + totalPoints,
    });

    await ctx.db.insert("pointsLedger", {
      userId: args.userId,
      earned: totalPoints,
      spent: 0,
      reason: "Checkout",
      createdAt: now,
    });

    for (const cartItem of cartItems) {
      await ctx.db.delete(cartItem._id);
    }

    return { totalPoints, totalAmount };
  },
});
