import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductImage from "../components/product/ProductImage";
import ProductVariationSelector from "../components/product/ProductVariationSelector";
import CouponApplyForm from "../components/product/CouponApplyForm";
import PriceDisplay from "../components/product/PriceDisplay";
import PurchaseForm from "../components/product/PurchaseForm";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data & UI state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Purchase state
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState("");

  // Load product
  useEffect(() => {
    fetch(`http://localhost:4000/api/products`)
      .then((res) => res.json())
      .then((all) => {
        const p = all.find((p) => String(p.id) === String(id));
        setProduct(p);
        if (p?.variations && p.variations.length > 0) {
          setSelectedVariation(p.variations[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Reset coupon when product/variation changes
  useEffect(() => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, [product, selectedVariation]);

  // --- COUPON LOGIC ---
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCheckingCoupon(true);
    setCouponError("");
    setCoupon(null);
    try {
      const res = await fetch("http://localhost:4000/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          productId: product.id,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.error || "Invalid coupon");
        setCoupon(null);
      } else {
        setCoupon({
          code: couponCode,
          discountType: data.discountType,
          discountValue: data.discountValue,
        });
      }
    } catch (err) {
      setCouponError("Coupon validation failed.");
      setCoupon(null);
    }
    setCheckingCoupon(false);
  };

  // --- PRICE LOGIC ---
  function getOriginalPrice() {
    if (selectedVariation) {
      return parseFloat(selectedVariation.price.replace("$", ""));
    }
    return parseFloat(product?.price?.replace("$", "")) || 0;
  }
  function getDiscountedPrice() {
    if (!coupon) return getOriginalPrice();
    let price = getOriginalPrice();
    if (coupon.discountType === "flat") {
      price -= coupon.discountValue;
    } else if (coupon.discountType === "percent") {
      price = price - (price * coupon.discountValue) / 100;
    }
    return Math.max(0, price);
  }

  // --- PURCHASE LOGIC ---
  const handlePay = async (e) => {
    e.preventDefault();
    if (!email || !telegram) {
      setError("Please enter your email and Telegram username.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      const price = getDiscountedPrice();
      const product_name = selectedVariation
        ? `${product.name} (${selectedVariation.label})`
        : product.name;
      const order_id = `nyvorr_${product.id}_${Date.now()}`;
      const response = await fetch("http://localhost:4000/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price.toFixed(2),
          currency: "USDT",
          order_id,
          email,
          telegram,
          product_name,
          coupon: coupon ? coupon.code : undefined,
          url_return: `http://localhost:5173/payment-success?order_id=${order_id}`,
        }),
      });
      const data = await response.json();
      if (data.pay_url) {
        window.location.href = data.pay_url;
      } else {
        setError(data.error || "Failed to create payment link.");
      }
    } catch (err) {
      setError("Failed to connect to payment server.");
    }
  };

  // --- UI LOADING/ERROR STATES ---
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-green-400">Loading product...</span>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Product Not Found</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-2xl w-full p-8 flex flex-col items-center">
        {/* Image */}
        <ProductImage product={product} className="w-full max-w-xl h-auto mb-6" />

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-green-400 text-center">
          {product.name}
        </h1>

        {/* Variations */}
        <ProductVariationSelector
          product={product}
          selectedVariation={selectedVariation}
          setSelectedVariation={setSelectedVariation}
        />

        {/* Status */}
        <span
          className={`text-xs mb-4 px-3 py-1 rounded-full ${
            product.status === "In Stock"
              ? "bg-green-900 text-green-300"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          {product.status}
        </span>
        {product.description && (
          <div className="text-gray-300 text-center mb-4">
            {product.description}
          </div>
        )}

        {/* Coupon Form */}
        <CouponApplyForm
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          coupon={coupon}
          couponError={couponError}
          checkingCoupon={checkingCoupon}
          handleApplyCoupon={handleApplyCoupon}
        />

        {/* Price Display */}
        <PriceDisplay
          originalPrice={getOriginalPrice()}
          coupon={coupon}
          discountedPrice={getDiscountedPrice()}
        />

        {/* Purchase Form */}
        <PurchaseForm
          email={email}
          setEmail={setEmail}
          telegram={telegram}
          setTelegram={setTelegram}
          error={error}
          handlePay={handlePay}
          inStock={product.status === "In Stock"}
        />

        <button
          onClick={() => navigate("/")}
          className="text-sm text-green-400 mt-2 underline hover:text-green-300"
        >
          ← Back to shop
        </button>
      </div>
    </div>
  );
}

export default ProductPage;