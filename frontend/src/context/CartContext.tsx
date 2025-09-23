/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  itemCount: number;
  couponCode?: string;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Omit<CartItem, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: { couponCode: string; discount: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHIPPING'; payload: { shipping: number } }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState };

const calculateTotals = (items: CartItem[], discount: number, shipping: number) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const grandTotal = subtotal - discountAmount + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { subtotal, grandTotal, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.productId === action.payload.product.productId);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.product.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload.product, quantity: action.payload.quantity }];
      }
      
      const { subtotal, grandTotal, itemCount } = calculateTotals(newItems, state.discount, state.shipping);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        grandTotal,
        itemCount
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.payload.productId);
      const { subtotal, grandTotal, itemCount } = calculateTotals(newItems, state.discount, state.shipping);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        grandTotal,
        itemCount
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const { subtotal, grandTotal, itemCount } = calculateTotals(newItems, state.discount, state.shipping);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        grandTotal,
        itemCount
      };
    }
    
    case 'APPLY_COUPON': {
      const { subtotal, grandTotal, itemCount } = calculateTotals(state.items, action.payload.discount, state.shipping);
      
      return {
        ...state,
        discount: action.payload.discount,
        couponCode: action.payload.couponCode,
        grandTotal,
        subtotal,
        itemCount
      };
    }
    
    case 'SET_SHIPPING': {
      const { subtotal, grandTotal, itemCount } = calculateTotals(state.items, state.discount, action.payload.shipping);
      
      return {
        ...state,
        shipping: action.payload.shipping,
        grandTotal,
        subtotal,
        itemCount
      };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 10,
        grandTotal: 10,
        itemCount: 0,
        couponCode: undefined
      };
    }
    
    case 'LOAD_FROM_STORAGE': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 10,
  grandTotal: 10,
  itemCount: 0,
  couponCode: undefined
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyCoupon: (couponCode: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const applyCoupon = (couponCode: string) => {
    // Simple coupon validation - in real app this would be API call
    const validCoupons: Record<string, number> = {
      'SAVE5': 5,
      'DISCOUNT10': 10,
      'WELCOME': 15
    };
    
    const discount = validCoupons[couponCode.toUpperCase()];
    if (discount) {
      dispatch({ type: 'APPLY_COUPON', payload: { couponCode, discount } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}