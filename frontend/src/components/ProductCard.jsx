const ProductCard = ({ name, image }) => {
    return (
      <div className="product-card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
      </div>
    );
  };
  
  export default ProductCard;
  