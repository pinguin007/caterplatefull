import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useCart } from "./contexts/CartContext";
import { Cart } from "./components/Cart";
import { toast } from "sonner";

interface VendorPageProps {
  vendorId: string;
  setCurrentPage: (page: "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string }) => void;
}

export function VendorPage({ vendorId, setCurrentPage }: VendorPageProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, setVendor, state, getItemCount } = useCart();

  const vendor = useQuery(api.vendors.getVendorById, { vendorId: vendorId as Id<"vendors"> });
  const menuItems = useQuery(api.vendors.getVendorMenuItems, { vendorId: vendorId as Id<"vendors"> });
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  if (vendor === undefined || menuItems === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (vendor === null) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">🔍</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Vendor Not Found</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            The vendor you're looking for doesn't exist or isn't currently available for catering orders.
          </p>
          <button
            onClick={() => setCurrentPage("homepage")}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Vendors
          </button>
        </div>
      </div>
    );
  }

  // Set vendor in cart context when vendor loads
  if (vendor && (!state.vendorId || state.vendorId !== vendor._id)) {
    setVendor(vendor._id, vendor.restaurantName);
  }

  const handleAddToCart = (menuItem: any, quantity: number = 1) => {
    if (!userProfile) {
      toast.error("Please sign in to add items to your cart");
      return;
    }

    if (userProfile.type !== "customer") {
      toast.error("Only customers can place orders");
      return;
    }

    // Check if adding from different vendor
    if (state.vendorId && state.vendorId !== vendor._id && state.items.length > 0) {
      toast.error("You can only order from one vendor at a time. Please clear your cart first.");
      return;
    }

    addItem({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      vendorId: vendor._id,
      vendorName: vendor.restaurantName,
    });

    toast.success(`Added ${menuItem.name} to cart`);
  };

  // Group menu items by category and sort categories
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Sort categories in a logical order
  const categoryOrder = ["Appetizer", "Salad", "Soup", "Main Course", "Side Dish", "Dessert", "Beverage", "Other"];
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <>
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <button
            onClick={() => setCurrentPage("homepage")}
            className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Vendors
          </button>

          {/* Cart Button */}
          {getItemCount() > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center btn btn-primary shadow-lg animate-pulse-slow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Cart ({getItemCount()})
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getItemCount()}
              </span>
            </button>
          )}
        </div>

        {/* Vendor Header */}
        <div className="card p-8 mb-10 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                  🍽️
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-2">{vendor.restaurantName}</h1>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-success text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified Vendor
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">About</h3>
                  <p className="text-neutral-700 text-sm sm:text-base md:text-lg leading-relaxed">{vendor.description}</p>
                </div>

                <div className="flex items-start gap-2 text-neutral-600 bg-neutral-50 rounded-lg p-3 md:p-4">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm sm:text-base md:text-lg font-medium break-words">{vendor.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900">
                Our <span className="gradient-text">Menu</span>
              </h2>
              <p className="text-neutral-600 mt-1 md:mt-2 text-sm sm:text-base md:text-lg">
                {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} available for catering
              </p>
            </div>
          </div>

          {menuItems.length === 0 ? (
            <div className="card text-center py-20">
              <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-6xl">📋</div>
              </div>
              <h3 className="text-3xl font-black text-neutral-900 mb-4">Menu Coming Soon</h3>
              <p className="text-neutral-600 text-lg max-w-md mx-auto leading-relaxed">
                {vendor.restaurantName} is still setting up their catering menu.
                Check back soon for delicious options!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategories.map((category, catIndex) => {
                const items = groupedItems[category];
                return (
                  <div key={category} className="card overflow-hidden animate-fade-in" style={{ animationDelay: `${catIndex * 100}ms` }}>
                    <div className="bg-gradient-warm px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-primary-100">
                      <h3 className="text-xl sm:text-2xl font-black text-neutral-900">{category}</h3>
                      <p className="text-neutral-600 mt-1 font-medium text-sm sm:text-base">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                      <div className="grid gap-3 sm:gap-4">
                        {items.map((item, index) => (
                          <div
                            key={item._id}
                            className={`flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-gradient-warm rounded-xl transition-all border border-transparent hover:border-primary-200 ${index !== items.length - 1 ? 'border-b border-neutral-100' : ''
                              }`}
                          >
                            <div className="flex-1 w-full">
                              <h4 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">{item.name}</h4>
                              <p className="text-neutral-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{item.description}</p>
                              <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <p className="text-2xl sm:text-3xl font-black text-primary-600">${item.price.toFixed(2)}</p>
                                <p className="text-xs sm:text-sm text-neutral-500">per serving</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="btn btn-primary w-full md:w-auto whitespace-nowrap shadow-md"
                            >
                              + Add to Order
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 mt-8 md:mt-12 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 px-4">Questions About Catering?</h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed px-4">
              Contact <span className="font-bold">{vendor.restaurantName}</span> directly for custom catering requests or special dietary accommodations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary bg-white text-primary-600 hover:bg-neutral-50 shadow-lg">
                Contact Vendor
              </button>
              <button className="btn bg-white/10 text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm">
                Request Custom Quote
              </button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              * Direct contact features coming soon
            </p>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
