/* eslint-disable react/display-name */

import "./CompositeProductCard.css";

import React from "react";
import { useProductContext } from "../context/ProductContext";

const Image = ({ src, alt }) => {
  return (
    <div className="product-image">
      <img src={src} alt={alt} />
    </div>
  );
};

const Title = ({ children }) => {
  return <div className="product-title">{children}</div>;
};

const Price = ({ children }) => {
  return <div className="product-price">{children}</div>;
};

const Badge = ({ children, type }) => {
  return (
    <div className={`product-badge product-badge-${type}`}>{children}</div>
  );
};

const ActionButton = ({ children, onClick, isActive }) => {
  return (
    <button
      className={`action-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const CompositeProductCard = ({
  productId,
  children,
  customFooter,
  renderActions,
  layout = "vertical",
  className = "",
  style = {},
}) => {
  const { getProductState, toggleState } = useProductContext();
  const { cart, wishlist } = getProductState(productId);

  const layoutClass =
    layout === "horizontal"
      ? "product-card-horizontal"
      : "product-card-vertical";

  const findChildComponent = (ComponentType) =>
    React.Children.toArray(children).find(
      (child) => child.type === ComponentType
    );

  const filterChildrenComponents = (ComponentType) =>
    React.Children.toArray(children).filter(
      (child) => child.type !== ComponentType
    );

  const imageComponent = findChildComponent(Image);
  const badgeComponent = findChildComponent(Badge);
  const otherComponents = filterChildrenComponents(Image).filter(
    (child) => child.type !== Badge
  );

  return (
    <div
      className={`composite-product-card ${layoutClass} ${className}`}
      style={style}
    >
      <div className="product-image-container">
        {imageComponent}
        {badgeComponent}
      </div>

      <div className="product-details">
        {otherComponents}
        {renderActions && (
          <div className="product-actions">
            {renderActions({
              isAddedToCart: cart,
              isWishlisted: wishlist,
              toggleCart: () => toggleState(productId, "cart"),
              toggleWishlist: () => toggleState(productId, "wishlist"),
            })}
          </div>
        )}

        {customFooter && <div className="product-footer">{customFooter}</div>}
      </div>
    </div>
  );
};

CompositeProductCard.Image = Image;
CompositeProductCard.Title = Title;
CompositeProductCard.Price = Price;
CompositeProductCard.Badge = Badge;
CompositeProductCard.ActionButton = ActionButton;

export default CompositeProductCard;
