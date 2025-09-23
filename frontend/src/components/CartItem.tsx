import { useCart, CartItem as CartItemType } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface CartItemProps {
  item: CartItemType;
  serialNumber: number;
}

export default function CartItem({ item, serialNumber }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === 0) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
      <td className="px-4 py-4 text-center">
        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
          {serialNumber.toString().padStart(2, '0')}
        </span>
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center justify-center">
          <img
            src={`/${item.imageUrl}`}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/copilot.png'; // Fallback image
            }}
          />
        </div>
      </td>
      
      <td className="px-4 py-4">
        <div>
          <h3 className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
            {item.name}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
            SKU: {item.sku}
          </p>
        </div>
      </td>
      
      <td className="px-4 py-4 text-center">
        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
          ${item.price.toFixed(2)}
        </span>
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            } transition-colors`}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <span aria-hidden="true">−</span>
          </button>
          
          <span
            className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}
            aria-label={`Quantity of ${item.name}`}
          >
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            } transition-colors`}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </td>
      
      <td className="px-4 py-4 text-center">
        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
          ${totalPrice.toFixed(2)}
        </span>
      </td>
      
      <td className="px-4 py-4 text-center">
        <button
          onClick={handleRemove}
          className={`p-2 rounded-full transition-colors ${
            darkMode
              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
              : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
          }`}
          aria-label={`Remove ${item.name} from cart`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}