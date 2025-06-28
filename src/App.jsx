// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProductPage from "./pages/ProductPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import { useAuth } from "./contexts/AuthContext";
import HamburgerMenu from "./components/HamburgerMenu";

function HomePage() {
  return (
    <>
      <section className="max-w-2xl mx-auto mt-8 bg-[#181e20] rounded-lg border border-[#22282c] shadow p-4 flex flex-col items-center transition duration-200 ease-out">
        <span className="text-lg font-semibold mb-1 text-green-400">Announcement</span>
        <p className="text-gray-200 text-center">
          🚀 Welcome to Nyvorr Digital Store – Your premium destination for digital products. Stay tuned for updates!
        </p>
      </section>
      <Products />
      <Reviews />
      <News />
      <Contact />
      <ScrollToTop />
      <Footer />
    </>
  );
}

// Custom NavLink component for active state
const NavLink = ({ to, activeClassName, children, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`text-gray-300 hover:text-green-400 px-3 py-2 text-sm font-medium ${
        isActive ? activeClassName : ''
      }`}
      {...props}
    >
      {children}
    </Link>
  );
};

// Protect admin panel
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user && user.isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151c1f] via-[#23272c] to-[#101314] text-white font-sans">
      {/* Sticky Header/Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#161b1d] border-b border-[#22282c] py-2 shadow-lg' 
            : 'bg-[#161b1d]/90 border-b border-[#22282c]/30 py-3 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <span className="bg-gradient-to-br from-green-400 to-green-600 w-8 h-8 rounded-md flex items-center justify-center font-bold text-xl">N</span>
                <span className="text-lg font-semibold tracking-wide text-white hidden sm:inline-block">Nyvorr Shop</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/" activeClassName="text-green-400">Home</NavLink>
              <NavLink to="/#products" activeClassName="text-green-400">Products</NavLink>
              <NavLink to="/#reviews" activeClassName="text-green-400">Reviews</NavLink>
              <NavLink to="/#contact" activeClassName="text-green-400">Contact</NavLink>
              
              {user && (
                <NavLink to="/order-history" activeClassName="text-blue-400">My Orders</NavLink>
              )}
              {user?.isAdmin && (
                <NavLink to="/admin" activeClassName="text-yellow-400">Admin</NavLink>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:block">
                  <Link 
                    to="/profile" 
                    className="text-green-300 hover:text-green-400 text-sm font-medium"
                  >
                    {user.username || user.email.split('@')[0]}
                  </Link>
                </div>
              )}
              <HamburgerMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;