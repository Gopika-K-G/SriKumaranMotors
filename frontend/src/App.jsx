// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signin from './pages/Login';
import Signup from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import { ScrollProvider } from './context/ScrollContext';
import PrivateRoute from './components/PrivateRoute';
import Favourites from './pages/Favourites';
import Bill from './pages/Bill';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import PaymentSuccess from './pages/PaymentSuccess';
import UserDetails from './pages/UserDetails';
import OrderDetails from './pages/OrderDetails';
import StockManagement from './pages/StockManagement';

function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/favourites" element={<PrivateRoute><Favourites /></PrivateRoute>} />
          <Route path="/bill" element={<PrivateRoute><Bill /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserDetails /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderDetails /></AdminRoute>} />
          <Route path="/admin/stock" element={<AdminRoute><StockManagement /></AdminRoute>} />
        </Routes>
      </ScrollProvider>
    </AuthProvider>
  );
}

export default App;
