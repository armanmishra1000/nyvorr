// src/components/Contact.jsx
import React from "react";

function Contact() {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-8 px-4">
      <div className="bg-[#181e20] border border-[#22282c] rounded-xl shadow p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Need help? Contact us</h2>
        <p className="text-gray-200 text-center mb-4">
          For support or questions about your purchase, get in touch via Telegram or email below.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="https://t.me/BackupVyprBot"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-lg font-semibold transition"
          >
            Contact on Telegram
          </a>
          <span className="text-gray-400 text-sm">or</span>
          <a
            href="mailto:support@nyvorr.com"
            className="bg-[#22282c] hover:bg-[#232a32] text-green-400 px-5 py-2 rounded-lg font-semibold transition border border-green-400"
          >
            support@nyvorr.com
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
