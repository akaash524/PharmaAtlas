// MyReports.jsx
import { Trash2 } from "lucide-react";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api.js";

import ReportCard from "./ReportCard.jsx";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] =
    useState(false);

  // FETCH MY REPORTS
  const fetchMyReports = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/user-api/my-reports`,
        {
          withCredentials: true,
        }
      );

      setReports(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  // DELETE REPORT
  const handleDeleteReport = async (
    reportId
  ) => {
    const confirmDelete = window.confirm(
      "Delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/reports/${reportId}`,
        {
          withCredentials: true,
        }
      );

      // REMOVE FROM UI
      setReports((prev) =>
        prev.filter(
          (report) =>
            report._id !== reportId
        )
      );
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete report"
      );
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        
        <div className="text-center">
          
          <div
            className="w-14 h-14 border-4
            border-blue-500 border-t-transparent
            rounded-full animate-spin mx-auto"
          />

          <p className="mt-5 text-gray-500 font-medium">
            Loading your reports...
          </p>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (reports.length === 0) {
    return (
      <div
        className="bg-gray-50 rounded-[28px]
        p-14 text-center border border-dashed
        border-gray-300"
      >
        
        <div className="text-7xl mb-6">
          📭
        </div>

        <h2 className="text-3xl font-black text-gray-900">
          No Reports Yet
        </h2>

        <p className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed">
          You haven’t submitted any medicine
          availability reports yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* REPORT COUNT */}
      <div className="flex items-center justify-between">
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Your Submitted Reports
          </h2>

          <p className="text-gray-500 mt-1">
            {reports.length} total reports
          </p>
        </div>
      </div>

      {/* REPORT LIST */}
      <div className="grid gap-6">
        
        {reports.map((report) => (
          <div
            key={report._id}
            className="relative"
          >
            
<button
  onClick={() =>
    handleDeleteReport(
      report._id
    )
  }
  className="
  absolute top-5 right-5
  z-100

  h-11 px-4
  rounded-2xl

  bg-white/70
  backdrop-blur-xl

  border border-white/60

  shadow-[0_8px_25px_rgba(15,23,42,0.08)]

  hover:bg-red-500
  hover:border-red-500

  text-slate-500
  hover:text-white

  flex items-center gap-2

  transition-all duration-300
  hover:scale-[1.03]
  active:scale-[0.98]
  "
>

  <Trash2 size={16} />

  <span
    className="
    text-xs font-bold
    tracking-wide
    "
  >
    Delete
  </span>
</button>
            {/* REPORT CARD */}
            <ReportCard
              report={report}
              refreshReports={
                fetchMyReports
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReports;