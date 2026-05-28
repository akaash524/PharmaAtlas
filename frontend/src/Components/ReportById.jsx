// ReportById.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { Copy } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../config/api";

import {
  ShieldCheck,
  Clock3,
  MapPin,
  Package,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  SkipForward,
} from "lucide-react";


function ReportById({
  reportId,
}) {

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // FETCH REPORT
  useEffect(() => {

    const fetchReport =
      async () => {

        try {

          setLoading(true);

          const res =
            await axios.get(

              `${BASE_URL}/user-api/reports/${reportId}`,

              {
                withCredentials: true,
              }
            );

          setReport(
            res.data.payload
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    if (reportId) {

      fetchReport();
    }

  }, [reportId]);


  // LOADING
  if (loading) {

    return (
      <div
        className="
        h-full flex items-center
        justify-center
      "
      >
        <div
          className="
          w-10 h-10 rounded-full
          border-3 border-blue-600
          border-t-transparent
          animate-spin
        "
        />
      </div>
    );
  }


  // NO REPORT
  if (!report) {

    return (
      <div className="p-8">
        Report not found
      </div>
    );
  }


  // TRUST SCORE
  const verifiedCount =
    report.interactions.filter(
      (i) =>
        i.action === "verified"
    ).length;

  const deniedCount =
    report.interactions.filter(
      (i) =>
        i.action === "denied"
    ).length;

  const trustScore = Math.min(
    100,
    verifiedCount * 10 -
    deniedCount * 5 +
    50
  );


  return (

    <div
      className="
      h-full overflow-y-auto
      bg-white/90
      backdrop-blur-2xl
    "
    >

      {/* HEADER */}
      <div
        className="
        sticky top-0 z-20
        bg-white/90 backdrop-blur-xl
        border-b border-slate-200
        px-6 py-5
      "
      >

        <div className="flex items-start justify-between">

          <div>

            <p
              className="
              text-xs uppercase
              tracking-[0.25em]
              text-slate-400
              font-semibold
            "
            >
              Pharmacy Report
            </p>

            <h1
              className="
              mt-2 text-2xl
              font-black text-slate-900
              leading-tight
            "
            >
              {
                report?.pharmacyId?.name
              }
            </h1>

            <div
              className="
              mt-3 flex items-center
              gap-2 flex-wrap
            "
            >

              {/* VERIFIED */}
              <div
                className={`
                px-3 py-1 rounded-full
                text-xs font-semibold
                flex items-center gap-1.5
                ${
                  report?.pharmacyId
                    ?.isVerified

                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"

                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }
              `}
              >
                <ShieldCheck size={14} />

                {
                  report?.pharmacyId
                    ?.isVerified

                    ? "Verified"

                    : "Unverified"
                }
              </div>

              {/* STOCK */}
              <div
                className="
                px-3 py-1 rounded-full
                text-xs font-semibold
                bg-blue-50 text-blue-700
                border border-blue-200
                "
              >
                {
                  report.stockLevel
                } stock
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* BODY */}
      <div className="p-6 space-y-6">


        {/* TRUST SCORE */}
        <div
          className="
          bg-white rounded-3xl
          border border-slate-200
          p-5 shadow-sm
        "
        >

          <div
            className="
            flex items-center
            justify-between
          "
          >

            <div>

              <p
                className="
                text-sm text-slate-500
                font-medium
              "
              >
                Community Trust Score
              </p>

              <h2
                className="
                mt-1 text-4xl
                font-black text-blue-600
              "
              >
                {trustScore}%
              </h2>
            </div>

            <div
              className="
              w-20 h-20 rounded-2xl
              bg-blue-50
              flex items-center
              justify-center
            "
            >
              <ShieldCheck
                className="
                text-blue-600
                "
                size={36}
              />
            </div>
          </div>

          <div
            className="
            mt-5 h-2 rounded-full
            bg-slate-100 overflow-hidden
          "
          >
            <div
              className="
              h-full rounded-full
              bg-linear-to-r
              from-blue-500
              to-cyan-400
            "
              style={{
                width: `${trustScore}%`,
              }}
            />
          </div>
        </div>


        {/* MEDICINE */}
        <div
          className="
          bg-white rounded-3xl
          border border-slate-200
          p-5 shadow-sm
        "
        >

          <div
            className="
            flex items-center gap-3
          "
          >

            <div
              className="
              w-12 h-12 rounded-2xl
              bg-blue-50
              flex items-center
              justify-center
            "
            >
              <Package
                className="
                text-blue-600
                "
              />
            </div>

            <div>

              <p
                className="
                text-xs uppercase
                tracking-widest
                text-slate-400
                font-semibold
              "
              >
                Medicine
              </p>

              <h3
                className="
                text-lg font-bold
                text-slate-900
              "
              >
                {
                  report?.medicineId
                    ?.name
                }
              </h3>

              <p
                className="
                text-sm text-slate-500
              "
              >
                {
                  report?.medicineId
                    ?.genericName
                }
              </p>
            </div>
          </div>
        </div>


        {/* ADDRESS */}
            <div
            className="
            bg-white rounded-3xl
            border border-slate-200
            p-5 shadow-sm
            "
            >
            <div
                className="
                flex items-start justify-between
                gap-4
            "
            >
                
                {/* LEFT */}
                <div
                className="
                flex items-start gap-3
                flex-1
                "
                >
                <div
                    className="
                    w-12 h-12 rounded-2xl
                    bg-emerald-50
                    flex items-center
                    justify-center
                    shrink-0
                "
                >
                    <MapPin
                    className="
                    text-emerald-600
                    "
                    />
                </div>

                <div className="flex-1">
                    <p
                    className="
                    text-xs uppercase
                    tracking-widest
                    text-slate-400
                    font-semibold
                    "
                    >
                    Address
                    </p>

                    <p
                    className="
                    mt-1 text-sm
                    text-slate-700
                    leading-relaxed
                    "
                    >
                    {report?.pharmacyId?.address}
                    </p>
                </div>
                </div>

                {/* COPY BUTTON */}
                <button
                onClick={async () => {
                    try {
                    await navigator.clipboard.writeText(
                        report?.pharmacyId?.address
                    );

                    toast.success(
                        "Address copied"
                    );
                    } catch (err) {
                    toast.error(
                        "Failed to copy"
                    );
                    }
                }}
                className="
                w-11 h-11 rounded-2xl
                border border-slate-200
                bg-slate-50
                hover:bg-slate-100
                flex items-center
                justify-center
                transition-all duration-200
                hover:scale-[1.03]
                shrink-0
                "
                >
                <Copy
                    size={18}
                    className="
                    text-slate-600
                    "
                />
                </button>

            </div>
            </div>


        {/* REPORTED BY */}
        <div
          className="
          bg-white rounded-3xl
          border border-slate-200
          p-5 shadow-sm
        "
        >

          <h3
            className="
            text-sm font-bold
            text-slate-800
            uppercase tracking-widest
          "
          >
            Reported By
          </h3>

          <div
            className="
            mt-4 flex items-center
            gap-4
          "
          >

            <div
              className="
              w-14 h-14 rounded-2xl
              bg-slate-100
              flex items-center
              justify-center
              text-lg font-black
              text-slate-700
            "
            >
              {
                report?.userId?.name
                  ?.charAt(0)
              }
            </div>

            <div>

              <div
                className="
                flex items-center gap-2
              "
              >
                <User
                  size={15}
                  className="text-slate-400"
                />

                <p
                  className="
                  font-semibold
                  text-slate-800
                "
                >
                  {
                    report?.userId
                      ?.name
                  }
                </p>
              </div>

              <div
                className="
                mt-1 flex items-center
                gap-2
              "
              >
                <Mail
                  size={15}
                  className="text-slate-400"
                />

                <p
                  className="
                  text-sm text-slate-500
                "
                >
                  {
                    report?.userId
                      ?.email
                  }
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* INTERACTIONS */}
        <div
          className="
          bg-white rounded-3xl
          border border-slate-200
          p-5 shadow-sm
        "
        >

          <div
            className="
            flex items-center
            justify-between
          "
          >

            <h3
              className="
              text-sm font-bold
              text-slate-800
              uppercase tracking-widest
            "
            >
              Community Interactions
            </h3>

            <div
              className="
              text-sm font-semibold
              text-slate-500
            "
            >
              {
                report.interactions
                  .length
              } actions
            </div>
          </div>


          <div className="mt-5 space-y-3">

            {report.interactions.map(
              (
                interaction,
                index
              ) => {

                const styles = {

                  verified:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",

                  denied:
                    "bg-red-50 text-red-700 border-red-200",

                  skipped:
                    "bg-slate-100 text-slate-600 border-slate-200",
                };

                return (

                  <div
                    key={index}
                    className="
                    border border-slate-200
                    rounded-2xl
                    p-4
                    flex items-start
                    justify-between
                    "
                  >

                    <div
                      className="
                      flex items-start
                      gap-3
                    "
                    >

                      <div
                        className="
                        w-12 h-12 rounded-xl
                        bg-slate-100
                        flex items-center
                        justify-center
                        text-sm font-black
                        text-slate-700
                        "
                      >
                        {
                          interaction
                            ?.userId?.name
                            ?.charAt(0)
                        }
                      </div>

                      <div>

                        <p
                          className="
                          font-semibold
                          text-slate-800
                        "
                        >
                          {
                            interaction
                              ?.userId?.name
                          }
                        </p>

                        <p
                          className="
                          text-sm text-slate-500
                        "
                        >
                          {
                            interaction
                              ?.userId?.email
                          }
                        </p>

                        <div
                          className="
                          mt-2 flex items-center
                          gap-2
                        "
                        >

                          <Clock3
                            size={13}
                            className="text-slate-400"
                          />

                          <p
                            className="
                            text-xs text-slate-400
                          "
                          >
                            {new Date(
                                interaction.actedAt
                                ).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                })}
                          </p>
                        </div>
                      </div>
                    </div>


                    {/* ACTION */}
                    <div
                      className={`
                      px-3 py-1.5 rounded-xl
                      border text-xs font-bold
                      capitalize flex items-center gap-1.5
                      ${
                        styles[
                          interaction.action
                        ]
                      }
                    `}
                    >

                      {interaction.action ===
                        "verified" && (
                        <CheckCircle2
                          size={14}
                        />
                      )}

                      {interaction.action ===
                        "denied" && (
                        <XCircle
                          size={14}
                        />
                      )}

                      {interaction.action ===
                        "skipped" && (
                        <SkipForward
                          size={14}
                        />
                      )}

                      {
                        interaction.action
                      }
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>


        {/* NOTES */}
        {report.notes && (

          <div
            className="
            bg-white rounded-3xl
            border border-slate-200
            p-5 shadow-sm
          "
          >

            <h3
              className="
              text-sm font-bold
              text-slate-800
              uppercase tracking-widest
            "
            >
              Notes
            </h3>

            <p
              className="
              mt-3 text-sm
              leading-relaxed
              text-slate-600
            "
            >
              {report.notes}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ReportById;