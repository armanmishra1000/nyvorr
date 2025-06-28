/**
 * Generates responsive image URLs with different sizes
 * @param {string} imageUrl - The original image URL
 * @returns {Object} Object containing srcSet and sizes properties
 */
export function getResponsiveImage(imageUrl) {
  // Default no-image fallback
  if (!imageUrl) {
    return {
      src: '/images/no-image.png',
      srcSet: '',
      sizes: ''
    };
  }

  // For external images (like from a CDN)
  if (imageUrl.startsWith('http')) {
    return {
      src: imageUrl,
      srcSet: `${imageUrl} 1x, ${imageUrl} 2x`,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    };
  }
  
  // For local images, just return the path as is
  // The server should handle serving the appropriate size
  return {
    src: imageUrl,
    srcSet: '',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  };
}

/**
 * Gets the appropriate image source based on the product's image field
 */
export function getProductImageSrc(product) {
  if (!product?.image) return '/images/no-image.png';
  
  // If it's already a full URL, return as is
  if (product.image.startsWith('http')) {
    return product.image;
  }
  
  // If it's a path that doesn't start with /, add /images/ prefix
  if (!product.image.startsWith('/')) {
    return `/images/${product.image}`;
  }
  
  // If it starts with / but not /images, ensure it's properly prefixed
  if (!product.image.startsWith('/images/')) {
    return `/images${product.image}`;
  }
  
  // Otherwise, return as is (already has /images/)
  return product.image;
}
