// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProductPage from "./pages/ProductPage";
import PaymentSuccess from "./pages/PaymentSuccess";

function HomePage() {
  return (
    <>
      {/* Announcement Section */}
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

function App() {
  return (
    <div className="min-h-screen pt-[70px] bg-gradient-to-br from-[#151c1f] via-[#23272c] to-[#101314] text-white font-sans">
      {/* Sticky Header/Navbar */}
      <header className="w-full fixed top-0 left-0 z-50 bg-[#161b1d]/80 border-b border-[#22282c] px-4 py-3 flex items-center justify-between shadow-md backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="bg-gradient-to-br from-green-400 to-green-600 w-8 h-8 rounded-md flex items-center justify-center font-bold text-xl">N</span>
          <span className="text-lg font-semibold tracking-wide text-white">Nyvorr Shop</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm">
          <a href="/" className="hover:text-green-400">Home</a>
          <a href="/" className="hover:text-green-400">Products</a>
          <a href="/" className="hover:text-green-400">Reviews</a>
          <a href="/" className="hover:text-green-400">Contact</a>
        </nav>
        <div>
          <button className="bg-green-500 hover:bg-green-600 transition px-4 py-1.5 rounded font-semibold text-black text-sm shadow">
            Sign Up
          </button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
