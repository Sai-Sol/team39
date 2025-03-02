import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import PaymentGateway from './PaymentGateway';
import { generateOrderId, hashData } from '../utils/security';

const product = {
  id: 'cmf-watch-pro-2',
  name: "CMF By Nothing WATCH PRO 2, AMOLED, GPS, BLUETOOTH CALLS - Dark Grey",
  description: "A sleek and stylish smartwatch with health tracking features, GPS navigation, and Bluetooth calling capabilities. The AMOLED display provides vibrant colors and excellent visibility even in bright sunlight.",
  price: "₹16,499",
  originalPrice: "₹19,999",
  discount: "18% off",
  image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  features: [
    "1.96\" AMOLED Display",
    "Bluetooth Calling",
    "GPS Navigation",
    "Heart Rate & SpO2 Monitoring",
    "IP68 Water Resistant",
    "7-Day Battery Life"
  ]
};

interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  pincode: string;
  paymentMethod: string;
}

const ProductPage: React.FC = () => {
  const [cartAdded, setCartAdded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({ 
    name: "", 
    phone: "", 
    email: "",
    address: "", 
    city: "", 
    state: "", 
    landmark: "", 
    pincode: "", 
    paymentMethod: "" 
  });
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [secureOrderId, setSecureOrderId] = useState("");

  const handleAddToCart = () => {
    setCartAdded(true);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique order ID
    const orderId = generateOrderId();
    
    // Create a secure hash of the order details for verification
    const orderData = {
      orderId,
      product: product.id,
      price: product.price,
      customer: orderDetails.name,
      timestamp: new Date().toISOString()
    };
    
    // Hash the order data for security
    const secureHash = hashData(JSON.stringify(orderData));
    setSecureOrderId(secureHash);
    
    if (orderDetails.paymentMethod !== "COD") {
      setShowPaymentGateway(true);
    } else {
      alert("Order placed successfully with Cash on Delivery option!");
      setShowForm(false);
      setCartAdded(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {!showPaymentGateway ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image and Details */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-96 object-cover object-center"
              />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <div className="mt-2 flex items-center">
                      <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                      <p className="ml-2 text-sm line-through text-gray-500">{product.originalPrice}</p>
                      <p className="ml-2 text-sm font-medium text-green-600">{product.discount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600">(128 reviews)</span>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600">{product.description}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Features</h3>
                  <ul className="mt-2 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium ${
                    cartAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors duration-200`}
                  onClick={handleAddToCart}
                  disabled={cartAdded}
                >
                  {cartAdded ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
                  {cartAdded ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Form */}
          {showForm && (
            <div className="md:w-1/2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Enter Shipping Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={orderDetails.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={orderDetails.phone} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={orderDetails.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={orderDetails.address} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={orderDetails.city} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={orderDetails.state} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                      <input 
                        type="text" 
                        name="landmark" 
                        value={orderDetails.landmark} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input 
                        type="text" 
                        name="pincode" 
                        value={orderDetails.pincode} 
                        onChange={handleChange} 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select 
                      name="paymentMethod" 
                      value={orderDetails.paymentMethod} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="COD">Cash on Delivery</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Card">Card Payment</option>
                      <option value="Crypto">Cryptocurrency</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      Proceed to Payment
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <PaymentGateway orderId={secureOrderId} paymentMethod={orderDetails.paymentMethod} />
      )}
    </div>
  );
};

export default ProductPage;