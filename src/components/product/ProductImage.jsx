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
          : "w-full h-40 mb-4 rounded-lg overflow-hidden border border-[#232a32] bg-[#20272a] shadow-sm flex items-center justify-center"
      }
    >
      <img
        src={imgSrc}
        alt={product?.name || "Product"}
        className="w-full h-full object-cover"
        draggable={false}
        onError={e => { e.target.src = "/images/no-image.png"; }}
      />
    </div>
  );
}

export default ProductImage;