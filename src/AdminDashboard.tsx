import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

interface AdminDashboardProps {
  setCurrentPage: (page: any) => void;
}

export function AdminDashboard({ setCurrentPage }: AdminDashboardProps) {
  const vendors = useQuery(api.admin.adminGetAllVendors);
  const recentOrders = useQuery(api.admin.adminGetRecentOrders);
  const approveVendor = useMutation(api.admin.adminApproveVendor);
  const resolveDispute = useMutation(api.admin.adminResolveDispute);
  const createAdmin = useMutation(api.admin.createAdmin);

  const handleCreateAdmin = async () => {
    try {
      await createAdmin({});
      toast.success("Admin privileges granted successfully!");
    } catch (error: any) {
      if (error.message?.includes("already an admin")) {
        toast.error("You already have admin privileges.");
      } else {
        toast.error("Failed to create admin. Please try again.");
      }
      console.error(error);
    }
  };

  const handleApproveVendor = async (vendorId: Id<"vendors">) => {
    try {
      const result = await approveVendor({ vendorId });
      toast.success(`Vendor ${result.newStatus ? 'approved' : 'unapproved'} successfully!`);
    } catch (error) {
      toast.error("Failed to update vendor status. Please try again.");
      console.error(error);
    }
  };

  const handleResolveDispute = async (orderId: Id<"orders">) => {
    try {
      await resolveDispute({ orderId });
      toast.success("Order dispute resolved successfully!");
    } catch (error) {
      toast.error("Failed to resolve dispute. Please try again.");
      console.error(error);
    }
  };

  // Show loading state
  if (vendors === undefined || recentOrders === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state if queries failed (likely due to lack of admin access)
  if (vendors === null || recentOrders === null) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need admin privileges to access this page. Click the button below to grant yourself admin access for testing purposes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCreateAdmin}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
          >
            Grant Admin Access
          </button>
          <button
            onClick={() => setCurrentPage("homepage")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage vendors and oversee platform operations</p>
        </div>
        <button
          onClick={() => setCurrentPage("homepage")}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Homepage
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Vendor Management Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendor Management</h2>
          
          {vendors.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No vendors found.</p>
          ) : (
            <ul className="space-y-4">
              {vendors.map((vendor) => (
                <li key={vendor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{vendor.restaurantName}</h3>
                    <p className="text-sm text-gray-600">Owner: {vendor.userName}</p>
                    <p className="text-sm text-gray-500">{vendor.userEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      vendor.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.isApproved ? '✅ Approved' : '⏳ Pending'}
                    </span>
                    <button
                      onClick={() => handleApproveVendor(vendor._id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        vendor.isApproved
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {vendor.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order Oversight Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Oversight</h2>
          <p className="text-sm text-gray-600 mb-4">10 most recent orders</p>
          
          {recentOrders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {recentOrders.map((order) => (
                <li key={order._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                      <p className="text-sm text-gray-600">Vendor: {order.vendorName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order._creationTime).toLocaleDateString()} • ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.status !== 'resolved' && order.status !== 'delivered' && (
                        <button
                          onClick={() => handleResolveDispute(order._id)}
                          className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Vendors</h3>
          <p className="text-3xl font-bold text-blue-600">{vendors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Vendors</h3>
          <p className="text-3xl font-bold text-green-600">
            {vendors.filter(v => v.isApproved).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {vendors.filter(v => !v.isApproved).length}
          </p>
        </div>
      </div>
    </div>
  );
}
