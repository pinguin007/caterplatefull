import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Id } from '../../convex/_generated/dataModel';

export interface CartItem {
  menuItemId: Id<"menuItems">;
  name: string;
  price: number;
  quantity: number;
  vendorId: Id<"vendors">;
  vendorName: string;
}

interface CartState {
  items: CartItem[];
  vendorId: Id<"vendors"> | null;
  vendorName: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: Id<"menuItems"> }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: Id<"menuItems">; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_VENDOR'; payload: { vendorId: Id<"vendors">; vendorName: string } };

const initialState: CartState = {
  items: [],
  vendorId: null,
  vendorName: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_VENDOR':
      return {
        ...state,
        vendorId: action.payload.vendorId,
        vendorName: action.payload.vendorName,
      };
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.menuItemId === action.payload.menuItemId);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.menuItemId === action.payload.menuItemId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.menuItemId !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.menuItemId !== action.payload.menuItemId),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.menuItemId === action.payload.menuItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: Id<"menuItems">) => void;
  updateQuantity: (menuItemId: Id<"menuItems">, quantity: number) => void;
  clearCart: () => void;
  setVendor: (vendorId: Id<"vendors">, vendorName: string) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (menuItemId: Id<"menuItems">) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItemId });
  };

  const updateQuantity = (menuItemId: Id<"menuItems">, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setVendor = (vendorId: Id<"vendors">, vendorName: string) => {
    dispatch({ type: 'SET_VENDOR', payload: { vendorId, vendorName } });
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setVendor,
      getSubtotal,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
