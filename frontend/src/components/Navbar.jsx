import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { useScroll } from '../context/ScrollContext';
import { AuthContext } from '../context/AuthContext';
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setScrollTarget } = useScroll();
  const { user, logout } = useContext(AuthContext);

  const [currentSection, setCurrentSection] = useState('home');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Used to detect outside clicks

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;

      const aboutEl = document.getElementById('about');
      const scrollY = window.scrollY;
      const buffer = 100;

      if (aboutEl) {
        const aboutTop = aboutEl.offsetTop - buffer;
        const aboutBottom = aboutTop + aboutEl.offsetHeight;

        if (scrollY >= aboutTop && scrollY < aboutBottom) {
          setCurrentSection('about');
        } else {
          setCurrentSection('home');
        }
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAboutClick = () => {
    if (location.pathname !== '/') {
      setScrollTarget('about');
      navigate('/');
    } else {
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      setScrollTarget('home');
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🌱</span>
          Sri Kumaran Motors
        </Link>
      </div>

      <div className="nav-right">
        <Link
          to="/"
          className={`nav-item page-link ${location.pathname === '/' && currentSection === 'home' ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          Home
        </Link>

        <Link
          to="/"
          className={`nav-item page-link ${location.pathname === '/' && currentSection === 'about' ? 'active' : ''}`}
          onClick={handleAboutClick}
        >
          About
        </Link>

        <Link
          to="/products"
          className={`nav-item page-link ${location.pathname === '/products' ? 'active' : ''}`}
        >
          Products
        </Link>

        {!user ? (
          <Link
            to="/login"
            className={`nav-item page-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            Sign in/up
          </Link>
        ) : (
          <>
            <Link
              to="/cart"
              className={`nav-item page-link ${location.pathname === '/cart' ? 'active' : ''}`}
            >
              Cart
            </Link>

            {/* Profile Dropdown */}
            <div
              className="nav-item no-hover-underline"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ position: 'relative' }}
            >
              Profile ▾
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                    minWidth: '140px',
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to="/profile"
                    className="nav-item no-hover-underline"
                    style={{ display: 'block', padding: '0.5rem 1rem' }}
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="nav-item no-hover-underline"
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      navigate('/'); // or navigate('/login');
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
