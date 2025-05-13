import CompositeProductCard from "./CompositeProductCard";
import { useProductActions } from "../hooks/useProductActions";

const ProductCardWrapper = ({
  productId,//产品id
  layout = "vertical",//布局
  imageSrc,//图片
  title,
  price,
  badgeType,//标记类型
  customFooter,//自定义底部
  showActions = true,//是否显示操作按钮
  className = "",//类名
  style = {},//自定义的样式
  children,//子元素
}) => {
  const { isAddedToCart, isWishlisted, toggleCart, toggleWishlist } =
    useProductActions(productId);

  const renderActions = showActions
    ? () => (
        <>
          <CompositeProductCard.ActionButton
            onClick={toggleCart}
            isActive={isAddedToCart}
          >
            {isAddedToCart ? "Remove from Cart" : " Add to Cart"}
          </CompositeProductCard.ActionButton>
          <CompositeProductCard.ActionButton
            onClick={toggleWishlist}
            isActive={isWishlisted}
          >
            {isWishlisted ? "Remove from Wishlist" : " Add to Wishlist"}
          </CompositeProductCard.ActionButton>
        </>
      )
    : null;

  return (
    <CompositeProductCard
      productId={productId}
      layout={layout}
      renderActions={renderActions}
      customFooter={customFooter}
      className={className}
      style={style}
    >
      {imageSrc && (
        <CompositeProductCard.Image src={imageSrc} alt={title || "Product"} />
      )}

      {!!badgeType && (
        <CompositeProductCard.Badge type={badgeType}>
          {badgeType || "甄选"}
        </CompositeProductCard.Badge>
      )}

      {children || (
        <>
          {title && (
            <CompositeProductCard.Title>{title}</CompositeProductCard.Title>
          )}

          {price && (
            <CompositeProductCard.Price>{price}</CompositeProductCard.Price>
          )}
        </>
      )}
    </CompositeProductCard>
  );
};

ProductCardWrapper.Title = CompositeProductCard.Title;
ProductCardWrapper.Price = CompositeProductCard.Price;
ProductCardWrapper.Image = CompositeProductCard.Image;
ProductCardWrapper.Badge = CompositeProductCard.Badge;
ProductCardWrapper.ActionButton = CompositeProductCard.ActionButton;

export default ProductCardWrapper;
