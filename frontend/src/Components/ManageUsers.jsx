// ManageUsers.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

// ── SVG ICONS ──────────────────────────────────────────
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const EmptyUsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-300">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// ── COMPONENT ──────────────────────────────────────────
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin-api/users`, {
        withCredentials: true,
      });
      setUsers(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin-api/users/${userId}/status`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin-api/users/${userId}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── HEADER ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Manage Users
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Control platform users and access permissions
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm w-fit shadow-sm">
          <UsersIcon />
          <span>{users.length} Users</span>
        </div>
      </div>

      {/* ── TABLE ──────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">

            {/* HEAD */}
            <thead>
              <tr className="bg-gray-950 text-white">
                {["User", "Role", "Status", "Joined", "Actions"].map((col, i) => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 ${
                      i === 4 ? "text-center" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="group hover:bg-gray-50/70 transition-colors duration-150"
                >

                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                          {user.username}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ring-1 ${
                        user.role === "admin"
                          ? "bg-rose-50 text-rose-700 ring-rose-200"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ring-1 ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-gray-100 text-gray-500 ring-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.isActive ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* JOINED */}
                  <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ring-1 ${
                          user.isActive
                            ? "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-500 hover:text-white hover:ring-amber-500"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-500 hover:text-white hover:ring-emerald-500"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-50 text-rose-500 ring-1 ring-rose-200 hover:bg-rose-500 hover:text-white hover:ring-rose-500 transition-all duration-150"
                        title="Delete user"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <EmptyUsersIcon />
            </div>
            <h2 className="text-lg font-bold text-gray-900">No Users Found</h2>
            <p className="mt-1.5 text-sm text-gray-400">
              No registered users available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;