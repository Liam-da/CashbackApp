import { query } from "./_generated/server";
import { v } from "convex/values";

export const getItemByBarcode = query({
  args: { barcode: v.int64() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();
  },
});
