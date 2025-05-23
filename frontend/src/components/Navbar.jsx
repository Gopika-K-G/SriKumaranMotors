// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useScroll } from '../context/ScrollContext'; // ✅ import useScroll
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { setScrollTarget } = useScroll(); // ✅ use setScrollTarget from ScrollContext
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">🌱 Sri Kumaran Motors</Link>
      </div>

      <div className="nav-right">
        {!user && (
          <>
            <Link to="/"       className="nav-item page-link">Home</Link>
            <Link to="/"       className="nav-item page-link">About</Link>
            <Link to="/products" className="nav-item page-link">Products</Link>
            <Link to="/login"  className="nav-item page-link">Sign in/up</Link>
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <Link to="/" className="nav-item page-link">Home</Link>
            <span
              className="nav-item page-link"
              onClick={() => {
                if (location.pathname === '/') {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setScrollTarget('about'); // ✅ set scroll target in context
                  navigate('/');
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              About
            </span>

            <Link to="/products" className="nav-item page-link">Products</Link>
            <Link to="/cart" className="nav-item page-link">Cart</Link>
            <Link to="/favourites" className="nav-item page-link">Favourites</Link>

            {/* Profile Dropdown */}
            <div
              className="nav-item no-hover-underline"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ position: 'relative', cursor: 'pointer' }}
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
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      color: '#333',
                    }}
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="nav-item no-hover-underline"
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#333',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" className="nav-item page-link">Dashboard</Link>
            <Link to="/admin/users" className="nav-item page-link">User Details</Link>
            <Link to="/admin/orders" className="nav-item page-link">Order Details</Link>
            <Link to="/admin/stock" className="nav-item page-link">Stock Management</Link>
            <button
              className="nav-item nav-logout"
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#333',
                fontSize: '0.95rem',
                margin: '0 1rem',
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
