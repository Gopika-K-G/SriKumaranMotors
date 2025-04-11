import ProductCard from './ProductCard';
import '../styles/home.css';

const ProductList = () => {
  const sampleProducts = [
    {
      id: 1,
      name: 'Power Tillers',
      image: 'https://m.media-amazon.com/images/I/712n1k998hL.jpg',
    },
    {
      id: 2,
      name: 'Chaff Cutter Machines',
      image: 'https://www.keyulenterprise.com/images/products/img-chaff-cutter-machine.webp',
    },
    {
      id: 3,
      name: 'Rotavators',
      image: 'https://m.media-amazon.com/images/I/71UkFP+3UML.jpg',
    },
  ];

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-heading">Our Products</h2>
        <div className="product-grid">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} name={product.name} image={product.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
