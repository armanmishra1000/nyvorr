import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);

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

  // Form state
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState("");

  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle Pay Now (calls backend to get Cryptomus payment link)
  const handlePay = async (e) => {
    e.preventDefault();
    if (!email || !telegram) {
      setError("Please enter your email and Telegram username.");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      // Pick price: variation or product
      const price = selectedVariation ? selectedVariation.price.replace("$", "") : product.price.replace("$", "");
      const product_name = selectedVariation
        ? `${product.name} (${selectedVariation.label})`
        : product.name;
      const order_id = `nyvorr_${product.id}_${Date.now()}`;
      const response = await fetch("http://localhost:4000/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          currency: "USDT",
          order_id,
          email,
          telegram,
          product_name,
          url_return: `http://localhost:5173/payment-success?order_id=${order_id}`
        }),
      });
      const data = await response.json();
      if (data.pay_url) {
        window.location.href = data.pay_url; // Redirect to Cryptomus payment page
      } else {
        setError(data.error || "Failed to create payment link.");
      }
    } catch (err) {
      setError("Failed to connect to payment server.");
    }
  };

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

  // Image logic
  let imgSrc = "/images/no-image.png";
  if (product.image) {
    if (product.image.startsWith("/images/")) {
      imgSrc = product.image;
    } else if (product.image.startsWith("images/")) {
      imgSrc = "/" + product.image;
    } else if (
      product.image.startsWith("http://") ||
      product.image.startsWith("https://")
    ) {
      imgSrc = product.image;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
        <div className="w-full h-40 mb-4 rounded-lg overflow-hidden border border-[#232a32] bg-[#20272a] shadow-sm flex items-center justify-center">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            draggable={false}
            onError={e => { e.target.src = "/images/no-image.png"; }}
          />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-green-400 text-center">{product.name}</h1>
        {Array.isArray(product.variations) && product.variations.length > 0 ? (
          <div className="w-full mb-4">
            <label className="block mb-1 text-gray-300 font-medium">Select Plan:</label>
            <select
              className="w-full px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
              value={selectedVariation?.label || ""}
              onChange={e =>
                setSelectedVariation(
                  product.variations.find(v => v.label === e.target.value)
                )
              }
            >
              {product.variations.map((v) => (
                <option key={v.label} value={v.label}>
                  {v.label} — {v.price}
                </option>
              ))}
            </select>
            <div className="mt-2 text-green-300 text-lg font-semibold">
              {selectedVariation?.price}
            </div>
          </div>
        ) : (
          <p className="text-lg font-semibold text-green-300 mb-2">{product.price}</p>
        )}
        <span className={`text-xs mb-4 px-3 py-1 rounded-full ${product.status === "In Stock" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
          {product.status}
        </span>
        {product.description && (
          <div className="text-gray-300 text-center mb-4">{product.description}</div>
        )}
        <p className="text-gray-300 text-center mb-4">
          Get instant access after payment. Please enter your contact details below to receive your order.
        </p>

        {/* Purchase Form */}
        <form onSubmit={handlePay} className="w-full flex flex-col gap-4 mb-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 rounded bg-[#22282c] border border-[#232a32] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="text"
            placeholder="Telegram Username (with @)"
            className="w-full px-4 py-2 rounded bg-[#22282c] border border-[#232a32] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={telegram}
            onChange={e => setTelegram(e.target.value)}
            autoComplete="off"
            required
          />
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg px-4 py-2 mt-2 transition"
            disabled={product.status !== "In Stock"}
          >
            Pay Now
          </button>
        </form>

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