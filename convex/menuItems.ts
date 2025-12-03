import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getVendorMenuItems = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("menuItems"),
    _creationTime: v.number(),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    vendorId: v.id("vendors"),
    category: v.string(),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the vendor profile for this user
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!vendor) {
      throw new Error("User is not a vendor");
    }

    // Get all menu items for this vendor
    const menuItems = await ctx.db
      .query("menuItems")
      .withIndex("by_vendor", (q) => q.eq("vendorId", vendor._id))
      .collect();

    return menuItems;
  },
});

export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
  },
  returns: v.id("menuItems"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the vendor profile for this user
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!vendor) {
      throw new Error("User is not a vendor");
    }

    if (!vendor.isApproved) {
      throw new Error("Vendor account must be approved to create menu items");
    }

    return await ctx.db.insert("menuItems", {
      name: args.name,
      description: args.description,
      price: args.price,
      category: args.category,
      vendorId: vendor._id,
    });
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the vendor profile for this user
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!vendor) {
      throw new Error("User is not a vendor");
    }

    // Get the menu item to verify ownership
    const menuItem = await ctx.db.get(args.id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (menuItem.vendorId !== vendor._id) {
      throw new Error("You can only update your own menu items");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      price: args.price,
      category: args.category,
    });

    return null;
  },
});

export const deleteMenuItem = mutation({
  args: {
    id: v.id("menuItems"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the vendor profile for this user
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!vendor) {
      throw new Error("User is not a vendor");
    }

    // Get the menu item to verify ownership
    const menuItem = await ctx.db.get(args.id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (menuItem.vendorId !== vendor._id) {
      throw new Error("You can only delete your own menu items");
    }

    await ctx.db.delete(args.id);

    return null;
  },
});
