// src/components/CartPopup.jsx
import React from "react";

const CartPopup = ({ visible }) => {
  return visible ? (
    <div className="fixed bottom-24 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
      Tuote lisätty ostoskoriin
    </div>
  ) : null;
};

export default CartPopup;