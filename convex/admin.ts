import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to check if user is admin
async function isAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return false;
  }

  const admin = await ctx.db
    .query("admins")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .unique();

  return admin !== null && admin.role === "admin";
}

export const adminGetAllVendors = query({
  args: {},
  returns: v.union(
    v.array(v.object({
      _id: v.id("vendors"),
      _creationTime: v.number(),
      userId: v.id("users"),
      restaurantName: v.string(),
      description: v.string(),
      address: v.string(),
      isApproved: v.boolean(),
      imageUrl: v.optional(v.string()),
      userName: v.string(),
      userEmail: v.string(),
    })),
    v.null()
  ),
  handler: async (ctx) => {
    // Check if user is admin
    if (!(await isAdmin(ctx))) {
      return null; // Return null instead of throwing error
    }

    const vendors = await ctx.db.query("vendors").collect();

    // Get user info for each vendor
    const vendorsWithUsers = await Promise.all(
      vendors.map(async (vendor) => {
        const user = await ctx.db.get(vendor.userId);
        return {
          ...vendor,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "No email",
        };
      })
    );

    return vendorsWithUsers;
  },
});

export const adminApproveVendor = mutation({
  args: {
    vendorId: v.id("vendors"),
  },
  returns: v.object({
    success: v.boolean(),
    newStatus: v.boolean(),
  }),
  handler: async (ctx, args) => {
    // Check if user is admin
    if (!(await isAdmin(ctx))) {
      throw new Error("Access denied. Admin role required.");
    }

    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // Toggle the approval status
    await ctx.db.patch(args.vendorId, {
      isApproved: !vendor.isApproved,
    });

    return { success: true, newStatus: !vendor.isApproved };
  },
});

export const adminGetRecentOrders = query({
  args: {},
  returns: v.union(
    v.array(v.object({
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
      customerName: v.string(),
      vendorName: v.string(),
    })),
    v.null()
  ),
  handler: async (ctx) => {
    // Check if user is admin
    if (!(await isAdmin(ctx))) {
      return null; // Return null instead of throwing error
    }

    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .take(10);

    // Get customer and vendor info for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customerId);
        const vendor = await ctx.db.get(order.vendorId);

        return {
          ...order,
          customerName: customer?.organizationName || "Unknown Customer",
          vendorName: vendor?.restaurantName || "Unknown Vendor",
        };
      })
    );

    return ordersWithDetails;
  },
});

export const adminResolveDispute = mutation({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    // Check if user is admin
    if (!(await isAdmin(ctx))) {
      throw new Error("Access denied. Admin role required.");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Set status to 'resolved'
    await ctx.db.patch(args.orderId, {
      status: "resolved",
    });

    return { success: true };
  },
});

// PRODUCTION: Secure admin creation - only allow specific emails or existing admins
export const createAdmin = mutation({
  args: {
    targetUserId: v.optional(v.id("users")), // Optional: if existing admin is promoting someone
  },
  returns: v.id("admins"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email) {
      throw new Error("User email not found");
    }

    // Check if there are any existing admins
    const existingAdmins = await ctx.db.query("admins").collect();

    if (existingAdmins.length === 0) {
      // First admin setup - check against whitelist of allowed emails
      // TODO: Add your email to this list before deploying to production
      const allowedAdminEmails = [
        // Add your email here, e.g., "your-email@example.com"
        // This allows the first admin to be created
        "theoriginalyusuf@gmail.com",
      ];

      if (!allowedAdminEmails.includes(user.email)) {
        throw new Error(
          "Admin creation restricted. Contact system administrator."
        );
      }

      // Create the first admin
      return await ctx.db.insert("admins", {
        userId,
        role: "admin",
      });
    }

    // If admins exist, only existing admins can create new admins
    const requestingUserIsAdmin = await isAdmin(ctx);
    if (!requestingUserIsAdmin) {
      throw new Error(
        "Only existing admins can create new admins. Contact an administrator."
      );
    }

    // If promoting another user, use targetUserId, otherwise promote self
    const targetId = args.targetUserId || userId;

    // Check if target is already an admin
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", targetId))
      .unique();

    if (existingAdmin) {
      throw new Error("User is already an admin");
    }

    return await ctx.db.insert("admins", {
      userId: targetId,
      role: "admin",
    });
  },
});
