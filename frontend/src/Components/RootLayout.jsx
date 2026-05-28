import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../store/authStore.js";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-zinc-600 text-lg tracking-wide">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
          <Outlet />
      </main>


    </div>
  );
}

export default RootLayout;