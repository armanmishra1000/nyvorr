// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/"); // Now redirect to homepage, not /admin
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <form className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-xs w-full p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-green-400 text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="text-red-400 text-xs">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg px-4 py-2 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="text-green-300 text-xs mt-2"
          onClick={() => navigate("/signup")}
        >
          Don&apos;t have an account? Signup
        </button>
      </form>
    </div>
  );
}

export default Login;