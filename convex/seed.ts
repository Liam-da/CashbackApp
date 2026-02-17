import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const seedItems = [
  {
    barcode: 5700000000001n,
    name: "Organic Apples",
    price: 24.5,
    category: "produce",
    creditvalue: 8,
    healthy: true,
  },
  {
    barcode: 5700000000002n,
    name: "Bananas",
    price: 18.0,
    category: "produce",
    creditvalue: 6,
    healthy: true,
  },
  {
    barcode: 5700000000003n,
    name: "Whole Grain Bread",
    price: 22.5,
    category: "bakery",
    creditvalue: 7,
    healthy: true,
  },
  {
    barcode: 5700000000004n,
    name: "Low Fat Milk 1L",
    price: 14.0,
    category: "dairy",
    creditvalue: 5,
    healthy: true,
  },
  {
    barcode: 5700000000005n,
    name: "Greek Yogurt",
    price: 16.0,
    category: "dairy",
    creditvalue: 6,
    healthy: true,
  },
  {
    barcode: 5700000000006n,
    name: "Oatmeal",
    price: 20.0,
    category: "pantry",
    creditvalue: 7,
    healthy: true,
  },
  {
    barcode: 5700000000007n,
    name: "Brown Rice",
    price: 19.5,
    category: "pantry",
    creditvalue: 6,
    healthy: true,
  },
  {
    barcode: 5700000000008n,
    name: "Peanut Butter",
    price: 28.0,
    category: "pantry",
    creditvalue: 4,
    healthy: true,
  },
  {
    barcode: 5700000000009n,
    name: "Mixed Salad",
    price: 25.0,
    category: "produce",
    creditvalue: 9,
    healthy: true,
  },
  {
    barcode: 5700000000010n,
    name: "Chicken Breast",
    price: 39.0,
    category: "meat",
    creditvalue: 8,
    healthy: true,
  },
  {
    barcode: 5700000000011n,
    name: "Salmon Fillet",
    price: 49.0,
    category: "seafood",
    creditvalue: 10,
    healthy: true,
  },
  {
    barcode: 5700000000012n,
    name: "Sparkling Water",
    price: 10.0,
    category: "beverage",
    creditvalue: 2,
    healthy: true,
  },
  {
    barcode: 5700000000013n,
    name: "Orange Juice",
    price: 24.0,
    category: "beverage",
    creditvalue: 4,
    healthy: true,
  },
  {
    barcode: 5700000000014n,
    name: "Protein Bar",
    price: 18.0,
    category: "snack",
    creditvalue: 3,
    healthy: true,
  },
  {
    barcode: 5700000000015n,
    name: "Chocolate Bar",
    price: 14.0,
    category: "snack",
    creditvalue: 1,
    healthy: false,
  },
  {
    barcode: 5700000000016n,
    name: "Potato Chips",
    price: 22.0,
    category: "snack",
    creditvalue: 1,
    healthy: false,
  },
  {
    barcode: 5700000000017n,
    name: "Tomato Soup",
    price: 17.5,
    category: "pantry",
    creditvalue: 4,
    healthy: true,
  },
  {
    barcode: 5700000000018n,
    name: "Frozen Vegetables",
    price: 21.0,
    category: "frozen",
    creditvalue: 6,
    healthy: true,
  },
  {
    barcode: 5700000000019n,
    name: "Cheddar Cheese",
    price: 26.0,
    category: "dairy",
    creditvalue: 3,
    healthy: false,
  },
  {
    barcode: 5700000000020n,
    name: "Granola",
    price: 27.0,
    category: "pantry",
    creditvalue: 5,
    healthy: true,
  },
];

const seedRewards = [
  {
    rewardName: "Free Coffee",
    pointsRequired: 50,
    description: "Redeem for a small coffee at checkout.",
  },
  {
    rewardName: "Healthy Snack Voucher",
    pointsRequired: 120,
    description: "Get one healthy snack for free.",
  },
  {
    rewardName: "10% Grocery Discount",
    pointsRequired: 200,
    description: "Apply 10% off your next basket.",
  },
  {
    rewardName: "Free Fruit Pack",
    pointsRequired: 180,
    description: "Redeem for a mixed fruit pack.",
  },
  {
    rewardName: "Smoothie Coupon",
    pointsRequired: 150,
    description: "Free smoothie at the juice bar.",
  },
  {
    rewardName: "Protein Bundle",
    pointsRequired: 300,
    description: "Redeem for a protein bundle pack.",
  },
  {
    rewardName: "Cooking Class Entry",
    pointsRequired: 500,
    description: "Entry to a healthy cooking workshop.",
  },
  {
    rewardName: "Reusable Tote Bag",
    pointsRequired: 90,
    description: "Pick up a branded tote bag.",
  },
  {
    rewardName: "Premium Coffee Beans",
    pointsRequired: 260,
    description: "Redeem for a bag of premium beans.",
  },
  {
    rewardName: "Family Meal Deal",
    pointsRequired: 400,
    description: "Discounted family meal kit.",
  },
];

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingItem = await ctx.db.query("items").first();
    const existingReward = await ctx.db.query("rewards").first();

    const inserted = { items: 0, rewards: 0, skipped: true };

    if (!existingItem) {
      for (const item of seedItems) {
        await ctx.db.insert("items", item);
      }
      inserted.items = seedItems.length;
      inserted.skipped = false;
    }

    if (!existingReward) {
      for (const reward of seedRewards) {
        await ctx.db.insert("rewards", reward);
      }
      inserted.rewards = seedRewards.length;
      inserted.skipped = false;
    }

    const seedPoints = 1000;
    const users = await ctx.db.query("users").collect();
    const now = Date.now();

    for (const user of users) {
      await ctx.db.patch(user._id, {
        currentPoints: user.currentPoints + seedPoints,
      });

      await ctx.db.insert("pointsLedger", {
        userId: user._id,
        earned: seedPoints,
        spent: 0,
        reason: "Seed grant",
        createdAt: now,
      });
    }

    return inserted;
  },
});

export const grantAllUsersPoints = internalMutation({
  args: { points: v.number() },
  handler: async (ctx, args) => {
    if (args.points <= 0) {
      throw new Error("Points must be greater than zero");
    }

    const users = await ctx.db.query("users").collect();
    const now = Date.now();

    for (const user of users) {
      await ctx.db.patch(user._id, {
        currentPoints: user.currentPoints + args.points,
      });

      await ctx.db.insert("pointsLedger", {
        userId: user._id,
        earned: args.points,
        spent: 0,
        reason: "Seed grant",
        createdAt: now,
      });
    }

    return { usersUpdated: users.length, points: args.points };
  },
});
