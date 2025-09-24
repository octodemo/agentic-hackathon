import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              🛒
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h1>
              <button
                onClick={clearCart}
                className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} text-sm transition-colors`}
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item: CartItem) => {
                const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                return (
                  <div
                    key={item.productId}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm transition-colors duration-300`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg p-2 w-24 h-24 flex-shrink-0`}>
                        <img
                          src={`/${item.imgName}`}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          {item.discount ? (
                            <>
                              <span className="text-gray-500 line-through text-sm">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary font-bold">
                                ${itemPrice.toFixed(2)}
                              </span>
                              <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                                {Math.round(item.discount * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-bold">
                              ${itemPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <div className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} text-sm transition-colors mt-1`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm transition-colors duration-300 sticky top-24`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span>Total</span>
                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-4 text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
