# Nyvorr Digital Store

A modern, crypto-first digital product store built with **React + Vite** for the frontend and **Node.js (Express)** for the backend.  
Order management, payments, and delivery are **fully automated via Google Sheets** and the Cryptomus payment gateway.

---

## Features

- 🛍️ **Showcase & sell digital products** (Netflix, Spotify, YouTube, etc.)
- 💸 **Crypto payments only** (Cryptomus, USDT/BTC/TON and more supported)
- 🔒 **No user login/account required**
- 📜 **All order attempts logged to Google Sheets** (status auto-updates to Paid/Failed)
- 📱 **Mobile-first, dark UI** with smooth animations
- 📝 **Easy to update products, reviews, news**—just edit JS files
- ⚡️ **Blazing fast**: Vite + Tailwind + React 19

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM
- **Backend**: Node.js (Express), Cryptomus API, Google Sheets API
- **Order logging**: Google Sheets (no DB needed)
- **Payment**: Cryptomus (crypto only; more methods can be added)
- **Deployment**: Vercel/Netlify (frontend), Render/VPS/Heroku (backend), or your own server

---

## Project Structure
nyvorr-store/
├── backend/
│ ├── .env # Cryptomus API key, merchant UUID (never commit to public repos)
│ ├── google-credentials.json # Google service account for Sheets API
│ └── server.js # Express backend (API/payment/webhook)
├── public/
│ └── vite.svg
├── src/
│ ├── assets/ # Images for products, branding, etc.
│ ├── components/ # Reusable React components (Products, Reviews, News, Footer, etc.)
│ ├── data/ # JS files with product/review/news data (edit here to change listings)
│ ├── pages/ # Route-level pages (ProductPage, PaymentSuccess)
│ ├── App.jsx # Main app file (navbar, routes, etc.)
│ ├── main.jsx # React entrypoint
│ ├── App.css, index.css # Tailwind/custom CSS
├── .gitignore
├── package.json # Project scripts and dependencies
├── postcss.config.js, tailwind.config.js, vite.config.js
└── README.md # This file


---

## How It Works

### 1. User Journey

1. **Home page**: Browse products, see reviews, news, and contact info.
2. **Buy Now**: User clicks on a product, sees details, enters email/Telegram, and clicks Pay Now.
3. **Checkout**: User is redirected to Cryptomus crypto payment page.
4. **Order Logging**: Every attempt is logged to Google Sheets (status = Pending).
5. **Payment Callback**: After payment, Cryptomus notifies the backend via webhook, which updates the order status in Sheets to Paid/Failed.
6. **Success Page**: User is redirected to a Thank You/Order Success page.

### 2. Admin (Your) Workflow

- View/manage orders in Google Sheets
- See both "Pending" and "Paid" orders
- Deliver products manually via email/Telegram based on Sheet entries

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/nyvorr-store.git
cd nyvorr-store

# Start backend (in backend/)
node server.js

# Start frontend (in main folder)
npm run dev

Frontend runs on http://localhost:5173
Backend runs on http://localhost:4000