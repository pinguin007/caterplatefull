import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createCustomerProfile = mutation({
  args: {
    organizationName: v.string(),
    phoneNumber: v.string(),
  },
  returns: v.id("customers"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has a profile
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const existingVendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingCustomer || existingVendor) {
      throw new Error("User already has a profile");
    }

    return await ctx.db.insert("customers", {
      userId,
      organizationName: args.organizationName,
      phoneNumber: args.phoneNumber,
    });
  },
});

export const createVendorProfile = mutation({
  args: {
    restaurantName: v.string(),
    description: v.string(),
    address: v.string(),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("vendors"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has a profile
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const existingVendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingCustomer || existingVendor) {
      throw new Error("User already has a profile");
    }

    return await ctx.db.insert("vendors", {
      userId,
      restaurantName: args.restaurantName,
      description: args.description,
      address: args.address,
      imageUrl: args.imageUrl,
      isApproved: false, // Vendors need approval
    });
  },
});

export const getCurrentUserProfile = query({
  args: {},
  returns: v.union(
    v.object({
      type: v.literal("customer"),
      profile: v.object({
        _id: v.id("customers"),
        _creationTime: v.number(),
        userId: v.id("users"),
        organizationName: v.string(),
        phoneNumber: v.string(),
      }),
    }),
    v.object({
      type: v.literal("vendor"),
      profile: v.object({
        _id: v.id("vendors"),
        _creationTime: v.number(),
        userId: v.id("users"),
        restaurantName: v.string(),
        description: v.string(),
        address: v.string(),
        isApproved: v.boolean(),
        imageUrl: v.optional(v.string()),
      }),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Check for customer profile
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (customer) {
      return {
        type: "customer" as const,
        profile: customer,
      };
    }

    // Check for vendor profile
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (vendor) {
      return {
        type: "vendor" as const,
        profile: vendor,
      };
    }

    return null;
  },
});
