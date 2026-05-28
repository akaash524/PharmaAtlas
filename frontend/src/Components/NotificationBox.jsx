import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";
import { BASE_URL } from "../config/api.js";


import { useMapStore }
from "../store/mapStore.js";

import { useAuth }
from "../store/authStore.js";

function NotificationBox() {

  const {
    nearbyReports,
    selectedMedicine,
    getReports,
  } = useMapStore();

  const { currentUser } =
    useAuth();

  const nearby_Reports_Without_Interactions =
    nearbyReports.filter(
      (report) =>
        !report.interactions.some(
          (interaction) =>
            interaction.userId.toString() ===
            currentUser._id.toString()
        )
    );

  const [loadingId, setLoadingId] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const notificationRef =
    useRef();


  // ─────────────────────────────
  // CLOSE ON OUTSIDE CLICK
  // ─────────────────────────────

  useEffect(() => {

    const handleOutsideClick =
      (e) => {

        if (
          !notificationRef.current?.contains(
            e.target
          )
        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, []);


  // ─────────────────────────────
  // SORT REPORTS
  // ─────────────────────────────

  const sortedReports =
    useMemo(() => {

      return [
        ...nearby_Reports_Without_Interactions,
      ].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    }, [
      nearby_Reports_Without_Interactions,
    ]);


  // ─────────────────────────────
  // HANDLE INTERACTION
  // ─────────────────────────────

  const handleInteraction =
    async (reportId, action) => {

      try {

        setLoadingId(reportId);

        await axios.post(
          `${BASE_URL}/user-api/reports/${reportId}/interact`,
          { action },
          {
            withCredentials: true,
          }
        );

        await getReports(
          selectedMedicine?._id
        );

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data
            ?.message ||
            "Interaction failed"
        );

      } finally {

        setLoadingId(null);
      }
    };


  return (

    <div
      ref={notificationRef}
      className="relative"
    >

      {/* NOTIFICATION BUTTON */}
      <button
        onClick={() =>
          setOpen(!open)
        }

        className="
        relative

        h-12 w-12

        rounded-3xl

        backdrop-blur-2xl
        bg-white/55

        border border-white/40

        shadow-[0_8px_40px_rgba(0,0,0,0.12)]

        flex items-center
        justify-center

        text-[18px]

        transition-all duration-300

        hover:scale-105
        hover:bg-white/70
        "
      >

        <span
          className="
          text-gray-700
          "
        >
          🔔
        </span>


        {/* COUNT */}
        {sortedReports.length > 0 && (

          <span
            className="
            absolute -top-1.5 -right-1.5

            min-w-5 h-5

            px-1

            rounded-full

            bg-red-500

            text-white
            text-[10px]
            font-bold

            flex items-center
            justify-center

            shadow-lg
            "
          >
            {sortedReports.length}
          </span>
        )}
      </button>


      {/* DROPDOWN */}
      {open && (

        <div
          className="
          absolute top-16 right-0

          w-97.5

          max-h-[78vh]

          overflow-hidden

          rounded-[30px]

          backdrop-blur-2xl
          bg-white/60

          border border-white/40

          shadow-[0_20px_70px_rgba(0,0,0,0.18)]

          animate-in fade-in zoom-in-95

          z-4000
          "
        >

          {/* HEADER */}
          <div
            className="
            px-6 py-5

            border-b border-black/5

            bg-white/20
            "
          >

            <div
              className="
              flex items-center
              justify-between
              "
            >

              <div>

                <h2
                  className="
                  text-lg
                  font-bold
                  text-gray-900
                  "
                >
                  Nearby Reports
                </h2>

                <p
                  className="
                  text-sm
                  text-gray-500
                  mt-1
                  "
                >
                  Real-time medicine activity
                </p>
              </div>


              <div
                className="
                w-10 h-10

                rounded-2xl

                bg-blue-500/10

                flex items-center
                justify-center

                text-blue-700
                text-lg
                "
              >
                🔔
              </div>
            </div>
          </div>


          {/* EMPTY STATE */}
          {sortedReports.length ===
            0 && (

            <div
              className="
              px-8 py-14

              text-center
              "
            >

              <div
                className="
                w-16 h-16

                mx-auto

                rounded-3xl

                bg-gray-100

                flex items-center
                justify-center

                text-2xl
                "
              >
                📭
              </div>

              <h3
                className="
                mt-5

                text-lg
                font-semibold
                text-gray-800
                "
              >
                No Reports Nearby
              </h3>

              <p
                className="
                text-sm
                text-gray-500

                mt-2
                "
              >
                New medicine activity
                will appear here.
              </p>
            </div>
          )}


          {/* REPORTS */}
          <div
            className="
            overflow-y-auto

            max-h-[68vh]
            "
          >

            {sortedReports.map(
              (report) => {

                const minutesAgo =
                  Math.floor(
                    (Date.now() -
                      new Date(
                        report.createdAt
                      )) /
                      1000 /
                      60
                  );

                const stockColors =
                  {
                    low:
                      "bg-red-100 text-red-700",

                    medium:
                      "bg-yellow-100 text-yellow-700",

                    high:
                      "bg-green-100 text-green-700",
                  };

                return (

                  <div
                    key={report._id}

                    className="
                    p-5

                    border-b border-black/5

                    hover:bg-white/30

                    transition-all duration-200
                    "
                  >

                    {/* TOP */}
                    <div
                      className="
                      flex items-start
                      justify-between
                      gap-4
                      "
                    >

                      <div
                        className="
                        min-w-0
                        "
                      >

                        <h3
                          className="
                          text-[16px]
                          font-bold
                          text-gray-900

                          truncate
                          "
                        >
                          {
                            report
                              ?.medicineId
                              ?.name
                          }
                        </h3>

                        <p
                          className="
                          text-sm
                          text-gray-500

                          mt-1

                          truncate
                          "
                        >
                          {
                            report
                              ?.medicineId
                              ?.genericName
                          }
                        </p>
                      </div>


                      {/* STOCK */}
                      <span
                        className={`
                        px-3 py-1.5

                        rounded-full

                        text-[11px]
                        font-semibold
                        uppercase

                        shrink-0

                        ${
                          stockColors[
                            report
                              ?.stockLevel
                          ]
                        }
                        `}
                      >
                        {
                          report.stockLevel
                        }
                      </span>
                    </div>


                    {/* PHARMACY */}
                    <div
                      className="
                      mt-4
                      "
                    >

                      <p
                        className="
                        font-semibold
                        text-gray-800
                        "
                      >
                        {
                          report
                            ?.pharmacyId
                            ?.name
                        }
                      </p>

                      <p
                        className="
                        text-sm
                        text-gray-500

                        mt-1
                        leading-relaxed
                        "
                      >
                        {
                          report
                            ?.pharmacyId
                            ?.address
                        }
                      </p>
                    </div>


                    {/* META */}
                    <div
                      className="
                      mt-4

                      flex items-center
                      justify-between
                      "
                    >

                      <div
                        className="
                        text-xs
                        text-gray-500
                        "
                      >
                        {minutesAgo <= 0
                          ? "Just now"
                          : `${minutesAgo} mins ago`}
                      </div>

                      <div
                        className="
                        text-xs
                        font-semibold
                        text-blue-700
                        "
                      >
                        {
                          report
                            ?.interactions
                            ?.filter(
                              (i) =>
                                i.action ===
                                "verified"
                            ).length
                        }{" "}
                        verified
                      </div>
                    </div>


                    {/* ACTIONS */}
                    <div
                      className="
                      grid grid-cols-3

                      gap-2

                      mt-5
                      "
                    >

                      {/* VERIFY */}
                      <button
                        onClick={() =>
                          handleInteraction(
                            report._id,
                            "verified"
                          )
                        }

                        disabled={
                          loadingId ===
                          report._id
                        }

                        className="
                        py-2.5

                        rounded-2xl

                        bg-green-500/10
                        text-green-700

                        text-sm
                        font-semibold

                        hover:bg-green-500
                        hover:text-white

                        transition-all duration-200

                        disabled:opacity-50
                        "
                      >
                        Verify
                      </button>


                      {/* DECLINE */}
                      <button
                        onClick={() =>
                          handleInteraction(
                            report._id,
                            "denied"
                          )
                        }

                        disabled={
                          loadingId ===
                          report._id
                        }

                        className="
                        py-2.5

                        rounded-2xl

                        bg-red-500/10
                        text-red-700

                        text-sm
                        font-semibold

                        hover:bg-red-500
                        hover:text-white

                        transition-all duration-200

                        disabled:opacity-50
                        "
                      >
                        Decline
                      </button>


                      {/* SKIP */}
                      <button
                        onClick={() =>
                          handleInteraction(
                            report._id,
                            "skipped"
                          )
                        }

                        disabled={
                          loadingId ===
                          report._id
                        }

                        className="
                        py-2.5

                        rounded-2xl

                        bg-gray-200/70
                        text-gray-700

                        text-sm
                        font-semibold

                        hover:bg-gray-700
                        hover:text-white

                        transition-all duration-200

                        disabled:opacity-50
                        "
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBox;