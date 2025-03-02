import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, Truck, Calendar, CreditCard, Building, Wallet } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const { orderId, transactionHash, paymentMethod } = location.state || {};
  
  // Generate a random delivery date (7-10 days from now)
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 4) + 7);
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get payment method icon and text
  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case "Crypto":
        return { icon: <Wallet className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />, text: "Cryptocurrency (Solana)" };
      case "Bank":
        return { icon: <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />, text: "Bank Transfer" };
      case "Card":
        return { icon: <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />, text: "Card Payment" };
      case "COD":
        return { icon: <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />, text: "Cash on Delivery" };
      default:
        return { icon: <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />, text: "Online Payment" };
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-green-600 p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Order Confirmed!</h1>
          <p className="text-green-100 mt-2">Your order has been successfully placed</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Order Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-900">{orderId ? orderId.substring(0, 12) + '...' : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{paymentInfo.text}</p>
                </div>
                {paymentMethod !== "COD" && (
                  <div>
                    <p className="text-sm text-gray-500">{paymentMethod === "Card" ? "Transaction ID" : "Transaction Hash"}</p>
                    <p className="font-medium text-gray-900 truncate">
                      {transactionHash ? transactionHash.substring(0, 12) + '...' : 'N/A'}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Product</h2>
            <div className="flex items-center border border-gray-200 rounded-lg p-4">
              <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-900">CMF By Nothing WATCH PRO 2</h3>
                <p className="text-sm text-gray-500">AMOLED, GPS, Bluetooth Calls - Dark Grey</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹16,499</p>
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Delivery Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start mb-4">
                <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Standard Delivery</p>
                  <p className="text-sm text-gray-500">Your order will be delivered in 7-10 business days</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Delivery Date</p>
                  <p className="text-sm text-gray-500">{getDeliveryDate()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;