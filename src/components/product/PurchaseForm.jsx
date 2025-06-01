// src/components/product/PurchaseForm.jsx
import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

function PurchaseForm({
  email,
  setEmail,
  telegram,
  setTelegram,
  error,
  handlePay,
  inStock,
}) {
  const { user } = useAuth();

  // If logged in, always use user's email (locked)
  useEffect(() => {
    if (user && user.email) setEmail(user.email);
    // Optional: pre-fill telegram if you store it in user
    // if (user && user.telegram) setTelegram(user.telegram);
    // eslint-disable-next-line
  }, [user]);

  return (
    <form onSubmit={handlePay} className="w-full mt-4 flex flex-col gap-3">
      <div>
        <label className="block text-xs mb-1 text-gray-400">Email</label>
        <input
          type="email"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white w-full"
          value={user ? user.email : email}
          onChange={e => !user && setEmail(e.target.value)}
          readOnly={!!user}
          required
        />
        {user && (
          <div className="text-xs text-green-400 mt-1">
            Order will be delivered to your registered email.
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs mb-1 text-gray-400">Telegram Username</label>
        <input
          type="text"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white w-full"
          value={telegram}
          onChange={e => setTelegram(e.target.value)}
          placeholder="Enter your Telegram username"
          required
        />
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
      <button
        type="submit"
        className={`w-full mt-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg px-4 py-2 transition ${
          !inStock ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!inStock}
      >
        {inStock ? "Pay Now" : "Out of Stock"}
      </button>
    </form>
  );
}

export default PurchaseForm;