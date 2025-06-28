import React from "react";

// Allows custom className for max flexibility
function ProductImage({ product, className }) {
  let imgSrc = "/images/no-image.png";
  if (product?.image) {
    if (product.image.startsWith("/images/")) {
      imgSrc = product.image;
    } else if (product.image.startsWith("images/")) {
      imgSrc = "/" + product.image;
    } else if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      imgSrc = product.image;
    }
  }
  return (
    <div
      className={
        className
          ? className // use parent className if provided (for big or grid)
          : "w-full h-40 mb-4 overflow-hidden border border-[#232a32] bg-[#20272a] shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
      }
      style={{ borderRadius: '20px' }}
    >
      <img
        src={imgSrc}
        alt={product?.name || "Product"}
        className="w-full h-full object-cover scale-105"
        style={{ borderRadius: '20px' }}
        draggable={false}
        onError={e => { e.target.src = "/images/no-image.png"; }}
      />
    </div>
  );
}

export default ProductImage;