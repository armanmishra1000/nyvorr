// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/login");
      }
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        className="bg-[#1a2326] p-10 rounded-lg shadow max-w-xs w-full flex flex-col gap-4"
        onSubmit={handleSignup}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-green-400 text-center mb-4">Signup</h2>
        <input
          className="px-4 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="px-4 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="px-4 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg px-4 py-2 mt-2 transition"
          type="submit"
        >
          Signup
        </button>
        <div className="text-green-300 text-xs text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;