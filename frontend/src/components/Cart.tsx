import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, itemCount, subtotal, discount, shipping, total, updateQuantity, removeItem, clearCart } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [updatingQuantity, setUpdatingQuantity] = useState<number | null>(null);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdatingQuantity(productId);
    updateQuantity(productId, newQuantity);
    setTimeout(() => setUpdatingQuantity(null), 300);
  };

  const handleApplyCoupon = () => {
    // Simple coupon validation - in a real app this would be an API call
    if (couponCode.toLowerCase() === 'save10') {
      setCouponError('');
      // This would normally apply a discount, but for now just show feedback
      alert('Coupon applied successfully! (Feature coming soon)');
    } else if (couponCode.trim()) {
      setCouponError('Invalid coupon code');
    }
  };

  const getItemPrice = (item: typeof items[0]) => {
    return item.product.discount 
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg 
                className="mx-auto h-24 w-24 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" 
                />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Your Cart is Empty
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h1>
              <button 
                onClick={clearCart}
                className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors duration-300`}
              >
                Clear Cart
              </button>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              {/* Table Header - Hidden on mobile */}
              <div className={`hidden md:grid md:grid-cols-12 gap-4 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`}>
                <div className="col-span-1 text-sm font-medium">S. No.</div>
                <div className="col-span-2 text-sm font-medium">Image</div>
                <div className="col-span-3 text-sm font-medium">Product</div>
                <div className="col-span-2 text-sm font-medium">Unit Price</div>
                <div className="col-span-2 text-sm font-medium">Quantity</div>
                <div className="col-span-1 text-sm font-medium">Total</div>
                <div className="col-span-1 text-sm font-medium">Action</div>
              </div>

              {/* Cart Items */}
              {items.map((item, index) => (
                <div key={item.product.productId} className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} last:border-b-0 transition-colors duration-300`}>
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{index + 1}</span>
                    </div>
                    <div className="col-span-2">
                      <img 
                        src={`/${item.product.imgName}`} 
                        alt={item.product.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        {item.product.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                        SKU: {item.product.sku}
                      </p>
                    </div>
                    <div className="col-span-2">
                      {item.product.discount ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm">${item.product.price.toFixed(2)}</span>
                          <span className={`ml-2 font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            ${getItemPrice(item).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 w-fit transition-colors duration-300`}>
                        <button 
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                          disabled={updatingQuantity === item.product.productId}
                        >
                          -
                        </button>
                        <span className={`min-w-[2rem] text-center ${updatingQuantity === item.product.productId ? 'text-primary' : darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                          disabled={updatingQuantity === item.product.productId}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                        ${(getItemPrice(item) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <button 
                        onClick={() => removeItem(item.product.productId)}
                        className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors duration-300`}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-4">
                    <div className="flex space-x-4">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{index + 1}.</span>
                      <img 
                        src={`/${item.product.imgName}`} 
                        alt={item.product.name}
                        className="w-20 h-20 object-contain rounded"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                          SKU: {item.product.sku}
                        </p>
                        <div className="mt-2">
                          {item.product.discount ? (
                            <div>
                              <span className="text-gray-500 line-through text-sm">${item.product.price.toFixed(2)}</span>
                              <span className={`ml-2 font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                ${getItemPrice(item).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 transition-colors duration-300`}>
                        <button 
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                        >
                          -
                        </button>
                        <span className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          ${(getItemPrice(item) * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeItem(item.product.productId)}
                          className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors duration-300`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link 
                to="/products" 
                className={`px-6 py-3 rounded-lg border ${darkMode ? 'border-gray-600 text-light hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors duration-300 text-center`}
              >
                Continue Shopping
              </Link>
              <div className="flex flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:border-primary transition-colors duration-300`}
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
                >
                  Apply Coupon
                </button>
              </div>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Subtotal:</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Discount (5%):</span>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Shipping:</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                
                {subtotal > 100 && (
                  <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}>
                    🎉 You qualified for free shipping and 5% discount!
                  </div>
                )}
                
                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors duration-300`} />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Total:</span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors">
                Proceed to Checkout
              </button>
              
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4 text-center transition-colors duration-300`}>
                <p>Free shipping on orders over $100</p>
                <p>5% discount on orders over $100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}