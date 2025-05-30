// src/components/News.jsx
import React from "react";
import news from "../data/news";

function News() {
  return (
    <section className="max-w-3xl mx-auto mt-16 px-4">
      <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">News</h2>
      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-[#181e20] border border-[#22282c] rounded-xl shadow p-4"
          >
            <div className="flex items-center text-gray-400 text-xs mb-2">
              <span className="mr-2">🗓️ {item.date}</span>
              {/* Optionally: status, category, etc */}
            </div>
            <p className="text-gray-200">
              {item.link ? (
                <>
                  {item.content.split("@")[0]}
                  <a
                    href={item.link}
                    className="text-green-400 underline hover:text-green-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{item.link.split("https://t.me/")[1]}
                  </a>
                </>
              ) : (
                item.content
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default News;
