import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderSummary() {
  const { state: cartState, applyCoupon } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Simple coupon validation - in real app this would be API call
    const validCoupons: Record<string, number> = {
      'SAVE5': 5,
      'DISCOUNT10': 10,
      'WELCOME': 15
    };
    
    const discount = validCoupons[couponCode.toUpperCase()];
    if (discount) {
      applyCoupon(couponCode);
      setCouponMessage('Coupon applied successfully!');
    } else {
      setCouponMessage('Invalid coupon code');
    }
    
    setTimeout(() => setCouponMessage(''), 3000);
    setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    // Placeholder for checkout functionality
    alert('Proceeding to checkout... (Not implemented in this demo)');
  };

  const discountAmount = cartState.subtotal * (cartState.discount / 100);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
        Order Summary
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            ${cartState.subtotal.toFixed(2)}
          </span>
        </div>
        
        {cartState.discount > 0 && (
          <div className="flex justify-between">
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discount ({cartState.discount}%)
            </span>
            <span className="text-green-500">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            ${cartState.shipping.toFixed(2)}
          </span>
        </div>
        
        <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
        
        <div className="flex justify-between text-lg font-bold">
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Grand Total</span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
            ${cartState.grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          <button
            onClick={handleApplyCoupon}
            className={`px-4 py-2 rounded-md transition-colors ${
              darkMode
                ? 'bg-gray-600 hover:bg-gray-500 text-light'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Apply
          </button>
        </div>
        
        {couponMessage && (
          <p className={`mt-2 text-sm ${
            couponMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}>
            {couponMessage}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          className={`w-full px-4 py-2 rounded-md transition-colors ${
            darkMode
              ? 'bg-gray-600 hover:bg-gray-500 text-light'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Update Cart
        </button>
        
        <button
          onClick={handleProceedToCheckout}
          disabled={cartState.itemCount === 0}
          className={`w-full px-4 py-3 rounded-md font-semibold transition-colors ${
            cartState.itemCount > 0
              ? 'bg-primary hover:bg-accent text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}