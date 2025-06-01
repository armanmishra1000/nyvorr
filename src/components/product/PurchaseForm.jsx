import React from "react";

function PurchaseForm({
  email,
  setEmail,
  telegram,
  setTelegram,
  error,
  handlePay,
  inStock,
}) {
  return (
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
        disabled={!inStock}
      >
        Pay Now
      </button>
    </form>
  );
}

export default PurchaseForm;