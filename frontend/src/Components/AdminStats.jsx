// AdminStats.jsx

import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/api";
import axios from "axios";

// ── SVG ICONS ──────────────────────────────────────────
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MedicineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0 2.82 2.82 0 0 1 0 3.79l-2.1 2.1"/>
  </svg>
);

const PharmacyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
    <line x1="12" y1="7" x2="12" y2="7.01"/>
  </svg>
);

const ReportsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7 7 17 7 17 17"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ── COMPONENT ──────────────────────────────────────────
function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin-api/stats`, {
        withCredentials: true,
      });
      setStats(res.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // LOADING UI
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
            Loading dashboard stats...
          </p>
        </div>
      </div>
    );
  }

  // METRIC CARDS CONFIG
  const metrics = [
    {
      title: "Total Users",
      value: stats.users-1 || 0,
      icon: <UsersIcon />,
      accent: "text-blue-600",
      iconBg: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
      bar: "bg-blue-500",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Medicines",
      value: stats.medicines || 0,
      icon: <MedicineIcon />,
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
      bar: "bg-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Pharmacies",
      value: stats.pharmacies || 0,
      icon: <PharmacyIcon />,
      accent: "text-violet-600",
      iconBg: "bg-violet-50 text-violet-600 ring-1 ring-violet-100",
      bar: "bg-violet-500",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Active Reports",
      value: stats.reports || 0,
      icon: <ReportsIcon />,
      accent: "text-orange-600",
      iconBg: "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
      bar: "bg-orange-500",
      gradient: "from-orange-500 to-rose-500",
    },
  ];

  const networkStats = [
    { icon: <ActivityIcon />, value: "24/7", label: "Community Monitoring" },
    { icon: <ActivityIcon />, value: "Live", label: "Verification System" },
    { icon: <LockIcon />,     value: "Secure", label: "Healthcare Data" },
  ];

  return (
    <div className="space-y-8">

      {/* ── TOP HEADER ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Real-time overview of PharmaAtlas
          </p>
        </div>

        {/* LIVE BADGE */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm w-fit shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live System Metrics
        </div>
      </div>

      {/* ── METRIC GRID ────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            {/* TOP ROW */}
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>

            {/* VALUE */}
            <div className="mt-5">
              <h2 className={`text-4xl font-black tracking-tight ${metric.accent}`}>
                {metric.value.toLocaleString()}
              </h2>
              <p className="mt-1.5 text-gray-500 font-semibold text-sm">
                {metric.title}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-[11px] text-gray-400 font-medium">
                Updated just now
              </span>

            </div>

            {/* BOTTOM ACCENT BAR */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${metric.bar} opacity-60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
          </div>
        ))}
      </div>

      {/* ── NETWORK PANEL ──────────────────────────────── */}
      <div className="rounded-2xl bg-gray-950 p-8 text-white shadow-xl overflow-hidden relative">

        {/* SUBTLE GRID TEXTURE */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* GLOW */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <ShieldIcon />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              PharmaAtlas Network
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight mt-2">
            Community-Powered Medicine Tracking
          </h2>

          <p className="mt-3 text-gray-400 max-w-2xl text-sm leading-relaxed">
            Helping patients find life-saving medicines faster through real-time,
            community-verified availability data across verified pharmacies.
          </p>

          {/* QUICK STATS */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {networkStats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-xl px-5 py-4 backdrop-blur-sm hover:bg-white/8 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 shrink-0">
                  {s.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-none">
                    {s.value}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 font-medium">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;