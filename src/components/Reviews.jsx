// src/components/Reviews.jsx
import React from "react";
import reviews from "../data/reviews";

// Star rating component
function StarRating({ count }) {
  return (
    <span className="text-yellow-400 flex">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="18" height="18" fill="currentColor" viewBox="0 0 20 20" className="inline-block">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.457a1 1 0 00-.364 1.118l1.286 3.973c.3.921-.755 1.688-1.538 1.118l-3.383-2.457a1 1 0 00-1.176 0l-3.383 2.457c-.783.57-1.838-.197-1.538-1.118l1.286-3.973a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.973z"/>
        </svg>
      ))}
    </span>
  );
}

function Reviews() {
  return (
    <section className="max-w-5xl mx-auto mt-12 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#181e20] border border-[#22282c] rounded-xl shadow-md p-4 sm:p-5 flex flex-col"
          >
            <div className="flex items-center mb-2">
              <StarRating count={review.rating} />
              <span className="ml-2 text-sm text-gray-400">{review.user}</span>
              <span className="ml-auto text-xs text-gray-600">{review.time}</span>
            </div>
            <p className="text-gray-200 text-sm sm:text-base">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
