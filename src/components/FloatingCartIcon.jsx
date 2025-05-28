// src/components/FloatingCartIcon.jsx
import React from "react";
import { ShoppingBag } from "lucide-react";

const FloatingCartIcon = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default FloatingCartIcon;
