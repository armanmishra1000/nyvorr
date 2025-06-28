import React, { useState, useEffect } from "react";
import { getResponsiveImage, getProductImageSrc } from "../../utils/imageUtils";

// Allows custom className for max flexibility
function ProductImage({ product, className }) {
  const [imageSrc, setImageSrc] = useState('/images/no-image.png');
  const [imageSrcSet, setImageSrcSet] = useState('');
  const [imageSizes, setImageSizes] = useState('');

  useEffect(() => {
    if (product) {
      console.log('Product image data:', product.image);
      const imgSrc = getProductImageSrc(product);
      console.log('Processed image source:', imgSrc);
      const { src, srcSet, sizes } = getResponsiveImage(imgSrc);
      console.log('Final image properties:', { src, srcSet, sizes });
      
      setImageSrc(src);
      setImageSrcSet(srcSet);
      setImageSizes(sizes);
      
      // Preload the image to check if it exists
      const img = new Image();
      img.onload = () => console.log('Image loaded successfully:', src);
      img.onerror = () => console.error('Failed to load image:', src);
      img.src = src;
    } else {
      console.log('No product provided, using fallback image');
    }
  }, [product]);
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
        src={imageSrc}
        srcSet={imageSrcSet || undefined}
        sizes={imageSizes || undefined}
        alt={product?.name || "Product"}
        className="w-full h-full object-cover scale-105"
        style={{ borderRadius: '20px' }}
        draggable={false}
        loading="lazy"
        onError={e => { 
          console.error('Error loading image:', imageSrc, 'Error event:', e);
          if (e.target.src !== '/images/no-image.png') {
            console.log('Falling back to no-image.png');
            e.target.src = '/images/no-image.png';
            e.target.srcset = '';
          }
        }}
      />
    </div>
  );
}

export default ProductImage;