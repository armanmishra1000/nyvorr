import React from "react";

function PriceDisplay({ originalPrice, coupon, discountedPrice }) {
  return (
    <div className="w-full mb-4">
      {coupon ? (
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Original:</span>
            <span className="text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span className="text-green-300">You Pay:</span>
            <span className="text-green-400 text-xl">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center font-bold">
          <span className="text-green-300">Price:</span>
          <span className="text-green-400 text-xl">
            ${originalPrice.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceDisplay;