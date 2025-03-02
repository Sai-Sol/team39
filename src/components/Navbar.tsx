import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl text-gray-800">ShopSecure</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-indigo-600">
            <User className="h-5 w-5" />
          </button>
          <div className="relative">
            <ShoppingBag className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;