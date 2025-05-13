import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productStates, setProductStates] = useState({});

  const toggleState = (productId, stateType) => {
    setProductStates((prevStates) => {
      const currentProductState = prevStates[productId] || {
        cart: false,
        wishlist: false,
      };
      return {
        ...prevStates,
        [productId]: {
          ...currentProductState,
          [stateType]: !currentProductState[stateType],
        },
      };
    });
  };

  const getProductState = (productId) =>
    productStates[productId] || {
      cart: false,
      wishlist: false,
    };

  return (
    <ProductContext.Provider value={{ getProductState, toggleState }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
