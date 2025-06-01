import React, { useEffect, useState } from "react";

function UserListPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/users")
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#181e20] border border-[#22282c] rounded-xl p-6">
      <h2 className="text-lg font-bold text-blue-300 mb-3">Registered Users</h2>
      {loading ? (
        <div className="text-green-400">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-green-400">Username</th>
                <th className="px-2 py-2 text-left text-green-400">Email</th>
                <th className="px-2 py-2 text-left text-green-400">Telegram</th>
                <th className="px-2 py-2 text-left text-green-400">Admin?</th>
                <th className="px-2 py-2 text-left text-green-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-[#232a32]">
                  <td className="px-2 py-1">{u.username || <span className="text-gray-500">-</span>}</td>
                  <td className="px-2 py-1">{u.email}</td>
                  <td className="px-2 py-1">{u.telegram || <span className="text-gray-500">-</span>}</td>
                  <td className="px-2 py-1">{u.isAdmin ? "Yes" : "No"}</td>
                  <td className="px-2 py-1">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserListPanel;