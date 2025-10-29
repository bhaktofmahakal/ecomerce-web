'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface WishlistClientProps {
  productId: string;
  productName: string;
}

export default function WishlistClient({ productName }: WishlistClientProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlisted(!isWishlisted);

    // In a real app, this would save to a database or local storage
    if (!isWishlisted) {
      console.log(`Added ${productName} to wishlist`);
    } else {
      console.log(`Removed ${productName} from wishlist`);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className={`p-2 rounded-full transition-all ${
        isWishlisted
          ? 'bg-red-500 text-white shadow-lg'
          : 'bg-white text-gray-400 border border-gray-200 hover:text-red-500'
      }`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <div className={isWishlisted ? 'fill-current' : ''}>
        <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
      </div>
    </button>
  );
}