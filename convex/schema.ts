import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    birthdate: v.optional(v.string()),
    currentPoints: v.number(),
  }).index("by_email", ["email"]),

  items: defineTable({
    barcode: v.int64(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    creditvalue: v.number(),
    healthy: v.boolean(),
  }).index("by_barcode", ["barcode"]),

  cartItem: defineTable({
    userId: v.id("users"),
    itemId: v.id("items"),
    quantity: v.int64(),
  }).index("by_userId", ["userId"]),

  pointsLedger: defineTable({
    userId: v.id("users"),
    earned: v.number(),
    spent: v.number(),
    reason: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  userRewards: defineTable({
    userId: v.id("users"),
    rewardId: v.id("rewards"),
    rewardName: v.string(),
    pointsSpent: v.number(),
    redeemedAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_rewardId", ["rewardId"]),

  transactions: defineTable({
    userId: v.id("users"),
    itemId: v.id("items"),
    date: v.number(),
    totalAmount: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_date", ["date"]),

  store: defineTable({
    name: v.string(),
    location: v.string(),
    openingHours: v.string(),
    contactInfo: v.string(),
    storeId: v.int64(),
  }).index("by_storeId", ["storeId"]),

  rewards: defineTable({
    rewardName: v.string(),
    pointsRequired: v.number(),
    description: v.string(),
  }),
});
