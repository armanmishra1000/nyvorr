import React from "react";

function CouponApplyForm({
  couponCode,
  setCouponCode,
  coupon,
  couponError,
  checkingCoupon,
  handleApplyCoupon,
}) {
  return (
    <form
      onSubmit={handleApplyCoupon}
      className="w-full flex flex-col gap-2 mb-3"
    >
      <div className="flex">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="w-full px-3 py-2 rounded-l bg-[#22282c] border border-[#232a32] text-white focus:outline-none"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          disabled={!!coupon}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r bg-green-500 hover:bg-green-600 text-black font-semibold transition ${!!coupon ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!!coupon || checkingCoupon}
        >
          {coupon ? "Applied" : checkingCoupon ? "Checking..." : "Apply"}
        </button>
      </div>
      {coupon && (
        <div className="text-green-400 text-xs mt-1">
          Coupon applied! {coupon.discountType === "flat"
            ? `-$${coupon.discountValue}`
            : `-${coupon.discountValue}%`} off.
        </div>
      )}
      {couponError && (
        <div className="text-red-400 text-xs mt-1">{couponError}</div>
      )}
    </form>
  );
}

export default CouponApplyForm;