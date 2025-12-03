import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  customers: defineTable({
    userId: v.id("users"),
    organizationName: v.string(),
    phoneNumber: v.string(),
  }).index("by_user", ["userId"]),

  vendors: defineTable({
    userId: v.id("users"),
    restaurantName: v.string(),
    description: v.string(),
    address: v.string(),
    isApproved: v.boolean(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_approval", ["isApproved"]),

  admins: defineTable({
    userId: v.id("users"),
    role: v.string(), // "admin"
  }).index("by_user", ["userId"]),

  menuItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    vendorId: v.id("vendors"),
    category: v.string(),
  }).index("by_vendor", ["vendorId"]),

  orders: defineTable({
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
  })
    .index("by_customer", ["customerId"])
    .index("by_vendor", ["vendorId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
