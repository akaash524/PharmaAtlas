// ManagePharmacies.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api.js";

// ── SVG ICONS ──────────────────────────────────────────
const HospitalIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <path d="M9 22V12h6v10"/>
    <path d="M12 7v5M9.5 9.5h5"/>
  </svg>
);

const MapPinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BuildingIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12.01"/>
    <path d="M12 12v4"/>
  </svg>
);

const LayersIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

const ShieldCheckIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
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

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const HashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <line x1="4" y1="9" x2="20" y2="9"/>
    <line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/>
    <line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

// ── SHARED STYLES ──────────────────────────────────────
const inputCls = `
  w-full px-4 py-3 rounded-xl
  bg-white/10 backdrop-blur-xl
  border border-white/20
  text-white text-sm font-medium
  placeholder:text-white/40
  outline-none focus:ring-2 focus:ring-white/60
  transition
`;

// ── COMPONENT ──────────────────────────────────────────
function ManagePharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading]       = useState(false);

  const [newPharmacy, setNewPharmacy] = useState({
    name: "", address: "", city: "", state: "",
    latitude: "", longitude: "", isVerified: false,
  });

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin-api/pharmacies`, {
        withCredentials: true,
      });
      setPharmacies(res.data.payload || []);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPharmacies(); }, []);

  const handleAddPharmacy = async (e) => {
    e.preventDefault();
    try {
      const pharmacyData = {
        name:       newPharmacy.name,
        address:    newPharmacy.address,
        city:       newPharmacy.city,
        state:      newPharmacy.state,
        isVerified: newPharmacy.isVerified,
        location: {
          type: "Point",
          coordinates: [
            Number(newPharmacy.longitude),
            Number(newPharmacy.latitude),
          ],
        },
      };
      const res = await axios.post(
        `${BASE_URL}/admin-api/pharmacies`,
        pharmacyData,
        { withCredentials: true }
      );
      setPharmacies((prev) => [res.data.payload, ...prev]);
      setNewPharmacy({ name: "", address: "", city: "", state: "", latitude: "", longitude: "", isVerified: false });
      alert("Pharmacy added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add pharmacy");
    }
  };

  const handleToggleVerify = async (pharmacyId, currentStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin-api/pharmacies/${pharmacyId}/verify`,
        { isVerified: !currentStatus },
        { withCredentials: true }
      );
      setPharmacies((prev) =>
        prev.map((p) => p._id === pharmacyId ? { ...p, isVerified: !currentStatus } : p)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Verification update failed");
    }
  };

  const handleDelete = async (pharmacyId) => {
    if (!window.confirm("Delete this pharmacy permanently?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin-api/pharmacies/${pharmacyId}`, {
        withCredentials: true,
      });
      setPharmacies((prev) => prev.filter((p) => p._id !== pharmacyId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
            Loading pharmacies...
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
            Manage Pharmacies
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Monitor and verify pharmacy partners
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm w-fit shadow-sm">
          <HospitalIcon className="w-4 h-4 text-violet-500" />
          <span>{pharmacies.length} Pharmacies</span>
        </div>
      </div>

      {/* ── ADD PHARMACY FORM ──────────────────────────── */}
      <div className="rounded-2xl overflow-hidden bg-gray-950 shadow-xl text-white relative">

        {/* GRID TEXTURE */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* GLOW */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8">

          {/* FORM HEADER */}
          <div className="flex items-center gap-2 mb-1">
            <CompassIcon />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              PharmaAtlas Pharmacy Registry
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-2">Add New Pharmacy</h2>
          <p className="mt-1.5 text-gray-400 text-sm">
            Register pharmacies with geo-coordinates for live medicine tracking
          </p>

          {/* FORM */}
          <form onSubmit={handleAddPharmacy} className="grid lg:grid-cols-2 gap-4 mt-7">

            {/* NAME */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Pharmacy Name
              </label>
              <input type="text" required placeholder="Apollo Pharmacy"
                value={newPharmacy.name}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* CITY */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                City
              </label>
              <input type="text" required placeholder="Hyderabad"
                value={newPharmacy.city}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, city: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* ADDRESS */}
            <div className="lg:col-span-2">
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Address
              </label>
              <textarea required rows={2} placeholder="Complete pharmacy address..."
                value={newPharmacy.address}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* STATE */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                State
              </label>
              <input type="text" required placeholder="Telangana"
                value={newPharmacy.state}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, state: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* VERIFICATION TOGGLE */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Verification Status
              </label>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-11.5">
                <span className="text-sm font-medium text-white/80">Verified Pharmacy</span>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={newPharmacy.isVerified}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, isVerified: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/20 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6" />
                </label>
              </div>
            </div>

            {/* LATITUDE */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Latitude
              </label>
              <input type="number" step="any" required placeholder="17.3850"
                value={newPharmacy.latitude}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, latitude: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* LONGITUDE */}
            <div>
              <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Longitude
              </label>
              <input type="number" step="any" required placeholder="78.4867"
                value={newPharmacy.longitude}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, longitude: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="lg:col-span-2 mt-1 flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-sm rounded-xl px-6 py-3.5 hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <PlusIcon />
              Add Pharmacy
            </button>
          </form>
        </div>
      </div>

      {/* ── PHARMACY LIST ──────────────────────────────── */}
      <div className="space-y-3">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* MAIN ROW */}
            <div className="p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                  <HospitalIcon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  {/* NAME + BADGE */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900">
                      {pharmacy.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ring-1 ${
                        pharmacy.isVerified
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-amber-200"
                      }`}
                    >
                      <ShieldCheckIcon className="w-3 h-3" />
                      {pharmacy.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  {/* ADDRESS */}
                  <p className="mt-1 text-gray-400 text-xs flex items-start gap-1.5 leading-relaxed">
                    <MapPinIcon className="w-3 h-3 mt-0.5 shrink-0" />
                    {pharmacy.address}
                  </p>

                  {/* CITY + STATE CHIPS */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {pharmacy.city && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 ring-1 ring-gray-100 text-[11px] font-semibold">
                        <BuildingIcon />
                        {pharmacy.city}
                      </span>
                    )}
                    {pharmacy.state && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-[11px] font-semibold">
                        <LayersIcon />
                        {pharmacy.state}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleVerify(pharmacy._id, pharmacy.isVerified)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold ring-1 transition-all duration-150 ${
                    pharmacy.isVerified
                      ? "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-500 hover:text-white hover:ring-amber-500"
                      : "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-500 hover:text-white hover:ring-emerald-500"
                  }`}
                >
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  {pharmacy.isVerified ? "Remove Verify" : "Verify"}
                </button>

                <button
                  onClick={() => handleDelete(pharmacy._id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-500 hover:text-white hover:ring-rose-500 text-xs font-semibold transition-all duration-150"
                >
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <CalendarIcon />
                Added{" "}
                {new Date(pharmacy.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                <HashIcon />
                {pharmacy._id}
              </span>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {pharmacies.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <HospitalIcon className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-base font-bold text-gray-900">No Pharmacies Found</h2>
            <p className="mt-1 text-sm text-gray-400">
              Add your first pharmacy using the form above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePharmacies;