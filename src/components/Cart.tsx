import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Checkout } from './Checkout';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { state, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  const handleCheckout = () => {
    if (!userProfile) {
      return;
    }
    
    if (userProfile.type !== "customer") {
      return;
    }
    
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
        <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 bg-gradient-warm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-neutral-900">Your Order</h2>
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
              <p className="text-sm text-neutral-600 mt-2 font-medium">📍 From {state.vendorName}</p>
            )}
          </div>

          {/* Cart Content */}
          <div className="flex-1 p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-warm rounded-full flex items-center justify-center">
                  <span className="text-5xl">🛒</span>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">Your cart is empty</h3>
                <p className="text-neutral-600 max-w-xs mx-auto leading-relaxed">
                  Add some delicious items to get started!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div 
                      key={item.menuItemId} 
                      className="card p-4 border border-neutral-200 hover:border-primary-200 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-primary-600 font-medium">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                              className="w-8 h-8 rounded-md bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 hover:border-primary-300 transition-all font-semibold text-neutral-700"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold text-neutral-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                              className="w-8 h-8 rounded-md bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 hover:border-primary-300 transition-all font-semibold text-neutral-700"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.menuItemId)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-md"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="bg-gradient-warm rounded-xl p-5 mb-6 border border-primary-100">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral-700">Subtotal:</span>
                    <span className="text-2xl font-black text-primary-600">${getSubtotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={!userProfile || userProfile.type !== "customer"}
                    className="btn btn-primary w-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    {!userProfile ? "🔒 Sign in to Checkout" : 
                     userProfile.type !== "customer" ? "👤 Customer Account Required" : 
                     "✓ Proceed to Checkout"}
                  </button>
                  <button
                    onClick={clearCart}
                    className="btn btn-secondary w-full"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showCheckout && (
        <Checkout 
          onClose={() => setShowCheckout(false)} 
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}
