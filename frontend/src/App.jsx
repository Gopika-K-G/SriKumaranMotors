// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signin from './pages/Login';
import Signup from './pages/SignUp';
import Cart from './pages/Cart'; // assumed path
import Profile from './pages/Profile'; // assumed path
import { ScrollProvider } from './context/ScrollContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ScrollProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ScrollProvider>
  );
}

export default App;
