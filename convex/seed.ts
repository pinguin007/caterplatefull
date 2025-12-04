import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data (optional - uncomment if you want to reset)
    // const existingVendors = await ctx.db.query("vendors").collect();
    // for (const vendor of existingVendors) {
    //   await ctx.db.delete(vendor._id);
    // }
    // const existingMenuItems = await ctx.db.query("menuItems").collect();
    // for (const item of existingMenuItems) {
    //   await ctx.db.delete(item._id);
    // }

    // Sample vendor data with Unsplash food images
    const vendorsData = [
      {
        restaurantName: "Mama's Italian Kitchen",
        description: "Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and traditional family recipes passed down through generations. Perfect for corporate events and special occasions.",
        address: "123 Little Italy Street, Downtown District, NY 10013",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Classic Spaghetti Carbonara", description: "Creamy pasta with pancetta, eggs, and parmesan cheese", price: 18.50, category: "Main Course" },
          { name: "Margherita Pizza", description: "Fresh mozzarella, basil, and tomato sauce on wood-fired crust", price: 22.00, category: "Main Course" },
          { name: "Caesar Salad", description: "Crisp romaine lettuce with house-made dressing and croutons", price: 12.00, category: "Salad" },
          { name: "Tiramisu", description: "Classic Italian dessert with coffee-soaked ladyfingers", price: 8.50, category: "Dessert" },
          { name: "Bruschetta Trio", description: "Three varieties of toasted bread with fresh toppings", price: 14.00, category: "Appetizer" }
        ]
      },
      {
        restaurantName: "The Burger Joint",
        description: "Gourmet burgers made with locally sourced beef, artisanal buns, and creative toppings. Great for casual corporate lunches and team events.",
        address: "456 Main Street, Midtown Plaza, NY 10018",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Classic Cheeseburger", description: "Angus beef patty with aged cheddar, lettuce, tomato, and special sauce", price: 16.00, category: "Main Course" },
          { name: "BBQ Bacon Burger", description: "Smoky BBQ sauce, crispy bacon, and onion rings", price: 18.50, category: "Main Course" },
          { name: "Sweet Potato Fries", description: "Crispy sweet potato fries with chipotle aioli", price: 8.00, category: "Side Dish" },
          { name: "Buffalo Wings", description: "Spicy buffalo wings with blue cheese dip", price: 13.00, category: "Appetizer" },
          { name: "Chocolate Milkshake", description: "Rich chocolate milkshake topped with whipped cream", price: 6.50, category: "Beverage" }
        ]
      },
      {
        restaurantName: "Green Salad Co.",
        description: "Fresh, healthy salads and bowls made with organic ingredients. Perfect for health-conscious teams and wellness events.",
        address: "789 Wellness Avenue, Health District, NY 10019",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Mediterranean Bowl", description: "Quinoa, chickpeas, cucumber, olives, and feta with lemon vinaigrette", price: 15.00, category: "Main Course" },
          { name: "Kale Caesar Salad", description: "Massaged kale with parmesan, croutons, and caesar dressing", price: 13.50, category: "Salad" },
          { name: "Avocado Toast", description: "Multigrain bread topped with smashed avocado and hemp seeds", price: 11.00, category: "Appetizer" },
          { name: "Green Smoothie", description: "Spinach, banana, mango, and coconut water blend", price: 7.50, category: "Beverage" },
          { name: "Chia Pudding", description: "Vanilla chia pudding with fresh berries and granola", price: 9.00, category: "Dessert" }
        ]
      },
      {
        restaurantName: "Spice Route Indian",
        description: "Authentic Indian cuisine with aromatic spices and traditional cooking methods. Offering both vegetarian and non-vegetarian options for diverse palates.",
        address: "321 Curry Lane, Spice Quarter, NY 10016",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Chicken Tikka Masala", description: "Tender chicken in creamy tomato-based curry sauce", price: 19.00, category: "Main Course" },
          { name: "Vegetable Biryani", description: "Fragrant basmati rice with mixed vegetables and aromatic spices", price: 16.50, category: "Main Course" },
          { name: "Samosas", description: "Crispy pastries filled with spiced potatoes and peas", price: 8.00, category: "Appetizer" },
          { name: "Naan Bread", description: "Fresh-baked flatbread, plain or garlic", price: 4.50, category: "Side Dish" },
          { name: "Mango Lassi", description: "Refreshing yogurt drink with sweet mango", price: 5.50, category: "Beverage" }
        ]
      },
      {
        restaurantName: "Tokyo Sushi Bar",
        description: "Fresh sushi and Japanese cuisine prepared by experienced chefs. Premium ingredients and traditional techniques for an authentic experience.",
        address: "654 Sakura Street, Little Tokyo, NY 10012",
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Sushi Platter", description: "Assorted nigiri and maki rolls with wasabi and ginger", price: 28.00, category: "Main Course" },
          { name: "Chicken Teriyaki Bento", description: "Grilled chicken with teriyaki sauce, rice, and vegetables", price: 17.50, category: "Main Course" },
          { name: "Miso Soup", description: "Traditional soybean paste soup with tofu and seaweed", price: 6.00, category: "Soup" },
          { name: "Edamame", description: "Steamed young soybeans with sea salt", price: 7.00, category: "Appetizer" },
          { name: "Green Tea Ice Cream", description: "Creamy matcha-flavored ice cream", price: 6.50, category: "Dessert" }
        ]
      }
    ];

    // Create vendors and their menu items
    for (const vendorData of vendorsData) {
      // Create a fake user first, then use its ID for the vendor
      const fakeUserId = await ctx.db.insert("users", {
        name: `${vendorData.restaurantName} Owner`,
        email: `owner@${vendorData.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      });

      // Create vendor
      const vendorId = await ctx.db.insert("vendors", {
        userId: fakeUserId,
        restaurantName: vendorData.restaurantName,
        description: vendorData.description,
        address: vendorData.address,
        imageUrl: vendorData.imageUrl,
        isApproved: vendorData.isApproved,
      });

      // Create menu items for this vendor
      for (const menuItem of vendorData.menuItems) {
        await ctx.db.insert("menuItems", {
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          vendorId: vendorId,
        });
      }
    }

    return {
      message: "Database seeded successfully!",
      vendorsCreated: vendorsData.length,
      totalMenuItems: vendorsData.reduce((sum, vendor) => sum + vendor.menuItems.length, 0),
    };
  },
});

// Public mutation version that can be called from the dashboard
export const seedDemoData = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    vendorsCreated: v.number(),
    menuItemsCreated: v.number(),
  }),
  handler: async (ctx) => {
    // Check if demo data already exists
    const existingVendors = await ctx.db.query("vendors").collect();
    if (existingVendors.length > 0) {
      return {
        success: false,
        message: `Demo data already exists (${existingVendors.length} vendors found). Delete existing vendors first if you want to re-seed.`,
        vendorsCreated: 0,
        menuItemsCreated: 0,
      };
    }

    // Sample vendor data with Unsplash food images
    const vendorsData = [
      {
        restaurantName: "Mama's Italian Kitchen",
        description: "Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and traditional family recipes passed down through generations. Perfect for corporate events and special occasions.",
        address: "123 Little Italy Street, Downtown District, NY 10013",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Classic Spaghetti Carbonara", description: "Creamy pasta with pancetta, eggs, and parmesan cheese", price: 18.50, category: "Main Course" },
          { name: "Margherita Pizza", description: "Fresh mozzarella, basil, and tomato sauce on wood-fired crust", price: 22.00, category: "Main Course" },
          { name: "Caesar Salad", description: "Crisp romaine lettuce with house-made dressing and croutons", price: 12.00, category: "Salad" },
          { name: "Tiramisu", description: "Classic Italian dessert with coffee-soaked ladyfingers", price: 8.50, category: "Dessert" },
          { name: "Bruschetta Trio", description: "Three varieties of toasted bread with fresh toppings", price: 14.00, category: "Appetizer" }
        ]
      },
      {
        restaurantName: "The Burger Joint",
        description: "Gourmet burgers made with locally sourced beef, artisanal buns, and creative toppings. Great for casual corporate lunches and team events.",
        address: "456 Main Street, Midtown Plaza, NY 10018",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Classic Cheeseburger", description: "Angus beef patty with aged cheddar, lettuce, tomato, and special sauce", price: 16.00, category: "Main Course" },
          { name: "BBQ Bacon Burger", description: "Smoky BBQ sauce, crispy bacon, and onion rings", price: 18.50, category: "Main Course" },
          { name: "Sweet Potato Fries", description: "Crispy sweet potato fries with chipotle aioli", price: 8.00, category: "Side Dish" },
          { name: "Buffalo Wings", description: "Spicy buffalo wings with blue cheese dip", price: 13.00, category: "Appetizer" },
          { name: "Chocolate Milkshake", description: "Rich chocolate milkshake topped with whipped cream", price: 6.50, category: "Beverage" }
        ]
      },
      {
        restaurantName: "Green Salad Co.",
        description: "Fresh, healthy salads and bowls made with organic ingredients. Perfect for health-conscious teams and wellness events.",
        address: "789 Wellness Avenue, Health District, NY 10019",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Mediterranean Bowl", description: "Quinoa, chickpeas, cucumber, olives, and feta with lemon vinaigrette", price: 15.00, category: "Main Course" },
          { name: "Kale Caesar Salad", description: "Massaged kale with parmesan, croutons, and caesar dressing", price: 13.50, category: "Salad" },
          { name: "Avocado Toast", description: "Multigrain bread topped with smashed avocado and hemp seeds", price: 11.00, category: "Appetizer" },
          { name: "Green Smoothie", description: "Spinach, banana, mango, and coconut water blend", price: 7.50, category: "Beverage" },
          { name: "Chia Pudding", description: "Vanilla chia pudding with fresh berries and granola", price: 9.00, category: "Dessert" }
        ]
      },
      {
        restaurantName: "Spice Route Indian",
        description: "Authentic Indian cuisine with aromatic spices and traditional cooking methods. Offering both vegetarian and non-vegetarian options for diverse palates.",
        address: "321 Curry Lane, Spice Quarter, NY 10016",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Chicken Tikka Masala", description: "Tender chicken in creamy tomato-based curry sauce", price: 19.00, category: "Main Course" },
          { name: "Vegetable Biryani", description: "Fragrant basmati rice with mixed vegetables and aromatic spices", price: 16.50, category: "Main Course" },
          { name: "Samosas", description: "Crispy pastries filled with spiced potatoes and peas", price: 8.00, category: "Appetizer" },
          { name: "Naan Bread", description: "Fresh-baked flatbread, plain or garlic", price: 4.50, category: "Side Dish" },
          { name: "Mango Lassi", description: "Refreshing yogurt drink with sweet mango", price: 5.50, category: "Beverage" }
        ]
      },
      {
        restaurantName: "Tokyo Sushi Bar",
        description: "Fresh sushi and Japanese cuisine prepared by experienced chefs. Premium ingredients and traditional techniques for an authentic experience.",
        address: "654 Sakura Street, Little Tokyo, NY 10012",
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&crop=center",
        isApproved: true,
        menuItems: [
          { name: "Sushi Platter", description: "Assorted nigiri and maki rolls with wasabi and ginger", price: 28.00, category: "Main Course" },
          { name: "Chicken Teriyaki Bento", description: "Grilled chicken with teriyaki sauce, rice, and vegetables", price: 17.50, category: "Main Course" },
          { name: "Miso Soup", description: "Traditional soybean paste soup with tofu and seaweed", price: 6.00, category: "Soup" },
          { name: "Edamame", description: "Steamed young soybeans with sea salt", price: 7.00, category: "Appetizer" },
          { name: "Green Tea Ice Cream", description: "Creamy matcha-flavored ice cream", price: 6.50, category: "Dessert" }
        ]
      }
    ];

    let menuItemsCreated = 0;

    // Create vendors and their menu items
    for (const vendorData of vendorsData) {
      // Create a fake user first, then use its ID for the vendor
      const fakeUserId = await ctx.db.insert("users", {
        name: `${vendorData.restaurantName} Owner`,
        email: `owner@${vendorData.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      });

      // Create vendor
      const vendorId = await ctx.db.insert("vendors", {
        userId: fakeUserId,
        restaurantName: vendorData.restaurantName,
        description: vendorData.description,
        address: vendorData.address,
        imageUrl: vendorData.imageUrl,
        isApproved: vendorData.isApproved,
      });

      // Create menu items for this vendor
      for (const menuItem of vendorData.menuItems) {
        await ctx.db.insert("menuItems", {
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          vendorId: vendorId,
        });
        menuItemsCreated++;
      }
    }

    return {
      success: true,
      message: `Successfully created ${vendorsData.length} demo vendors with ${menuItemsCreated} menu items!`,
      vendorsCreated: vendorsData.length,
      menuItemsCreated,
    };
  },
});
