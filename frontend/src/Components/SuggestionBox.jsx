import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import { BASE_URL } from "../config/api.js";
import { useMapStore } from "../store/mapStore.js";

function SuggestionBox() {

  // ─────────────────────────────
  // TABS
  // ─────────────────────────────
  const [activeTab, setActiveTab] = useState("symptoms"); // "symptoms" | "prescription"

  // ─────────────────────────────
  // SYMPTOMS TAB STATE
  // ─────────────────────────────
  const [problem, setProblem] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [symptomsLoading, setSymptomsLoading] = useState(false);

  // ─────────────────────────────
  // PRESCRIPTION TAB STATE
  // ─────────────────────────────
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrStage, setOcrStage] = useState("idle"); // idle | ocr | parsing | done
  const [exactMatches, setExactMatches] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const fileInputRef = useRef();

  // ─────────────────────────────
  // SHARED
  // ─────────────────────────────
  const [medicines, setMedicines] = useState([]);
  const { nearbyReports, setMarkers } = useMapStore();

  // ─────────────────────────────
  // FETCH ALL MEDICINES
  // ─────────────────────────────
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user-api/medicines`, {
          withCredentials: true,
        });
        setMedicines(res.data.payload || []);
      } catch (err) {
        console.log("Failed to fetch medicines", err);
      }
    };
    fetchMedicines();
  }, []);

  // ─────────────────────────────
  // FILTER REPORTS → MARKERS
  // ─────────────────────────────
  const filterMapByMedicine = (medicineName) => {
    const matched = nearbyReports.filter(
      (report) =>
        report?.medicineId?.name?.toLowerCase() === medicineName.toLowerCase()
    );

    if (matched.length === 0) {
      toast.error(`No nearby pharmacies found for ${medicineName}`);
      setMarkers([]);
      return;
    }

    const markers = matched.map((report) => ({
      _id: report._id,
      pharmacyName: report?.pharmacyId?.name,
      address: report?.pharmacyId?.address,
      location: report?.pharmacyId?.location,
      medicineName: report?.medicineId?.name,
      genericName: report?.medicineId?.genericName,
      stockLevel: report.stockLevel,
      isVerified: report?.pharmacyId?.isVerified,
      verifiedCount:
        report?.interactions?.filter((i) => i.action === "verified").length || 0,
      skippedCount:
        report?.interactions?.filter((i) => i.action === "skipped").length || 0,
      deniedCount:
        report?.interactions?.filter((i) => i.action === "denied").length || 0,
      notes: report.notes,
    }));

    setMarkers(markers);
    toast.success(`${markers.length} pharmacies found for ${medicineName}`);
  };

  // ─────────────────────────────
  // SYMPTOMS — AI SUGGESTION
  // ─────────────────────────────
  const handleSuggestion = async () => {
    if (!problem.trim()) return;
    try {
      setSymptomsLoading(true);
      setSuggestions([]);

      const medicineSet = medicines.map((m) => m.name);

      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `
You are an AI medicine suggestion assistant.
ONLY suggest medicines from the provided medicine set.
DO NOT invent medicines.
Return ONLY valid JSON array of TWO medicine objects.
Format:
[{ "medicineName": "Dolo 650", "reason": "Used for fever" }]
              `,
            },
            {
              role: "user",
              content: `Problem: ${problem}\n\nMedicine Set:\n${medicineSet.join(", ")}`,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = res.data.choices[0].message.content;
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setSuggestions(parsed);
    } catch (err) {
      console.log("AI suggestion failed", err);
      toast.error("AI suggestion failed. Please try again.");
    } finally {
      setSymptomsLoading(false);
    }
  };

  // ─────────────────────────────
  // PRESCRIPTION — FILE PICK
  // ─────────────────────────────
  const handleFilePick = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setOcrStage("idle");
    setExactMatches([]);
    setAlternatives([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
    setOcrStage("idle");
    setExactMatches([]);
    setAlternatives([]);
  };

  // ─────────────────────────────
  // PRESCRIPTION — PARSE
  // ─────────────────────────────
  const handlePrescriptionParse = async () => {
    if (!file) return;
    try {
      setOcrStage("ocr");
      setExactMatches([]);
      setAlternatives([]);

      // Step 1 — OCR
      const { data: { text } } = await Tesseract.recognize(file, "eng");

      // Step 2 — backend AI parse
      setOcrStage("parsing");
      const res = await axios.post(
        `${BASE_URL}/user-api/ai/prescription-parser`,
        { extractedText: text },
        { withCredentials: true }
      );

      const { exactMatches: em, alternativeSuggestions: alt } = res.data.payload;
      setExactMatches(em || []);
      setAlternatives(alt || []);
      setOcrStage("done");

      if ((em?.length || 0) === 0 && (alt?.length || 0) === 0) {
        toast.error("No medicines found in prescription");
      } else {
        toast.success("Prescription parsed successfully");
      }
    } catch (err) {
      console.log("Prescription parse failed", err);
      toast.error("Failed to parse prescription");
      setOcrStage("idle");
    }
  };

  // ─────────────────────────────
  // STAGE LABEL
  // ─────────────────────────────
  const stageLabel = {
    idle: null,
    ocr: "📷 Reading prescription...",
    parsing: "🤖 AI is identifying medicines...",
    done: null,
  }[ocrStage];

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  return (
    <div
      className="
      flex flex-col
      w-85
      h-[75vh]
      bg-white/95
      backdrop-blur-xl
      rounded-3xl
      shadow-2xl
      border border-gray-200
      overflow-hidden
      "
    >

      {/* ── HEADER ── */}
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-800">
          🤖 AI Assistant
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Symptom checker · Prescription parser
        </p>

        {/* TABS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`
            flex-1 py-2 rounded-xl text-sm font-semibold transition
            ${activeTab === "symptoms"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }
            `}
          >
            💬 Symptoms
          </button>
          <button
            onClick={() => setActiveTab("prescription")}
            className={`
            flex-1 py-2 rounded-xl text-sm font-semibold transition
            ${activeTab === "prescription"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }
            `}
          >
            📄 Prescription
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* ════════════════════════
            TAB 1 — SYMPTOMS
        ════════════════════════ */}
        {activeTab === "symptoms" && (
          <>
            {/* TEXTAREA */}
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. fever, cold, headache for 2 days..."
              rows={4}
              className="
              w-full resize-none rounded-2xl
              border border-gray-200
              bg-gray-50 outline-none
              p-4 text-sm text-gray-700
              placeholder:text-gray-400
              focus:ring-2 focus:ring-blue-500
              focus:bg-white transition
              "
            />

            {/* BUTTON */}
            <button
              onClick={handleSuggestion}
              disabled={symptomsLoading || !problem.trim()}
              className="
              w-full bg-blue-600 hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-bold py-3
              rounded-2xl transition text-sm
              "
            >
              {symptomsLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Analyzing...
                </span>
              ) : "Get Suggestions"}
            </button>

            {/* SUGGESTIONS RESULTS */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Suggested Medicines
                </h3>
                {suggestions.map((item, i) => (
                  <div
                    key={i}
                    className="
                    p-4 rounded-2xl
                    bg-blue-50 border border-blue-100
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-blue-700 text-sm">
                          💊 {item.medicineName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                      <button
                        onClick={() => filterMapByMedicine(item.medicineName)}
                        className="
                        shrink-0
                        px-3 py-1.5
                        bg-blue-600 hover:bg-blue-700
                        text-white text-xs font-semibold
                        rounded-xl transition
                        "
                      >
                        Find →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ════════════════════════
            TAB 2 — PRESCRIPTION
        ════════════════════════ */}
        {activeTab === "prescription" && (
          <>
            {/* DROP ZONE */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="
              w-full rounded-2xl
              border-2 border-dashed border-gray-300
              hover:border-blue-400
              bg-gray-50 hover:bg-blue-50/30
              transition cursor-pointer
              flex flex-col items-center justify-center
              gap-2 py-6
              "
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-32 rounded-xl object-contain"
                />
              ) : (
                <>
                  <span className="text-3xl">📄</span>
                  <p className="text-sm font-semibold text-gray-600">
                    Drop prescription here
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG · PNG · PDF
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFilePick}
              className="hidden"
            />

            {/* CHANGE FILE */}
            {file && (
              <p className="text-xs text-gray-400 text-center -mt-2 truncate">
                📎 {file.name}
              </p>
            )}

            {/* PARSE BUTTON */}
            <button
              onClick={handlePrescriptionParse}
              disabled={!file || ocrStage === "ocr" || ocrStage === "parsing"}
              className="
              w-full bg-blue-600 hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-bold py-3
              rounded-2xl transition text-sm
              "
            >
              {ocrStage === "ocr" || ocrStage === "parsing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  {stageLabel}
                </span>
              ) : "Parse Prescription"}
            </button>

            {/* EXACT MATCHES */}
            {ocrStage === "done" && exactMatches.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ✅ Found in PharmaAtlas
                </h3>
                {exactMatches.map((med, i) => (
                  <div
                    key={i}
                    className="
                    flex items-center justify-between gap-3
                    p-3 rounded-2xl
                    bg-green-50 border border-green-100
                    "
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-700 truncate">
                        💊 {med.name}
                      </p>
                    </div>
                    <button
                      onClick={() => filterMapByMedicine(med.name)}
                      className="
                      shrink-0
                      px-3 py-1.5
                      bg-green-600 hover:bg-green-700
                      text-white text-xs font-semibold
                      rounded-xl transition
                      "
                    >
                      Find →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ALTERNATIVES */}
            {ocrStage === "done" && alternatives.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ⚠️ Not Found — Alternatives
                </h3>
                {alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="
                    p-3 rounded-2xl
                    bg-orange-50 border border-orange-100
                    space-y-2
                    "
                  >
                    <p className="text-xs text-orange-600 font-semibold">
                      ❌ {alt.requested} — not available
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-gray-700 truncate">
                        💊 {alt.alternative}
                      </p>
                      <button
                        onClick={() => filterMapByMedicine(alt.alternative)}
                        className="
                        shrink-0
                        px-3 py-1.5
                        bg-orange-500 hover:bg-orange-600
                        text-white text-xs font-semibold
                        rounded-xl transition
                        "
                      >
                        Find →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {ocrStage === "done" &&
              exactMatches.length === 0 &&
              alternatives.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  No medicines found in this prescription.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a clearer image.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER DISCLAIMER — always visible ── */}
      <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-yellow-50/60">
        <p className="text-[11px] text-yellow-700 text-center leading-relaxed">
          ⚠️ AI suggestions are informational only. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}

export default SuggestionBox;