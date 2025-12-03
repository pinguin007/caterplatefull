import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

interface MenuManagementProps {
  userProfile: {
    type: "customer" | "vendor";
    profile: any;
  };
}

interface MenuItem {
  _id: Id<"menuItems">;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: Id<"vendors">;
}

const CATEGORIES = [
  { name: "Appetizer", icon: "🥗", color: "from-orange-500 to-orange-700" },
  { name: "Main Course", icon: "🍽️", color: "from-primary-500 to-primary-700" },
  { name: "Side Dish", icon: "🥘", color: "from-accent-500 to-accent-700" },
  { name: "Dessert", icon: "🍰", color: "from-secondary-500 to-secondary-700" },
  { name: "Beverage", icon: "🥤", color: "from-blue-500 to-blue-700" },
  { name: "Salad", icon: "🥗", color: "from-green-500 to-green-700" },
  { name: "Soup", icon: "🍲", color: "from-orange-500 to-red-600" },
  { name: "Other", icon: "📋", color: "from-neutral-500 to-neutral-700" },
];

export function MenuManagement({ userProfile }: MenuManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const menuItems = useQuery(api.menuItems.getVendorMenuItems);
  const createMenuItem = useMutation(api.menuItems.createMenuItem);
  const updateMenuItem = useMutation(api.menuItems.updateMenuItem);
  const deleteMenuItem = useMutation(api.menuItems.deleteMenuItem);

  // Redirect if not a vendor
  if (userProfile.type !== "vendor") {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">🔒</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Access Denied</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            This page is only available to vendors.
          </p>
        </div>
      </div>
    );
  }

  // Show message if vendor is not approved
  if (!userProfile.profile.isApproved) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">⏳</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Account Pending Approval</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            You'll be able to manage your menu once your vendor account is approved.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;

    try {
      await createMenuItem({ name, description, price, category });
      toast.success("Menu item created successfully! ✅");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to create menu item. Please try again.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;

    try {
      await updateMenuItem({
        id: editingItem._id,
        name,
        description,
        price,
        category,
      });
      toast.success("Menu item updated successfully! ✅");
      setEditingItem(null);
    } catch (error) {
      toast.error("Failed to update menu item. Please try again.");
      console.error(error);
    }
  };

  const handleDelete = async (id: Id<"menuItems">) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await deleteMenuItem({ id });
      toast.success("Menu item deleted successfully! 🗑️");
    } catch (error) {
      toast.error("Failed to delete menu item. Please try again.");
      console.error(error);
    }
  };

  const getCategoryInfo = (categoryName: string) => {
    return CATEGORIES.find(c => c.name === categoryName) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Group menu items by category
  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>) || {};

  if (menuItems === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-5xl font-black text-neutral-900 mb-3">
          Menu <span className="gradient-text">Management</span>
        </h1>
        <p className="text-xl text-neutral-600">Add and manage your catering menu items</p>
      </div>

      {/* Create Menu Item Form */}
      <div className="card p-8 mb-10 animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-neutral-900">Add New Menu Item</h2>
        </div>

        <form onSubmit={handleCreateSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-neutral-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input w-full"
              placeholder="e.g., Grilled Chicken Sandwich"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-bold text-neutral-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              required
              className="input w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-neutral-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="input w-full"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-bold text-neutral-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="input w-full resize-none"
              placeholder="Describe the menu item, ingredients, or any special features..."
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isCreating}
              className="btn btn-primary"
            >
              {isCreating ? "Adding..." : "Add Menu Item"}
            </button>
          </div>
        </form>
      </div>

      {/* Menu Items List */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="card text-center py-20 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl">🍽️</div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-4">No Menu Items Yet</h3>
          <p className="text-neutral-600 text-lg max-w-md mx-auto leading-relaxed">
            Start building your menu by adding your first item above!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items], index) => {
            const categoryInfo = getCategoryInfo(category);
            return (
              <div
                key={category}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${categoryInfo.color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                    <span className="text-3xl">{categoryInfo.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900">{category}</h3>
                    <p className="text-neutral-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item._id}>
                      {editingItem?._id === item._id ? (
                        /* Edit Mode */
                        <div className="card p-6">
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input
                              type="text"
                              name="name"
                              defaultValue={item.name}
                              required
                              className="input w-full text-sm"
                              placeholder="Item name"
                            />
                            <input
                              type="number"
                              name="price"
                              step="0.01"
                              min="0"
                              defaultValue={item.price}
                              required
                              className="input w-full text-sm"
                              placeholder="Price"
                            />
                            <select
                              name="category"
                              defaultValue={item.category}
                              required
                              className="input w-full text-sm"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat.name} value={cat.name}>
                                  {cat.icon} {cat.name}
                                </option>
                              ))}
                            </select>
                            <textarea
                              name="description"
                              defaultValue={item.description}
                              required
                              rows={3}
                              className="input w-full text-sm resize-none"
                              placeholder="Description"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors text-sm"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="flex-1 px-4 py-2 bg-neutral-600 text-white rounded-lg font-semibold hover:bg-neutral-700 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="card-interactive p-6 h-full flex flex-col">
                          <div className="flex-1">
                            <h4 className="text-xl font-black text-neutral-900 mb-2">{item.name}</h4>
                            <p className="text-neutral-600 mb-4 text-sm line-clamp-3">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                            <div className="text-2xl font-black text-primary-600">
                              ${item.price.toFixed(2)}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
