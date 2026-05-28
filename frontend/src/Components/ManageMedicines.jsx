// ManageMedicines.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

// ── SVG ICONS ──────────────────────────────────────────
const PillIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/>
    <circle cx="17" cy="17" r="5"/>
    <path d="m14.5 19.5 5-5"/>
  </svg>
);

const PenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const FlaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 3h6M5.5 21h13a1 1 0 0 0 .9-1.45L14 9V4H10V9L4.6 19.55A1 1 0 0 0 5.5 21z"/>
    <path d="M6 15h12"/>
  </svg>
);

// ── SHARED INPUT STYLE ─────────────────────────────────
const inputCls = `
  w-full px-4 py-3 rounded-xl
  bg-white/10 backdrop-blur-xl
  border border-white/20
  text-white placeholder:text-white/50
  text-sm font-medium
  outline-none focus:ring-2 focus:ring-white/60
  transition
`;

const editInputCls = `
  w-full px-4 py-2.5 rounded-xl
  border border-gray-200 bg-gray-50
  text-sm text-gray-800 font-medium
  outline-none focus:ring-2 focus:ring-blue-500
  transition
`;

// ── COMPONENT ──────────────────────────────────────────
function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newMedicine, setNewMedicine] = useState({
    name: "", genericName: "", category: "", manufacturer: "", isRare: true,
  });

  const [editData, setEditData] = useState({
    name: "", genericName: "", category: "", manufacturer: "", isRare: true,
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin-api/medicines`, {
        withCredentials: true,
      });
      setMedicines(res.data.payload || []);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/admin-api/medicines`, newMedicine, {
        withCredentials: true,
      });
      setMedicines((prev) => [res.data.payload, ...prev]);
      setNewMedicine({ name: "", genericName: "", category: "", manufacturer: "", isRare: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add medicine");
    }
  };

  const handleDelete = async (medicineId) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin-api/medicines/${medicineId}`, {
        withCredentials: true,
      });
      setMedicines((prev) => prev.filter((m) => m._id !== medicineId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const startEditing = (medicine) => {
    setEditingId(medicine._id);
    setEditData({
      name: medicine.name,
      genericName: medicine.genericName,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      isRare: medicine.isRare,
    });
  };

  const handleSaveEdit = async (medicineId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/admin-api/medicines/${medicineId}`,
        editData,
        { withCredentials: true }
      );
      setMedicines((prev) =>
        prev.map((m) => (m._id === medicineId ? res.data.payload : m))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
            Loading medicines...
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
            Manage Medicines
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Add, edit, and organize medicine inventory
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm w-fit shadow-sm">
          <PillIcon className="w-4 h-4 text-blue-500" />
          <span>{medicines.length} Medicines</span>
        </div>
      </div>

      {/* ── ADD FORM ───────────────────────────────────── */}
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
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8">

          {/* FORM HEADER */}
          <div className="flex items-center gap-2 mb-1">
            <FlaskIcon />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              PharmaAtlas Medicine Registry
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight mt-2">
            Add New Medicine
          </h2>
          <p className="mt-1.5 text-gray-400 text-sm">
            Register medicines available in the PharmaAtlas ecosystem
          </p>

          {/* FORM */}
          <form onSubmit={handleAddMedicine} className="grid lg:grid-cols-2 gap-4 mt-7">

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Medicine Name
              </label>
              <input
                type="text" placeholder="Paracetamol 650" required
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Generic Name
              </label>
              <input
                type="text" placeholder="Acetaminophen" required
                value={newMedicine.genericName}
                onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </label>
              <input
                type="text" placeholder="Pain Relief" required
                value={newMedicine.category}
                onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Manufacturer
              </label>
              <input
                type="text" placeholder="Sun Pharma" required
                value={newMedicine.manufacturer}
                onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* IS RARE TOGGLE */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <div>
                  <h3 className="font-semibold text-sm text-white">Rare Medicine</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Mark if this medicine is difficult to find in local pharmacies
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={newMedicine.isRare}
                    onChange={(e) => setNewMedicine({ ...newMedicine, isRare: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/20 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6" />
                </label>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="lg:col-span-2 mt-1 flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-sm rounded-xl px-6 py-3.5 hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <PlusIcon />
              Add Medicine
            </button>
          </form>
        </div>
      </div>

      {/* ── MEDICINE LIST ──────────────────────────────── */}
      <div className="space-y-3">
        {medicines.map((medicine) => (
          <div
            key={medicine._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {editingId === medicine._id ? (

              /* ── EDIT MODE ── */
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Editing — {medicine.name}
                </p>
                <div className="grid lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</label>
                    <input
                      type="text" value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className={editInputCls}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Generic Name</label>
                    <input
                      type="text" value={editData.genericName}
                      onChange={(e) => setEditData({ ...editData, genericName: e.target.value })}
                      className={editInputCls}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                    <input
                      type="text" value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className={editInputCls}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleSaveEdit(medicine._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                  >
                    <CheckIcon /> Save Changes
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition"
                  >
                    <XIcon /> Cancel
                  </button>
                </div>
              </div>

            ) : (

              /* ── NORMAL MODE ── */
              <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <PillIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-gray-900">
                        {medicine.name}
                      </h2>
                      {medicine.isRare && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                          Rare
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {medicine.genericName}
                      {medicine.manufacturer && (
                        <span className="text-gray-300 mx-1.5">·</span>
                      )}
                      {medicine.manufacturer}
                    </p>
                    <span className="mt-1.5 inline-flex px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-[11px] font-semibold">
                      {medicine.category}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEditing(medicine)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-500 hover:text-white hover:ring-amber-500 text-xs font-semibold transition-all duration-150"
                  >
                    <PenIcon /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-500 hover:text-white hover:ring-rose-500 text-xs font-semibold transition-all duration-150"
                  >
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* EMPTY STATE */}
        {medicines.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <PillIcon className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-base font-bold text-gray-900">No Medicines Found</h2>
            <p className="mt-1 text-sm text-gray-400">Add your first medicine entry using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageMedicines;