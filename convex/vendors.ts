import { query } from "./_generated/server";
import { v } from "convex/values";

export const getApprovedVendors = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("vendors"),
    _creationTime: v.number(),
    userId: v.id("users"),
    restaurantName: v.string(),
    description: v.string(),
    address: v.string(),
    isApproved: v.boolean(),
    imageUrl: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_approval", (q) => q.eq("isApproved", true))
      .order("desc")
      .collect();

    return vendors;
  },
});

export const getVendorById = query({
  args: { vendorId: v.id("vendors") },
  returns: v.union(
    v.object({
      _id: v.id("vendors"),
      _creationTime: v.number(),
      userId: v.id("users"),
      restaurantName: v.string(),
      description: v.string(),
      address: v.string(),
      isApproved: v.boolean(),
      imageUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.vendorId);

    // Only return approved vendors for public viewing
    if (!vendor || !vendor.isApproved) {
      return null;
    }

    return vendor;
  },
});

export const getVendorMenuItems = query({
  args: { vendorId: v.id("vendors") },
  handler: async (ctx, args) => {
    // Verify vendor exists and is approved
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor || !vendor.isApproved) {
      return [];
    }

    const menuItems = await ctx.db
      .query("menuItems")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId))
      .order("asc")
      .collect();

    return menuItems;
  },
});

export const getVendorWithMenuCount = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("vendors"),
    _creationTime: v.number(),
    userId: v.id("users"),
    restaurantName: v.string(),
    description: v.string(),
    address: v.string(),
    isApproved: v.boolean(),
    imageUrl: v.optional(v.string()),
    menuItemCount: v.number(),
  })),
  handler: async (ctx) => {
    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_approval", (q) => q.eq("isApproved", true))
      .order("desc")
      .collect();

    // Get menu item counts for each vendor
    const vendorsWithCounts = await Promise.all(
      vendors.map(async (vendor) => {
        const menuItemCount = await ctx.db
          .query("menuItems")
          .withIndex("by_vendor", (q) => q.eq("vendorId", vendor._id))
          .collect()
          .then(items => items.length);

        return {
          ...vendor,
          menuItemCount,
        };
      })
    );

    return vendorsWithCounts;
  },
});
