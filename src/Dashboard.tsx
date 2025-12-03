import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface DashboardProps {
  userProfile: {
    type: "customer" | "vendor";
    profile: any;
  };
  setCurrentPage: (page: "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string }) => void;
}

export function Dashboard({ userProfile, setCurrentPage }: DashboardProps) {
  if (userProfile.type === "customer") {
    return <CustomerDashboard userProfile={userProfile} setCurrentPage={setCurrentPage} />;
  } else {
    return <VendorDashboard userProfile={userProfile} setCurrentPage={setCurrentPage} />;
  }
}

function CustomerDashboard({ userProfile, setCurrentPage }: DashboardProps) {
  const customerOrders = useQuery(api.orders.getCustomerOrders);
  const recentOrders = customerOrders?.slice(0, 3) || [];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Welcome Card */}
      <div className="card p-6 md:p-8 mb-6 md:mb-8 bg-gradient-warm border-none animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-2 md:mb-3">Welcome back!</h1>
        <div className="space-y-2">
          <p className="text-neutral-700 text-lg">
            <span className="font-semibold">Organization:</span>{" "}
            <span className="text-primary-600 font-bold">{userProfile.profile.organizationName}</span>
          </p>
          <p className="text-neutral-700">
            <span className="font-semibold">Phone:</span>{" "}
            <span className="font-mono">{userProfile.profile.phoneNumber}</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 animate-slide-up">
        <div className="card-interactive p-6 group">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Browse Vendors</h3>
          <p className="text-neutral-600 mb-4 text-sm">Find the perfect catering for your event</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("homepage");
            }}
            className="btn btn-primary w-full"
          >
            Browse Now
          </a>
        </div>

        <div className="card text-center p-4 md:p-6 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-700 mb-2">Total Orders</h3>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-accent-600 mb-1">{customerOrders?.length || 0}</p>
          <p className="text-neutral-500 text-xs sm:text-sm">Orders placed</p>
        </div>

        <div className="card-interactive p-6 group">
          <div className="w-14 h-14 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Recent Activity</h3>
          <p className="text-neutral-600 mb-4 text-sm">Your latest catering orders</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("my-orders");
            }}
            className="btn btn-secondary w-full"
          >
            View All Orders
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="card p-4 md:p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 md:mb-6">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-900 mb-1">{order.vendor?.restaurantName}</h4>
                  <p className="text-sm text-neutral-600">
                    {new Date(order._creationTime).toLocaleDateString()} • ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                  order.status === 'pending' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VendorDashboard({ userProfile, setCurrentPage }: DashboardProps) {
  const vendorOrders = useQuery(api.orders.getVendorOrders);
  const recentOrders = vendorOrders?.slice(0, 5) || [];
  const pendingOrders = vendorOrders?.filter((order: any) => order.status === 'pending').length || 0;
  const totalRevenue = vendorOrders?.reduce((sum: number, order: any) => sum + order.totalPrice, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Vendor Info Card */}
      <div className="card p-8 mb-8 bg-gradient-warm border-none animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-2 md:mb-3">
              {userProfile.profile.restaurantName}
            </h1>
            <p className="text-neutral-700 mb-2 md:mb-3 text-base md:text-lg">{userProfile.profile.description}</p>
            <div className="flex items-center text-neutral-600">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{userProfile.profile.address}</span>
            </div>
          </div>
          <div>
            {userProfile.profile.isApproved ? (
              <span className="badge badge-success text-base px-4 py-2">
                ✅ Approved
              </span>
            ) : (
              <span className="badge badge-warning text-base px-4 py-2">
                ⏳ Pending Approval
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Approval Alert */}
      {!userProfile.profile.isApproved && (
        <div className="card p-6 mb-8 bg-primary-50 border-primary-200 animate-slide-up">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-900 mb-2">Account Under Review</h3>
              <p className="text-primary-700">
                Your vendor account is currently being reviewed by our team. You'll be able to access all vendor features once approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="card text-center p-4 md:p-6 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-700 mb-2">Pending Orders</h3>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-600 mb-1">{pendingOrders}</p>
          <p className="text-neutral-500 text-xs sm:text-sm">Awaiting confirmation</p>
        </div>

        <div className="card text-center p-4 md:p-6 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-700 mb-2">Total Orders</h3>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary-600 mb-1">{vendorOrders?.length || 0}</p>
          <p className="text-neutral-500 text-xs sm:text-sm">All time</p>
        </div>

        <div className="card text-center p-4 md:p-6 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-700 mb-2">Total Revenue</h3>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-accent-600 mb-1">${totalRevenue.toFixed(2)}</p>
          <p className="text-neutral-500 text-xs sm:text-sm">All time</p>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="card p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">Recent Orders</h3>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage("vendor-orders" as any);
              }}
              className="text-primary-600 hover:text-primary-700 font-bold text-sm inline-flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-900 mb-1">{order.customer?.organizationName}</h4>
                  <p className="text-sm text-neutral-600">
                    {new Date(order._creationTime).toLocaleDateString()} • {order.headcount} people • ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                  order.status === 'pending' ? 'badge-warning' :
                    order.status === 'confirmed' ? 'badge-info' :
                      order.status === 'preparing' ? 'badge-warning' :
                        'bg-neutral-100 text-neutral-800'
                  }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
