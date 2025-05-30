import React, { useState, useEffect } from "react";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={scrollUp}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-black rounded-full p-3 shadow-lg transition hover:scale-110"
      aria-label="Scroll to top"
    >
      {/* Up arrow icon (SVG) */}
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  ) : null;
}

export default ScrollToTop;
