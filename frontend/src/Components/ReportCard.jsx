// ReportCard.jsx

import React, { useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api.js";
import { useAuth } from "../store/authStore.js";
function ReportCard({ report, refreshReports }) {
  const [loading, setLoading] = useState(false);

  const {currentUser}=useAuth()
  // STOCK BADGE COLORS
  const stockStyles = {
    low: "bg-red-100 text-red-700 border-red-200",
    medium:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-green-100 text-green-700 border-green-200",
  };

  // TIME REMAINING
  const expiryText = useMemo(() => {
    if (!report?.expiresAt) return "No expiry";

    const now = new Date();
    const expiry = new Date(report.expiresAt);

    const diffMs = expiry - now;

    if (diffMs <= 0) {
      return "Expired";
    }

    const hours = Math.floor(
      diffMs / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    if (hours > 0) {
      return `expires in ${hours}h`;
    }

    return `expires in ${minutes}m`;
  }, [report]);

  // VERIFY REPORT
  const handleVerify = async (type) => {
    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/reports/${report._id}/verify`,
        {
          action: type, // confirm / deny
        },
        {
          withCredentials: true,
        }
      );

      if (refreshReports) {
        refreshReports();
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

return (

  <div
    className="
    group relative overflow-hidden

    rounded-4xl

    bg-white/95
    backdrop-blur-xl

    border border-slate-200

    shadow-[0_10px_35px_rgba(15,23,42,0.06)]

    hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]

    transition-all duration-500
    hover:-translate-y-1
    "
  >

    {/* HOVER GRADIENT */}
    <div
      className="
      absolute inset-0 opacity-0
      group-hover:opacity-100
      transition duration-500

      bg-linear-to-br
      from-blue-500/3
      via-cyan-500/2
      to-transparent
      "
    />


    <div className="relative p-7">

{/* TOP */}
<div
  className="
  flex items-start
  justify-between
  gap-5
  "
>

  {/* LEFT */}
  <div className="min-w-0 flex-1">

    {/* TAG ROW */}
    <div className="flex items-center gap-2 flex-wrap">

      {/* MEDICINE TAG */}
      <div
        className="
        inline-flex items-center
        px-3 py-1 rounded-full

        bg-blue-50
        border border-blue-100

        text-[11px]
        font-bold
        uppercase tracking-[0.18em]
        text-blue-700
        "
      >
        Medicine Report
      </div>

      {/* STOCK BADGE */}
      <div
        className={`
        inline-flex items-center

        px-3 py-1 rounded-full
        border

        text-[11px]
        font-bold
        uppercase tracking-[0.12em]

        ${
          stockStyles[
            report?.stockLevel
          ]
        }
      `}
      >
        {report?.stockLevel} Stock
      </div>
    </div>

    {/* MEDICINE NAME */}
    <h2
      className="
      mt-4 text-[28px]
      font-black
      tracking-tight
      text-slate-900

      leading-tight
      "
    >
      {report?.medicineId?.name}
    </h2>

    {/* PHARMACY */}
    <div
      className="
      mt-4 flex items-center
      gap-2
      "
    >

      <div
        className="
        w-2.5 h-2.5 rounded-full
        bg-slate-300
        "
      />

      <p
        className="
        text-[15px]
        text-slate-500
        font-medium
        truncate
        "
      >
        {report?.pharmacyId?.name}
      </p>
    </div>
  </div>
</div>


      {/* NOTES */}
      {report?.notes && (

        <div
          className="
          mt-7

          rounded-3xl
          border border-slate-200

          bg-slate-50/80

          p-5
          "
        >

          <p
            className="
            text-[15px]
            leading-relaxed
            text-slate-600
            "
          >
            {report.notes}
          </p>
        </div>
      )}


      {/* STATS */}
      <div
        className="
        mt-7
        grid grid-cols-2 md:grid-cols-3
        gap-4
        "
      >

        {/* VERIFY COUNT */}
        <div
          className="
          rounded-3xl
          border border-blue-100

          bg-blue-50/70

          px-5 py-4
          "
        >

          <p
            className="
            text-[11px]
            uppercase tracking-widest
            text-blue-500
            font-bold
            "
          >
            Verifications
          </p>

          <h3
            className="
            mt-2 text-3xl
            font-black
            text-blue-700
            "
          >
            {report?.interactions.length || 0}
          </h3>
        </div>


        {/* EXPIRY */}
        <div
          className={`
          rounded-3xl

          px-5 py-4

          border

          ${
            expiryText === "Expired"

              ? "bg-red-50 border-red-100"

              : "bg-orange-50 border-orange-100"
          }
        `}
        >

          <p
            className={`
            text-[11px]
            uppercase tracking-widest
            font-bold

            ${
              expiryText === "Expired"

                ? "text-red-500"

                : "text-orange-500"
            }
          `}
          >
            Status
          </p>

          <h3
            className={`
            mt-2 text-lg
            font-black

            ${
              expiryText === "Expired"

                ? "text-red-700"

                : "text-orange-700"
            }
          `}
          >
            {expiryText}
          </h3>
        </div>


        {/* REPORTER */}
        <div
          className="
          rounded-3xl
          border border-slate-200

          bg-slate-50

          px-5 py-4
          "
        >

          <p
            className="
            text-[11px]
            uppercase tracking-widest
            text-slate-400
            font-bold
            "
          >
            Reported By
          </p>

          <h3
            className="
            mt-2 text-[15px]
            font-bold
            text-slate-800
            truncate
            "
          >
            {report?.userId?.name ||
              "Anonymous"}
          </h3>
        </div>
      </div>


      {/* ACTIONS */}
      {currentUser?.role === "admin" && (

        <div
          className="
          mt-8
          grid grid-cols-2
          gap-4
          "
        >

          {/* CONFIRM */}
          <button
            onClick={() =>
              handleVerify("confirm")
            }
            disabled={loading}
            className="
            h-14 rounded-2xl

            bg-linear-to-r
            from-emerald-500
            to-green-500

            hover:from-emerald-600
            hover:to-green-600

            text-white
            text-sm font-bold
            tracking-wide

            shadow-lg shadow-emerald-500/20

            transition-all duration-300
            hover:scale-[1.02]
            active:scale-[0.98]

            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            Confirm Report
          </button>


          {/* DENY */}
          <button
            onClick={() =>
              handleVerify("deny")
            }
            disabled={loading}
            className="
            h-14 rounded-2xl

            bg-linear-to-r
            from-red-500
            to-rose-500

            hover:from-red-600
            hover:to-rose-600

            text-white
            text-sm font-bold
            tracking-wide

            shadow-lg shadow-red-500/20

            transition-all duration-300
            hover:scale-[1.02]
            active:scale-[0.98]

            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            Deny Report
          </button>
        </div>
      )}


      {/* FOOTER */}
      <div
        className="
        mt-8 pt-5

        border-t border-slate-100

        flex flex-col md:flex-row
        md:items-center
        md:justify-between

        gap-3
        "
      >

        {/* LEFT */}
        <div
          className="
          flex items-center gap-3
          "
        >

          <div
            className="
            w-10 h-10 rounded-2xl

            bg-linear-to-br
            from-slate-100
            to-slate-200

            flex items-center justify-center

            text-sm font-black
            text-slate-700
            "
          >
            {report?.userId?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>

            <p
              className="
              text-sm font-bold
              text-slate-800
              "
            >
              {report?.userId?.name ||
                "Anonymous"}
            </p>

            <p
              className="
              text-xs text-slate-400
              "
            >
              Submitted report
            </p>
          </div>
        </div>


        {/* DATE */}
        <div
          className="
          text-sm
          text-slate-400
          font-medium
          "
        >
          {new Date(
            report.createdAt
          ).toLocaleString()}
        </div>

      </div>
    </div>
  </div>
);
}

export default ReportCard;