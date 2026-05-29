// Home.jsx

import React, { useState,useEffect } from "react";
import { Bot } from "lucide-react";
import { useAuth } from "../store/authStore.js";
import { useMapStore } from "../store/mapStore.js";
import { socket } from "../socket/socket.js";
import ReportById from "./ReportById.jsx";
import { FilePlus2 } from "lucide-react";

// PUBLIC PAGE
import LandingPage from "./LandingPage.jsx";

// COMPONENTS
import MapView from "./MapView.jsx";
import SearchBar from "./SearchBar.jsx";
import ReportForm from "./ReportForm.jsx";
import NotificationBox from "./NotificationBox.jsx";
import SuggestionBox from "./SuggestionBox.jsx";

function Home() {

  const [selectedReportId, setSelectedReportId] =
  useState(null);

  const [
  openSuggestionBox,
  setOpenSuggestionBox,
] = useState(false);

  const {
    isAuthenticated,
    currentUser,
  } = useAuth();

  const [
    openReportForm,
    setOpenReportForm,
  ] = useState(false);

  const { appendReport } = useMapStore();
  // PUBLIC LANDING PAGE
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  useEffect(() => {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });
      socket.on("report:created", (newReport) => {
        console.log(
          "New realtime report:",
          newReport
        );
        appendReport(newReport);
      });
      return () => {
        socket.off("report:created");
      };
    }, []);

  return (
    <div
      className="relative w-full
      h-[calc(100vh-72px)]
      overflow-hidden"
    >

      {/* MAP */}
      <MapView
        setSelectedReportId={
          setSelectedReportId
        }
      />


      {/* TOP RIGHT CONTROLS */}
<div
  className="
  absolute top-5 right-5
  z-1000

  flex items-center
  gap-3
  "
>

        {/* SEARCH BAR */}
        <div className="w-72.5 md:w-85 lg:w-90">
          <SearchBar />
        </div>


        {/* NOTIFICATION BOX */}
        <NotificationBox />
      </div>

{/* REPORT DETAILS PANEL */}
{selectedReportId && (
  <div
    className="
    fixed top-22 left-5
    z-3000

    w-105
    max-w-[95vw]

    h-[88vh]

    rounded-4xl

    bg-white/82
    backdrop-blur-2xl

    border border-white/60
    shadow-[0_20px_60px_rgba(15,23,42,0.20)]

    overflow-hidden
    "
  >

    {/* CLOSE BUTTON */}
    <button
      onClick={() =>
        setSelectedReportId(null)
      }
      className="
      absolute top-4 right-4
      z-4000

      w-11 h-11
      rounded-2xl

      bg-white/90
      backdrop-blur-md

      border border-slate-200

      flex items-center
      justify-center

      text-slate-500
      hover:text-red-500
      hover:bg-red-50

      shadow-lg
      transition-all duration-200
      "
    >
      ×
    </button>

    {/* SCROLLABLE CONTENT */}
    <div
      className="
      h-full overflow-y-auto
      scrollbar-hide
      "
    >
      <ReportById
        reportId={selectedReportId}
      />
    </div>
  </div>
)}

    {/* FLOATING AI BUTTON + BOX */}
    <div
      className="fixed bottom-8 left-8 z-1200"
    >

        {/* AI BUTTON */}
        <button
          onClick={() => setOpenSuggestionBox(!openSuggestionBox)}
          className="
            w-14 h-14 rounded-full
            bg-indigo-600 hover:bg-indigo-700
            text-white
            shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
          "
          aria-label="AI Assistant"
        >
          <Bot size={22} />
        </button>

  {/* FLOATING BOX */}
  {openSuggestionBox && (

    <div
      className="
      absolute bottom-20 left-0
      w-95
      animate-in fade-in zoom-in-95
    "
    >

      {/* CLOSE BUTTON */}
      <button
        onClick={() =>
          setOpenSuggestionBox(false)
        }

        className="
        absolute -top-3 -right-3
        w-10 h-10 rounded-full
        bg-white shadow-xl
        text-gray-600
        hover:text-red-500
        text-xl z-10
      "
      >
        ✕
      </button>

      <SuggestionBox />
    </div>
  )}
</div>


      {/* FLOATING REPORT BUTTON */}
      {currentUser?.role === "user" && (
        <button
          onClick={() => setOpenReportForm(true)}
          className="
            fixed bottom-6 right-6
            z-50

            w-14 h-14
            rounded-full

            bg-blue-600 hover:bg-blue-700
            active:scale-95

            text-white

            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out

            flex items-center justify-center

            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
          aria-label="Create Report"
          title="Create Report"
        >
          <FilePlus2 size={22} />
        </button>
      )}


      {/* REPORT MODAL */}
      {openReportForm && (
<div
  className="
  fixed inset-0
  z-2000

  bg-slate-900/40
  backdrop-blur-md

  flex items-center justify-center

  p-4 md:p-6

  overflow-hidden
  "
>

          <div
            className="min-h-screen
            flex items-center justify-center
            p-4"
          >

          <div
            className="
            relative

            w-full
            max-w-4xl

            h-[92vh]
            max-h-230

            overflow-hidden

            rounded-[36px]

            bg-white/95
            backdrop-blur-2xl

            border border-white/60

            shadow-[0_25px_80px_rgba(15,23,42,0.28)]

            flex flex-col
            "
          >

              {/* CLOSE BUTTON */}
              <button
                onClick={() =>
                  setOpenReportForm(false)
                }
                className="absolute top-4 right-4
                z-10 w-10 h-10 rounded-full
                bg-gray-100 hover:bg-red-100
                text-gray-600 hover:text-red-500
                text-2xl transition"
              >
                ×
              </button>

              {/* FORM CONTENT */}
              <div
                className="
                flex-1
                min-h-0

                overflow-y-auto

                scrollbar-thin
                scrollbar-thumb-slate-300
                scrollbar-track-transparent
                "
              >
                <ReportForm
                  closeForm={() =>
                    setOpenReportForm(false)
                  }
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;