// AdminProfile.jsx

import React, { useState } from "react";

// TAB COMPONENTS
import AdminStats from "./AdminStats.jsx";
import ManageUsers from "./ManageUsers.jsx";
import ManageMedicines from "./ManageMedicines.jsx";
import ManagePharmacies from "./ManagePharmacies.jsx";
import ManageReports from "./ManageReports.jsx";

import { useAuth } from "../store/authStore.js";

function AdminProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");

  const tabs = [
    { id: "stats", label: "Stats" },
    { id: "users", label: "Users" },
    { id: "medicines", label: "Medicines" },
    { id: "pharmacies", label: "Pharmacies" },
    { id: "reports", label: "Reports" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <AdminStats />;
      case "users":
        return <ManageUsers />;
      case "medicines":
        return <ManageMedicines />;
      case "pharmacies":
        return <ManagePharmacies />;
      case "reports":
        return <ManageReports />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-blue-900 to-cyan-800 rounded-4xl shadow-2xl p-8 md:p-10 mb-8 text-white">

          {/* Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* LEFT */}
            <div className="flex items-center gap-6">

              {/* AVATAR */}
              <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl font-bold shadow-xl">
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* INFO */}
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-red-500/10 border border-red-300/20 text-red-100 font-medium mb-4">
                  Administrator Access
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Admin Dashboard
                </h1>

                <p className="mt-3 text-blue-100 text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold text-white">
                    {currentUser?.name}
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-blue-100 text-sm mt-1">Monitoring</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                <h3 className="text-2xl font-bold">Live</h3>
                <p className="text-blue-100 text-sm mt-1">System Status</p>
              </div>

            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* SIDEBAR */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-5 border border-white h-fit">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Control Panel
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Manage platform operations
              </p>
            </div>

            {/* TAB BUTTONS */}
            <div className="space-y-2">

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg scale-[1.02]"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  <span>{tab.label}</span>

                  {activeTab === tab.id && (
                    <span className="text-white/80">›</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl border border-white overflow-hidden">

            {/* CONTENT HEADER */}
            <div className="border-b border-gray-100 px-8 py-6 bg-linear-to-r from-blue-50 to-cyan-50">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                  {tabs.find((t) => t.id === activeTab)?.label?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Manage and monitor platform data
                  </p>
                </div>

              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="p-8">
              {renderTabContent()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;