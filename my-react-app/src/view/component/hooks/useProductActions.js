import { useState } from "react";

export const useProductActions = (productId) => {
  const [isAddedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setWishlisted] = useState(false);

  const toggleCart = () => {
    setAddedToCart((prevState) => !prevState);
    console.log(
      !isAddedToCart
        ? "Added to cart" + productId
        : "Removed from cart" + productId
    );
  };

  const toggleWishlist = () => {
    setWishlisted((prevState) => !prevState);
    console.log(
      !isWishlisted
        ? "Added to wishlist" + productId
        : "Removed from wishlist" + productId
    );
  };

  return {
    isAddedToCart,
    isWishlisted,
    toggleCart,
    toggleWishlist,
  };
};
