// ManageReports.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api.js";

// ── SVG ICONS ──────────────────────────────────────────
const ReportIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const PillIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/>
    <circle cx="17" cy="17" r="5"/>
    <path d="m14.5 19.5 5-5"/>
  </svg>
);

const MapPinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const UserIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CheckCircleIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CalendarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const NotesIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const HashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <line x1="4" y1="9" x2="20" y2="9"/>
    <line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/>
    <line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

// ── HELPERS ────────────────────────────────────────────
const stockConfig = {
  high:   { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  medium: { cls: "bg-amber-50   text-amber-700   ring-amber-200",   dot: "bg-amber-500"   },
  low:    { cls: "bg-rose-50    text-rose-700    ring-rose-200",    dot: "bg-rose-500"    },
};

// ── COMPONENT ──────────────────────────────────────────
function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/admin-api/reports?includeExpired=true`,
        { withCredentials: true }
      );
      setReports(res.data.payload || []);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report permanently?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/admin/reports/${reportId}`,
        { withCredentials: true }
      );
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

  const getExpiryStatus = (expiresAt) => new Date(expiresAt) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
            Loading reports...
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
            Manage Reports
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Monitor all medicine availability reports including expired ones
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm w-fit shadow-sm">
          <ReportIcon className="w-4 h-4 text-orange-500" />
          <span>{reports.length} Reports</span>
        </div>
      </div>

      {/* ── REPORTS LIST ───────────────────────────────── */}
      <div className="space-y-4">
        {reports.map((report) => {
          const isExpired = getExpiryStatus(report.expiresAt);
          const stock     = stockConfig[report.stockLevel] ?? stockConfig.low;

          return (
            <div
              key={report._id}
              className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                isExpired ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"
              }`}
            >

              {/* ── TOP BAR ── */}
              <div
                className={`px-5 py-4 flex flex-wrap items-center justify-between gap-3 ${
                  isExpired
                    ? "bg-gray-100 border-b border-gray-200"
                    : "bg-gray-950 border-b border-white/5"
                }`}
              >
                {/* LEFT: icon + name + pharmacy */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpired
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <PillIcon className="w-4.5 h-4.5" />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-bold leading-tight ${
                        isExpired ? "text-gray-700" : "text-white"
                      }`}
                    >
                      {report?.medicineId?.name}
                    </h2>
                    <p
                      className={`flex items-center gap-1 text-xs mt-0.5 ${
                        isExpired ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <MapPinIcon />
                      {report?.pharmacyId?.name}
                    </p>
                  </div>
                </div>

                {/* RIGHT: status badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ring-1 ${stock.cls}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
                    {report.stockLevel} Stock
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ring-1 ${
                      isExpired
                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isExpired ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                    />
                    {isExpired ? "Expired" : "Active"}
                  </span>
                </div>
              </div>

              {/* ── BODY ── */}
              <div className="p-5 space-y-4">

                {/* NOTES */}
                {report.notes && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      <NotesIcon />
                      Notes
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {report.notes}
                    </p>
                  </div>
                )}

                {/* META GRID */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">

                  {/* REPORTED BY */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                      <UserIcon />
                      Reported By
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {report?.userId?.name}
                    </p>
                  </div>

                  {/* VERIFICATIONS */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-500 mb-1">
                      <CheckCircleIcon />
                      Verifications
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {report.verifyCount || 0}
                    </p>
                  </div>

                  {/* CREATED */}
                  <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-violet-400 mb-1">
                      <CalendarIcon />
                      Created
                    </p>
                    <p className="text-xs font-semibold text-gray-900">
                      {new Date(report.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric",
                        year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* EXPIRES */}
                  <div className={`border rounded-xl px-4 py-3 ${
                    isExpired
                      ? "bg-rose-50 border-rose-100"
                      : "bg-orange-50 border-orange-100"
                  }`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1 ${
                      isExpired ? "text-rose-400" : "text-orange-400"
                    }`}>
                      <ClockIcon />
                      Expires
                    </p>
                    <p className="text-xs font-semibold text-gray-900">
                      {new Date(report.expiresAt).toLocaleString("en-US", {
                        month: "short", day: "numeric",
                        year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                    <HashIcon />
                    {report._id}
                  </span>

                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-500 hover:text-white hover:ring-rose-500 text-xs font-semibold transition-all duration-150 w-fit"
                  >
                    <TrashIcon />
                    Delete Report
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── EMPTY STATE ── */}
        {reports.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <ReportIcon className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-base font-bold text-gray-900">No Reports Found</h2>
            <p className="mt-1 text-sm text-gray-400">
              No medicine availability reports available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageReports;