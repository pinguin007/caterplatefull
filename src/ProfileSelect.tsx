import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSelect() {
  const [profileType, setProfileType] = useState<"customer" | "vendor" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCustomerProfile = useMutation(api.profiles.createCustomerProfile);
  const createVendorProfile = useMutation(api.profiles.createVendorProfile);

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const organizationName = formData.get("organizationName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;

    try {
      await createCustomerProfile({
        organizationName,
        phoneNumber,
      });
      toast.success("Customer profile created successfully! ✅");
      // Profile will automatically load and component will unmount
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const restaurantName = formData.get("restaurantName") as string;
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;
    const imageUrl = formData.get("imageUrl") as string;

    try {
      await createVendorProfile({
        restaurantName,
        description,
        address,
        imageUrl: imageUrl.trim() || undefined,
      });
      toast.success("Vendor profile created! ✅ Awaiting admin approval.");
      // Reload to update UI with new profile
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (!profileType) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Role</h2>
          <p className="text-gray-600 mb-8">
            Select how you'd like to use Cater-Plateful
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setProfileType("customer")}
              className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                I'm a Customer
              </h3>
              <p className="text-gray-600">
                I want to order catering for my organization or events
              </p>
            </button>

            <button
              onClick={() => setProfileType("vendor")}
              className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                I'm a Vendor
              </h3>
              <p className="text-gray-600">
                I want to offer catering services to customers
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (profileType === "customer") {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Profile</h2>
            <p className="text-gray-600">Tell us about your organization</p>
          </div>

          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Your company or organization name"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Your contact phone number"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setProfileType(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Profile</h2>
          <p className="text-gray-600">Tell us about your catering business</p>
        </div>

        <form onSubmit={handleVendorSubmit} className="space-y-4">
          <div>
            <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant/Business Name *
            </label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              required
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="Your restaurant or catering business name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow resize-none"
              placeholder="Describe your cuisine, specialties, and what makes your catering unique"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Business Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow resize-none"
              placeholder="Your business address"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="https://example.com/your-restaurant-image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add a photo of your restaurant, food, or logo to make your listing more appealing
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setProfileType(null)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Your vendor account will need to be approved by our team before you can start receiving orders.
          </p>
        </div>
      </div>
    </div>
  );
}
