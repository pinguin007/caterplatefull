import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

interface CheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function Checkout({ onClose, onSuccess }: CheckoutProps) {
  const { state, clearCart, getSubtotal } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const userProfile = useQuery(api.profiles.getCurrentUserProfile);
  const placeOrder = useMutation(api.orders.placeOrder);

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    const formData = new FormData(e.currentTarget);
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const deliveryDate = formData.get("deliveryDate") as string;
    const headcount = parseInt(formData.get("headcount") as string);

    try {
      await placeOrder({
        vendorId: state.vendorId!,
        deliveryAddress,
        deliveryDate,
        headcount,
        totalPrice: getSubtotal(),
        items: state.items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      toast.success("Order placed successfully!");
      clearCart();
      onSuccess();
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!userProfile || userProfile.type !== "customer") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="card max-w-md w-full p-8 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Access Required</h2>
          <p className="text-neutral-600 mb-8 leading-relaxed">Please sign in as a customer to place orders.</p>
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-warm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-neutral-900">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {state.vendorName && (
            <p className="text-sm text-neutral-600 mt-2 font-medium">📍 Order from {state.vendorName}</p>
          )}
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-display font-bold text-neutral-900 mb-4">Order Summary</h3>
            <div className="bg-gradient-warm rounded-xl p-5 space-y-3 border border-primary-100">
              {state.items.map((item) => (
                <div key={item.menuItemId} className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-neutral-900">{item.name}</span>
                    <span className="text-neutral-600 ml-2">×{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-lg text-neutral-900">Total:</span>
                <span className="font-black text-2xl text-primary-600">${getSubtotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-semibold text-neutral-700 mb-2">
                Delivery Address *
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                required
                rows={3}
                className="input resize-none"
                placeholder="Enter the full delivery address..."
              />
            </div>

            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-semibold text-neutral-700 mb-2">
                Delivery Date *
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                required
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="headcount" className="block text-sm font-semibold text-neutral-700 mb-2">
                Expected Headcount *
              </label>
              <input
                type="number"
                id="headcount"
                name="headcount"
                required
                min="1"
                className="input"
                placeholder="Number of people to serve"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="btn btn-primary flex-1 bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Placing Order...
                  </>
                ) : (
                  "✓ Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
