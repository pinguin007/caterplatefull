import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { ProfileSelect } from "./ProfileSelect";
import { Dashboard } from "./Dashboard";
import { MenuManagement } from "./MenuManagement";
import { VendorPage } from "./VendorPage";
import { Homepage } from "./Homepage";
import { MyOrders } from "./components/MyOrders";
import { VendorOrders } from "./components/VendorOrders";
import { AdminDashboard } from "./AdminDashboard";
import { CartProvider, useCart } from "./contexts/CartContext";
import { Cart } from "./components/Cart";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

export default function App() {
  return (
    <CartProvider>
      <AppContent />
      <Toaster />
    </CartProvider>
  );
}

function CartButton({ isCartOpen, setIsCartOpen }: { isCartOpen: boolean; setIsCartOpen: (isOpen: boolean) => void }) {
  const { getItemCount } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-all hover:scale-105"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {getItemCount() > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-scale-in">
          {getItemCount()}
        </span>
      )}
    </button>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("homepage");
  const [showSignIn, setShowSignIn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  // Close sign-in modal when user successfully authenticates
  useEffect(() => {
    if (loggedInUser) {
      setShowSignIn(false);
    }
  }, [loggedInUser]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg">
        <div className="h-16 max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage("homepage")}
            className="text-2xl font-black gradient-text hover:scale-105 transition-transform"
          >
            Cater-Plateful
          </button>
          <div className="flex items-center gap-2">
            <Authenticated>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="px-4 py-2 text-neutral-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-primary-50"
              >
                Dashboard
              </button>

              {/* My Orders - Only show for customers */}
              {userProfile?.type === "customer" && (
                <button
                  onClick={() => setCurrentPage("my-orders")}
                  className="px-4 py-2 text-neutral-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-primary-50"
                >
                  My Orders
                </button>
              )}

              {/* Admin - Available for all users (for now) */}
              <button
                onClick={() => setCurrentPage("admin")}
                className="px-4 py-2 text-neutral-700 hover:text-primary-600 font-semibold transition-colors rounded-lg hover:bg-primary-50"
              >
                Admin
              </button>

              {/* Cart Button - Only show for customers */}
              {userProfile?.type === "customer" && (
                <CartButton
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                />
              )}

              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <button
                onClick={() => setShowSignIn(true)}
                className="px-6 py-2.5 btn btn-primary"
              >
                Sign In
              </button>
            </Unauthenticated>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-start justify-center p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </main>

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
            <SignInForm />
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

type PageType = "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string };

interface ContentProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

function Content({ currentPage, setCurrentPage }: ContentProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  // Show homepage for unauthenticated users or when explicitly requested
  if (currentPage === "homepage") {
    return <Homepage setCurrentPage={setCurrentPage} />;
  }

  // Show vendor page
  if (typeof currentPage === "object" && currentPage.type === "vendor") {
    return <VendorPage vendorId={currentPage.vendorId} setCurrentPage={setCurrentPage} />;
  }

  // Show my orders page
  if (currentPage === "my-orders") {
    return <MyOrders setCurrentPage={setCurrentPage} />;
  }

  // Show vendor orders page
  if (currentPage === "vendor-orders") {
    return <VendorOrders setCurrentPage={setCurrentPage} />;
  }

  // Show admin dashboard
  if (currentPage === "admin") {
    return <AdminDashboard setCurrentPage={setCurrentPage} />;
  }

  // Show loading for authenticated pages
  if (loggedInUser === undefined || userProfile === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Unauthenticated>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">Cater-Plateful</h1>
          <p className="text-xl text-gray-600 mb-2">Your Premier Catering Marketplace</p>
          <p className="text-lg text-gray-500">Connect customers with amazing catering vendors</p>
        </div>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        {userProfile === null ? (
          <ProfileSelect />
        ) : (
          <>
            {userProfile.type === "vendor" && (
              <nav className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === "dashboard"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage("menu")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === "menu"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Menu Management
                  </button>
                  <button
                    onClick={() => setCurrentPage("vendor-orders")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${(currentPage as any) === "vendor-orders"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Orders
                  </button>
                </div>
              </nav>
            )}

            {currentPage === "dashboard" ? (
              <Dashboard userProfile={userProfile} setCurrentPage={setCurrentPage} />
            ) : currentPage === "menu" ? (
              <MenuManagement userProfile={userProfile} />
            ) : (currentPage as any) === "vendor-orders" ? (
              <VendorOrders setCurrentPage={setCurrentPage} />
            ) : null}
          </>
        )}
      </Authenticated>
    </div>
  );
}
