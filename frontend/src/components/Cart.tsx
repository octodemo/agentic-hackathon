import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

export default function Cart() {
  const { state: cartState, clearCart } = useCart();
  const { darkMode } = useTheme();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <nav className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Cart</span>
          </nav>
          
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-24 w-24 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5a1 1 0 001 1h9.2a1 1 0 001-1L15 13H7z"
                />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your cart is empty
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Add some products to get started
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>Cart</span>
        </nav>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Shopping Cart ({cartState.itemCount} {cartState.itemCount === 1 ? 'item' : 'items'})
          </h1>
          
          <button
            onClick={handleClearCart}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              darkMode
                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-200'
            }`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        S.No
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Image
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Product Name
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Unit Price
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Quantity
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Total
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {cartState.items.map((item, index) => (
                      <CartItem 
                        key={item.productId} 
                        item={item} 
                        serialNumber={index + 1} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/products"
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-light'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}