// src/pages/Profile.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [telegram, setTelegram] = useState(user?.telegram || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  if (!user) return <div className="text-red-500 p-8">Not logged in.</div>;

  // Update profile handler
  const handleProfile = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // <-- FIXED
        },
        body: JSON.stringify({ telegram, email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Update failed");
      setMessage("Profile updated!");
      // Update local user cache:
      localStorage.setItem("nyvorr_user", JSON.stringify(data.user));
      window.location.reload(); // quick way to refresh data everywhere
    } catch {
      setError("Update failed");
    }
  };

  // Change password handler
  const handlePassword = async (e) => {
    e.preventDefault();
    setPwMessage(""); setPwError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // <-- FIXED
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setPwError(data.error || "Password change failed");
      setPwMessage("Password changed!");
      setOldPassword(""); setNewPassword("");
      setTimeout(() => logout(), 2000);
    } catch {
      setPwError("Password change failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 mt-14 bg-[#161b1d] rounded-xl border border-[#22282c]">
      <h1 className="text-2xl font-bold text-green-400 mb-4">My Profile</h1>
      <form onSubmit={handleProfile} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="text-xs text-gray-400">Username</label>
          <input
            className="w-full px-3 py-2 rounded bg-[#23272c] border border-[#232a32] text-white mt-1"
            value={user.username}
            disabled
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-[#23272c] border border-[#232a32] text-white mt-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Telegram Username</label>
          <input
            className="w-full px-3 py-2 rounded bg-[#23272c] border border-[#232a32] text-white mt-1"
            value={telegram}
            onChange={e => setTelegram(e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold mt-2"
          type="submit"
        >
          Update Profile
        </button>
        {message && <div className="text-green-400">{message}</div>}
        {error && <div className="text-red-400">{error}</div>}
      </form>

      <hr className="border-[#232a32] my-6" />
      <form onSubmit={handlePassword} className="flex flex-col gap-4">
        <div className="font-semibold text-gray-300 mb-2">Change Password</div>
        <input
          className="w-full px-3 py-2 rounded bg-[#23272c] border border-[#232a32] text-white"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          type="password"
          placeholder="Old Password"
          required
        />
        <input
          className="w-full px-3 py-2 rounded bg-[#23272c] border border-[#232a32] text-white"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          type="password"
          placeholder="New Password"
          required
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold"
          type="submit"
        >
          Change Password
        </button>
        {pwMessage && <div className="text-green-400">{pwMessage} (logging out...)</div>}
        {pwError && <div className="text-red-400">{pwError}</div>}
      </form>
    </div>
  );
}