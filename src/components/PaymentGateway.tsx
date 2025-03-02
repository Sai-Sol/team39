import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, CheckCircle, Clock, AlertTriangle, CreditCard, Building, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { verifyPaymentHash } from '../utils/security';

// Solana wallet address for payment
const SOLANA_ADDRESS = "8cdcxambJVYVXVGbQrRhFVaGs1QwhtztBEToBEyHW7Vr";

// Bank account details
const BANK_DETAILS = {
  accountName: "ShopSecure Payments Ltd",
  accountNumber: "1234567890",
  ifscCode: "HDFC0001234",
  bankName: "HDFC Bank"
};

interface PaymentGatewayProps {
  orderId: string;
  paymentMethod: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ orderId, paymentMethod }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min timer
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });
  const navigate = useNavigate();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          if (!paymentConfirmed) {
            setError("Payment time expired. Please try again.");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, paymentConfirmed]);

  // Redirect after successful payment
  useEffect(() => {
    if (paymentConfirmed) {
      const timer = setTimeout(() => {
        navigate('/success', { 
          state: { 
            orderId, 
            transactionHash,
            paymentMethod
          } 
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentConfirmed, navigate, orderId, transactionHash, paymentMethod]);

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle manual verification
  const handleVerifyPayment = () => {
    if (paymentMethod === "Card") {
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        setError("Please fill in all card details");
        return;
      }
      
      if (cardDetails.cardNumber.length < 16) {
        setError("Invalid card number");
        return;
      }
      
      if (cardDetails.cvv.length < 3) {
        setError("Invalid CVV");
        return;
      }
    } else if (paymentMethod === "Crypto" && !transactionHash) {
      setError("Please enter a transaction hash/ID");
      return;
    } else if (paymentMethod === "Bank" && !transactionHash) {
      setError("Please enter a UTR/Reference number");
      return;
    }
    
    setLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      // In a real app, this would verify with the payment gateway
      const isValid = paymentMethod === "Card" || verifyPaymentHash(transactionHash, orderId);
      
      if (isValid) {
        setPaymentConfirmed(true);
      } else {
        setError(`Invalid ${paymentMethod === "Card" ? "card details" : "transaction"}. Please check and try again.`);
      }
      
      setLoading(false);
    }, 1500);
  };

  // Get timer status color
  const getTimerStatusColor = () => {
    if (timeLeft > 180) return 'text-green-500';
    if (timeLeft > 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle card detail changes
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  // Render payment method specific UI
  const renderPaymentMethodUI = () => {
    switch (paymentMethod) {
      case "Crypto":
        return (
          <>
            {/* Wallet Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send payment to this Solana address:
              </label>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-l-lg p-3 font-mono text-sm overflow-x-auto">
                  {SOLANA_ADDRESS}
                </div>
                <button 
                  onClick={() => copyToClipboard(SOLANA_ADDRESS)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-r-lg transition-colors duration-200"
                >
                  {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or scan this QR code:
              </label>
              <div className="bg-white border border-gray-300 rounded-lg p-4 flex justify-center" onClick={() => copyToClipboard(SOLANA_ADDRESS)}>
                <QRCodeCanvas 
                  value={`solana:${SOLANA_ADDRESS}?amount=16499`} 
                  size={180} 
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">Tap QR code to copy address</p>
            </div>
            
            {/* Transaction Hash Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Transaction Hash/ID:
              </label>
              <input
                type="text"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="e.g. 4Gw6FJXdiVQhUiWHEXZwFzSJqFZoJkJUEi..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      
      case "Bank":
        return (
          <>
            {/* Bank Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Transfer Details</h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Name:</span>
                  <span className="text-sm font-medium">{BANK_DETAILS.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Number:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{BANK_DETAILS.accountNumber}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IFSC Code:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{BANK_DETAILS.ifscCode}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_DETAILS.ifscCode)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bank:</span>
                  <span className="text-sm font-medium">{BANK_DETAILS.bankName}</span>
                </div>
              </div>
            </div>
            
            {/* Reference Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter UTR/Reference Number:
              </label>
              <input
                type="text"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="e.g. UTR123456789"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      
      case "Card":
        return (
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Card Payment</h3>
            
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Card Holder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Holder Name
              </label>
              <input
                type="text"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleCardChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  PCI DSS Compliant
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  256-bit Encryption
                </span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "Crypto":
        return <Wallet className="h-6 w-6 text-white" />;
      case "Bank":
        return <Building className="h-6 w-6 text-white" />;
      case "Card":
        return <CreditCard className="h-6 w-6 text-white" />;
      default:
        return null;
    }
  };

  // Get payment method title
  const getPaymentMethodTitle = () => {
    switch (paymentMethod) {
      case "Crypto":
        return "Cryptocurrency Payment";
      case "Bank":
        return "Bank Transfer Payment";
      case "Card":
        return "Card Payment";
      default:
        return "Payment";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <div className="flex items-center">
          {getPaymentMethodIcon()}
          <div className="ml-3">
            <h2 className="text-xl font-bold">{getPaymentMethodTitle()}</h2>
            <p className="text-indigo-100 mt-1">Complete your payment within the time limit</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Timer */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">Time remaining:</span>
          </div>
          <div className={`text-xl font-bold ${getTimerStatusColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Payment Gateway Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Gateways</h3>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-5 w-5 mr-2" />
                  <span className="font-medium">Razorpay</span>
                </div>
                <span className="text-sm text-gray-600">Fee: 2% + ₹3</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="https://cashfree.com/images/favicon.ico" alt="Cashfree" className="h-5 w-5 mr-2" />
                  <span className="font-medium">Cashfree</span>
                </div>
                <span className="text-sm text-gray-600">Fee: 1.9% + ₹4</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="https://paytm.com/favicon.ico" alt="Paytm" className="h-5 w-5 mr-2" />
                  <span className="font-medium">Paytm</span>
                </div>
                <span className="text-sm text-gray-600">Fee: 2.1% + ₹2</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Instructions</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            {paymentMethod === "Crypto" && (
              <>
                <li>Copy the Solana wallet address or scan the QR code</li>
                <li>Open your crypto wallet app and send the exact amount</li>
                <li>Enter the transaction ID/hash below to verify payment</li>
                <li>Wait for confirmation (usually takes 1-2 minutes)</li>
              </>
            )}
            {paymentMethod === "Bank" && (
              <>
                <li>Use your bank's app or website to make a transfer</li>
                <li>Send the exact amount to the account details provided</li>
                <li>Enter the UTR/Reference number below to verify payment</li>
                <li>Wait for confirmation (usually takes a few minutes)</li>
              </>
            )}
            {paymentMethod === "Card" && (
              <>
                <li>Enter your card details in the form below</li>
                <li>Ensure the billing address matches your card</li>
                <li>Your card will be charged the exact amount</li>
                <li>Wait for confirmation from your bank</li>
              </>
            )}
          </ol>
        </div>
        
        {/* Payment Method Specific UI */}
        {renderPaymentMethodUI()}
        
        {/* Verify Button */}
        <button
          onClick={handleVerifyPayment}
          disabled={loading || paymentConfirmed}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
            paymentConfirmed
              ? 'bg-green-600 text-white cursor-not-allowed'
              : loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {paymentConfirmed ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Payment Verified
            </>
          ) : loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            `Complete ${paymentMethod === "Card" ? "Payment" : "Verification"}`
          )}
        </button>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* Success Message */}
        {paymentConfirmed && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Payment Successful!</p>
              <p className="text-xs text-green-600 mt-1">Redirecting to order confirmation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;