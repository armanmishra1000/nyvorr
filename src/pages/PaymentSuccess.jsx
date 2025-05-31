// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  // Get order_id from URL
  const orderId = new URLSearchParams(location.search).get("order_id");

  useEffect(() => {
    if (!orderId) {
      setStatus("invalid");
      return;
    }
    fetch(`http://localhost:4000/api/order-status/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "Paid") setStatus("success");
        else if (data.status === "Unknown") setStatus("unknown");
        else setStatus("fail");
      })
      .catch(() => setStatus("fail"));
  }, [orderId]);

  if (status === "checking")
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-green-400 text-xl">Checking your payment...</div>
      </div>
    );

  if (status === "success")
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
          <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth={2} className="mb-4 text-green-400" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-2xl font-bold text-green-400 mb-2 text-center">Payment Successful!</h1>
          <p className="text-gray-200 text-center mb-4">
            Thank you for your purchase.<br />
            <span className="text-green-300 font-semibold">We will deliver your product to your Email and Telegram soon.</span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold mt-4 transition"
          >
            Back to Store
          </button>
        </div>
      </div>
    );

  if (status === "fail" || status === "unknown" || status === "invalid")
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
          <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth={2} className="mb-4 text-red-400" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M9 10l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-2xl font-bold text-red-400 mb-2 text-center">Payment Failed!</h1>
          <p className="text-gray-200 text-center mb-4">
            We could not verify your payment. If you cancelled or failed the payment, please try again.<br />
            If you paid but see this, contact support with your order ID: <span className="text-green-300">{orderId}</span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold mt-4 transition"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
}

export default PaymentSuccess;