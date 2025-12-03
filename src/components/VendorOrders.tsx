import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface VendorOrdersProps {
  setCurrentPage: (page: "homepage" | "dashboard" | "menu" | "my-orders" | "vendor-orders" | "admin" | { type: "vendor"; vendorId: string }) => void;
}

export function VendorOrders({ setCurrentPage }: VendorOrdersProps) {
  const orders = useQuery(api.orders.getVendorOrders);
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  if (userProfile === undefined || orders === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!userProfile || userProfile.type !== "vendor") {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">🔒</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Access Denied</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            This page is only available to vendors. Please sign in with a vendor account.
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

  if (!userProfile.profile.isApproved) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="card p-10">
          <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-5xl">⏳</div>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Account Pending Approval</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            You'll be able to manage orders once your vendor account is approved.
          </p>
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (orderId: Id<"orders">, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error("Failed to update order status. Please try again.");
      console.error(error);
    }
  };

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

  const statusOptions = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-10 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-5xl font-black text-neutral-900 mb-3">
            Incoming <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-xl text-neutral-600">Manage your catering orders and update their status</p>
        </div>
        <button
          onClick={() => setCurrentPage("dashboard")}
          className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-20 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl">📋</div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 mb-4">No Orders Yet</h3>
          <p className="text-neutral-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            You haven't received any catering orders yet. Make sure your menu is set up to start receiving orders!
          </p>
          <button
            onClick={() => setCurrentPage("menu")}
            className="btn btn-primary"
          >
            Manage Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order._id} className="card p-6 md:p-8 hover:shadow-2xl transition-all animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">
                    Order from {order.customer?.organizationName || "Unknown Customer"}
                  </h3>
                  <p className="text-neutral-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Placed on {new Date(order._creationTime).toLocaleDateString()} at {new Date(order._creationTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-base px-4 py-2 ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="input text-sm py-2 px-3"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-neutral-50 rounded-xl p-5">
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-28">Organization:</span>
                      <span className="text-neutral-600">{order.customer?.organizationName || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-28">Phone:</span>
                      <span className="text-neutral-600">{order.customer?.phoneNumber || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-5">
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center">
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
                      <span className="font-semibold text-neutral-700 w-24">Headcount:</span>
                      <span className="text-neutral-600">{order.headcount} people</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-neutral-700 w-24">Address:</span>
                      <span className="text-neutral-600">{order.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-warm rounded-xl p-5 border border-accent-100">
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Total
                  </h4>
                  <p className="text-3xl font-black text-accent-600">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-5">
                <h4 className="font-bold text-neutral-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Items
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-neutral-200">
                      <div>
                        <span className="font-semibold text-neutral-900">{item.name}</span>
                        <span className="text-neutral-600 ml-2">×{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
