import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const placeOrder = mutation({
  args: {
    vendorId: v.id("vendors"),
    deliveryAddress: v.string(),
    deliveryDate: v.string(),
    headcount: v.number(),
    totalPrice: v.number(),
    items: v.array(v.object({
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the customer profile for this user
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!customer) {
      throw new Error("User is not a customer");
    }

    // Verify vendor exists and is approved
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor || !vendor.isApproved) {
      throw new Error("Vendor not found or not approved");
    }

    return await ctx.db.insert("orders", {
      customerId: customer._id,
      vendorId: args.vendorId,
      deliveryAddress: args.deliveryAddress,
      deliveryDate: args.deliveryDate,
      headcount: args.headcount,
      totalPrice: args.totalPrice,
      items: args.items,
      status: "pending",
    });
  },
});

export const getCustomerOrders = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("orders"),
    _creationTime: v.number(),
    customerId: v.id("customers"),
    vendorId: v.id("vendors"),
    deliveryAddress: v.string(),
    deliveryDate: v.string(),
    headcount: v.number(),
    totalPrice: v.number(),
    items: v.array(v.object({
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    status: v.string(),
    vendor: v.union(
      v.object({
        restaurantName: v.string(),
        address: v.string(),
      }),
      v.null()
    ),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // Return empty array instead of throwing error to handle sign-out gracefully
      return [];
    }

    // Get the customer profile for this user
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!customer) {
      // Return empty array if user is not a customer
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", customer._id))
      .order("desc")
      .collect();

    // Get vendor information for each order
    const ordersWithVendors = await Promise.all(
      orders.map(async (order) => {
        const vendor = await ctx.db.get(order.vendorId);
        return {
          ...order,
          vendor: vendor ? {
            restaurantName: vendor.restaurantName,
            address: vendor.address,
          } : null,
        };
      })
    );

    return ordersWithVendors;
  },
});

export const getVendorOrders = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("orders"),
    _creationTime: v.number(),
    customerId: v.id("customers"),
    vendorId: v.id("vendors"),
    deliveryAddress: v.string(),
    deliveryDate: v.string(),
    headcount: v.number(),
    totalPrice: v.number(),
    items: v.array(v.object({
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    status: v.string(),
    customer: v.union(
      v.object({
        organizationName: v.string(),
        phoneNumber: v.string(),
      }),
      v.null()
    ),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // Return empty array instead of throwing error to handle sign-out gracefully
      return [];
    }

    // Get the vendor profile for this user
    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!vendor) {
      // Return empty array if user is not a vendor
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_vendor", (q) => q.eq("vendorId", vendor._id))
      .order("desc")
      .collect();

    // Get customer information for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        return {
          ...order,
          customer: customer ? {
            organizationName: customer.organizationName,
            phoneNumber: customer.phoneNumber,
          } : null,
        };
      })
    );

    return ordersWithCustomers;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
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

    // Get the order to verify ownership
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.vendorId !== vendor._id) {
      throw new Error("You can only update your own orders");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    return null;
  },
});
