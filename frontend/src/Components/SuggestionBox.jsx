// components/SuggestionBox.jsx
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { BASE_URL } from "../config/api";

import { useMapStore } from "../store/mapStore";

function SuggestionBox() {

  const [problem, setProblem] =
    useState("");

  const [medicines, setMedicines] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const {
    nearbyReports,
    setMarkers,
  } = useMapStore();


  // ─────────────────────────────
  // FETCH ALL MEDICINES
  // ─────────────────────────────

  useEffect(() => {

    fetchMedicines();

  }, []);


  const fetchMedicines =
    async () => {

      try {

        const res =
          await axios.get(
            `${BASE_URL}/user-api/medicines`,
            {
              withCredentials: true,
            }
          );

        setMedicines(
          res.data.payload || []
        );

      } catch (err) {

        console.log(
          "Failed to fetch medicines",
          err
        );
      }
    };


  // ─────────────────────────────
  // GET AI SUGGESTIONS
  // ─────────────────────────────
const handleSuggestion =
  async () => {

    if (!problem.trim()) return;

    try {

      setLoading(true);

      // MEDICINE SET
      const medicineSet =
        medicines.map(
          (medicine) =>
            medicine.name
        );

      // GROQ API
      const res =
        await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",

          {
            model:
              "llama-3.3-70b-versatile",

            messages: [
              {
                role: "system",

                content: `
You are an AI medicine suggestion assistant.

ONLY suggest medicines from the provided medicine set.

DO NOT invent medicines.

Return ONLY valid JSON array of TWO medicine objects.

Format:
[
  {
    "medicineName":"Dolo 650",
    "reason":"Used for fever"
  }
]
                `,
              },

              {
                role: "user",

                content: `
Problem:
${problem}

Medicine Set:
${medicineSet.join(", ")}
                `,
              },
            ],

            temperature: 0.3,
          },

          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      // AI TEXT
      const text =
        res.data.choices[0]
          .message.content;

      // CLEAN JSON
      const cleaned =
        text
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      const parsed =
        JSON.parse(cleaned);

      setSuggestions(parsed);

      // FILTER REPORTS
      const matchedReports =
        nearbyReports.filter(
          (report) =>

            parsed.some(
              (item) =>
                item.medicineName
                  .toLowerCase() ===
                report?.medicineId?.name
                  ?.toLowerCase()
            )
        );

                // NO MATCHED REPORTS
        if (matchedReports.length === 0) {

          toast.error(
            "No nearby pharmacies found for suggested medicines"
          );

          setMarkers([]);

          return;
        }

      // CREATE MARKERS
      const updatedMarkers =
        matchedReports.map(
          (report) => ({

            _id: report._id,

            pharmacyName:
              report?.pharmacyId
                ?.name,

            address:
              report?.pharmacyId
                ?.address,

            location:
              report?.pharmacyId
                ?.location,

            medicineName:
              report?.medicineId
                ?.name,

            genericName:
              report?.medicineId
                ?.genericName,

            stockLevel:
              report.stockLevel,

            verifiedCount:
              report?.interactions?.filter(
                (i) =>
                  i.action ===
                  "verified"
              ).length || 0,

            skippedCount:
              report?.interactions?.filter(
                (i) =>
                  i.action ===
                  "skipped"
              ).length || 0,

            deniedCount:
              report?.interactions?.filter(
                (i) =>
                  i.action ===
                  "denied"
              ).length || 0,

            notes:
              report.notes,
          })
        );

      setMarkers(
        updatedMarkers
      );

    } catch (err) {

      console.log(
        "AI suggestion failed",
        err
      );

    } finally {

      setLoading(false);
    }
  };


  return (
<div
  className="
  w-85
  max-h-[75vh]
  overflow-y-auto

  bg-white/95
  backdrop-blur-xl

  rounded-3xl
  shadow-2xl
  border border-gray-200

  p-3
  "
>

      {/* TITLE */}
      <h2
        className="text-xl font-black
        text-gray-800"
      >
        AI Medicine Suggestion
      </h2>

      <p
        className="text-sm text-gray-500
        mt-1"
      >
        Describe your symptoms or
        health condition
      </p>


      {/* TEXTAREA */}
      <textarea
        value={problem}

        onChange={(e) =>
          setProblem(
            e.target.value
          )
        }

        placeholder="Example: fever, cold, headache..."

        className="w-full mt-4 h-24
        resize-none rounded-2xl
        border border-gray-300
        outline-none p-4
        focus:ring-2 focus:ring-blue-500"
      />


      {/* BUTTON */}
      <button
        onClick={handleSuggestion}

        disabled={loading}

        className="w-full mt-4
        bg-blue-600 hover:bg-blue-700
        text-white font-bold py-3
        rounded-2xl transition"
      >
        {loading
          ? "Analyzing..."
          : "Get Suggestions"}
      </button>


      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (

        <div className="mt-6">

          <h3
            className="font-bold
            text-gray-800 mb-3"
          >
            Suggested Medicines
          </h3>

          <div className="space-y-3">

            {suggestions.map(
              (item, index) => (

                <div
                  key={index}

                  className="p-4 rounded-2xl
                  bg-blue-50 border
                  border-blue-100"
                >

                  <div
                    className="flex items-center
                    justify-between"
                  >

                    <h4
                      className="font-bold
                      text-blue-700"
                    >
                      💊{" "}
                      {
                        item.medicineName
                      }
                    </h4>
                  </div>

                  <p
                    className="text-sm
                    text-gray-600 mt-2"
                  >
                    {item.reason}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}


      {/* DISCLAIMER */}
      <div
        className="mt-5 p-3 rounded-2xl
        bg-yellow-50 border
        border-yellow-200"
      >
        <p
          className="text-xs
          text-yellow-700"
        >
          AI suggestions are
          informational only.
          Consult a healthcare
          professional before
          taking medication.
        </p>
      </div>
    </div>
  );
}

export default SuggestionBox;