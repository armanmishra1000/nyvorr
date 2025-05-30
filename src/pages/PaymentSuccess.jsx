// src/pages/PaymentSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
        <svg
          width="64"
          height="64"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="mb-4 text-green-400"
          viewBox="0 0 24 24"
        >
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
}

export default PaymentSuccess;
