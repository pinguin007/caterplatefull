import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MyOrdersProps {
  setCurrentPage: (page: "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string }) => void;
}

export function MyOrders({ setCurrentPage }: MyOrdersProps) {
  const orders = useQuery(api.orders.getCustomerOrders);
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  if (userProfile === undefined || orders === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!userProfile || userProfile.type !== "customer") {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">🔒</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Access Denied</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            This page is only available to customers. Please sign in with a customer account.
          </p>
          <button
            onClick={() => setCurrentPage("homepage")}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
      case 'preparing':
      case 'ready':
        return 'badge-info';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-10 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-5xl font-black text-neutral-900 mb-3">
            My <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-xl text-neutral-600">Track your catering orders and order history</p>
        </div>
        <button
          onClick={() => setCurrentPage("homepage")}
          className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Homepage
        </button>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="card text-center py-20 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl">📋</div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-4">No Orders Yet</h3>
          <p className="text-neutral-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            You haven't placed any catering orders yet. Browse our vendors to get started!
          </p>
          <button
            onClick={() => setCurrentPage("homepage")}
            className="btn btn-primary"
          >
            Browse Vendors
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="card p-6 md:p-8 hover:shadow-2xl transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">
                    {order.vendor?.restaurantName || "Unknown Vendor"}
                  </h3>
                  <p className="text-neutral-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ordered on {new Date(order._creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`badge text-base px-4 py-2 ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                {/* Delivery Details */}
                <div className="bg-neutral-50 rounded-xl p-5">
                  <h4 className="font-bold text-neutral-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-24">Date:</span>
                      <span className="text-neutral-600">{order.deliveryDate}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-24">Address:</span>
                      <span className="text-neutral-600">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-24">Headcount:</span>
                      <span className="text-neutral-600">{order.headcount} people</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-neutral-50 rounded-xl p-5">
                  <h4 className="font-bold text-neutral-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-neutral-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-neutral-900 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-neutral-200">
                    <span className="font-bold text-neutral-900 text-lg">Total:</span>
                    <span className="font-black text-primary-600 text-xl">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Location */}
              {order.vendor?.address && (
                <div className="bg-gradient-warm rounded-xl p-4 flex items-start">
                  <svg className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Vendor Location</h4>
                    <p className="text-neutral-700">{order.vendor.address}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
