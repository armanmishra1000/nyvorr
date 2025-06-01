import React from "react";

function ProductImage({ product }) {
  let imgSrc = "/images/no-image.png";
  if (product.image) {
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
    <div className="w-full h-40 mb-4 rounded-lg overflow-hidden border border-[#232a32] bg-[#20272a] shadow-sm flex items-center justify-center">
      <img
        src={imgSrc}
        alt={product.name}
        className="w-full h-full object-cover"
        draggable={false}
        onError={e => { e.target.src = "/images/no-image.png"; }}
      />
    </div>
  );
}

export default ProductImage;