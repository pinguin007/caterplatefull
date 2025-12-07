import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { useState, useEffect } from "react";

interface HomepageProps {
  setCurrentPage: (page: "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string }) => void;
}

export function Homepage({ setCurrentPage }: HomepageProps) {
  const [showSignIn, setShowSignIn] = useState(false);
  const vendorsWithCounts = useQuery(api.vendors.getVendorWithMenuCount);
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  // Close sign-in modal when user successfully authenticates
  useEffect(() => {
    if (loggedInUser) {
      setShowSignIn(false);
    }
  }, [loggedInUser]);

  if (vendorsWithCounts === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-20 py-8 md:py-12 animate-fade-in">
        <div className="inline-block mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-warm rounded-full">
          <span className="text-xs md:text-sm font-semibold text-primary-700">🍽️ Elevate Your Events</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 px-2">
          <span className="gradient-text">Cater</span>
          <span className="text-neutral-900">-</span>
          <span className="gradient-text">Plateful</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-700 mb-4 md:mb-6 px-4">Your Premier Catering Marketplace</p>
        <p className="text-base md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
          Discover exceptional catering vendors for your next event. From corporate lunches to
          special celebrations, find the perfect menu that delights every palate.
        </p>
      </div>

      {/* Stats Section */}
      {vendorsWithCounts.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {/* Verified Vendors */}
          <div className="relative group animate-fade-in">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-3xl p-6 md:p-8 text-center shadow-xl group-hover:shadow-2xl transition-all group-hover:-translate-y-2 border border-primary-100">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-6xl font-black text-primary-600 mb-3 group-hover:scale-105 transition-transform">
                {vendorsWithCounts.length}
              </div>
              <div className="text-neutral-700 font-bold text-lg">Verified Vendors</div>
              <div className="text-neutral-500 text-sm mt-1">Trusted partners</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="relative group animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl group-hover:shadow-2xl transition-all group-hover:-translate-y-2 border border-accent-100">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-6xl font-black text-accent-600 mb-3 group-hover:scale-105 transition-transform">
                {vendorsWithCounts.reduce((sum, vendor) => sum + vendor.menuItemCount, 0)}
              </div>
              <div className="text-neutral-700 font-bold text-lg">Menu Items</div>
              <div className="text-neutral-500 text-sm mt-1">Delicious options</div>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="relative group animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-secondary rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl group-hover:shadow-2xl transition-all group-hover:-translate-y-2 border border-secondary-100">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-6xl font-black text-secondary-600 mb-3 group-hover:scale-105 transition-transform">24/7</div>
              <div className="text-neutral-700 font-bold text-lg">Support</div>
              <div className="text-neutral-500 text-sm mt-1">Always here to help</div>
            </div>
          </div>
        </div>
      )}

      {/* Vendors Section */}
      <div className="mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 mb-3 md:mb-4 px-4">
            Featured <span className="gradient-text">Vendors</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Explore our curated selection of top-rated catering vendors
          </p>
        </div>

        {vendorsWithCounts.length === 0 ? (
          <div className="card text-center py-20">
            <div className="text-8xl mb-8 opacity-50">🍽️</div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">No Vendors Yet</h3>
            <p className="text-neutral-600 text-lg max-w-md mx-auto">
              We're working hard to bring you amazing catering options. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
            {vendorsWithCounts.map((vendor, index) => (
              <div
                key={vendor._id}
                onClick={() => setCurrentPage({ type: "vendor", vendorId: vendor._id })}
                className="card-interactive group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Vendor Image */}
                <div className="relative h-56 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                  {vendor.imageUrl ? (
                    <>
                      <img
                        src={vendor.imageUrl}
                        alt={vendor.restaurantName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-8xl opacity-30">🍽️</div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge badge-success">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {vendor.restaurantName}
                  </h3>

                  <p className="text-neutral-600 mb-5 line-clamp-2 leading-relaxed">
                    {vendor.description}
                  </p>

                  <div className="flex items-center text-sm text-neutral-500 mb-5">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate font-medium">{vendor.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center text-sm font-semibold text-neutral-700">
                      <svg className="w-5 h-5 mr-1.5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{vendor.menuItemCount} items</span>
                    </div>
                    <span className="inline-flex items-center text-primary-600 font-bold group-hover:text-primary-700 transition-colors group-hover:translate-x-1 transition-transform">
                      View Menu
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-block mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-xs md:text-sm font-semibold text-white">✨ Join Our Community</span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 px-4">
            Ready to Get Started?
          </h3>
          <p className="text-white/90 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Join our marketplace as a customer to discover amazing catering options,
            or become a vendor to reach more customers.
          </p>

          <Unauthenticated>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-neutral-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                👤 Sign Up as Customer
              </button>
              <button
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                🍽️ Become a Vendor
              </button>
            </div>
          </Unauthenticated>

          <Authenticated>
            {userProfile === undefined ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"></div>
              </div>
            ) : userProfile === null ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-neutral-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Complete Your Profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-neutral-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </button>
                {userProfile.type === "customer" && (
                  <button
                    onClick={() => setCurrentPage("my-orders")}
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    View My Orders
                  </button>
                )}
              </div>
            )}
          </Authenticated>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <button
                onClick={() => setShowSignIn(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Sign in to join our catering marketplace. You'll be able to choose your role after signing in.
            </p>
            <SignInForm onSuccess={() => setShowSignIn(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
