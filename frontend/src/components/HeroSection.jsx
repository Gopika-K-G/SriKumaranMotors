import { useNavigate } from 'react-router-dom';
import '../styles/home.css'; // Make sure the path is correct

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="hero-wrapper"
      style={{
        backgroundImage: `url("https://img.freepik.com/premium-photo/tractor-plowing-field-with-mountains-background_916191-12676.jpg")`,
      }}
    >
      <div className="hero-content">
        <h1>
          Welcome to <span style={{ color: '#fbbf24' }}>Sri Kumaran Motors</span>
        </h1>
        <p>We provide quality auto parts and services.</p>
        <button onClick={() => navigate('/products')}>
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
