import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import searchIcon from "../assets/search.png";

import axios from "axios";

import toast from "react-hot-toast";

import { BASE_URL } from "../config/api.js";

import { useMapStore }
from "../store/mapStore.js";

function SearchBar() {

  const [query, setQuery] =
    useState("");

  const [
    allMedicines,
    setAllMedicines,
  ] = useState([]);

  const [
    filteredMedicines,
    setFilteredMedicines,
  ] = useState([]);

  const [
    showDropdown,
    setShowDropdown,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const searchRef = useRef();

  const {
    setSelectedMedicine,
    clearMedicineFilter,
    selectedMedicine,
    nearbyReports,
    getReports,
    setMarkers,
    setRadius,
    radius,
  } = useMapStore();


  // ─────────────────────────────
  // FETCH ALL MEDICINES
  // ─────────────────────────────

  useEffect(() => {

    fetchMedicines();

    getReports();

  }, []);

  const fetchMedicines =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(
            `${BASE_URL}/user-api/medicines`,
            {
              withCredentials: true,
            }
          );

        setAllMedicines(
          res.data.payload || []
        );

      } catch (err) {

        console.log(
          "Medicine fetch failed",
          err
        );

      } finally {

        setLoading(false);
      }
    };


  // ─────────────────────────────
  // FILTER MEDICINES
  // ─────────────────────────────

  useEffect(() => {

    if (!query.trim()) {

      setFilteredMedicines([]);

      return;
    }

    const filtered =
      allMedicines.filter(
        (medicine) =>
          medicine.name
            .toLowerCase()
            .startsWith(
              query.toLowerCase()
            )
      );

    setFilteredMedicines(filtered);

    setShowDropdown(true);

  }, [query, allMedicines]);


  // ─────────────────────────────
  // OUTSIDE CLICK
  // ─────────────────────────────

  useEffect(() => {

    const handleOutsideClick =
      (e) => {

        if (
          !searchRef.current?.contains(
            e.target
          )
        ) {

          setShowDropdown(false);
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
  // SELECT MEDICINE
  // ─────────────────────────────

  const handleSelectMedicine =
    async (medicine) => {

      const filteredReports =
        nearbyReports.filter(
          (report) =>
            report?.medicineId?._id ===
            medicine._id
        );

      const newMarkers =
        filteredReports.map(
          (report) => ({

            reportId: report._id,

            medicineName:
              report?.medicineId?.name,

            isVerified:
              report?.pharmacyId
                ?.isVerified,

            genericName:
              report?.medicineId
                ?.genericName,

            stockLevel:
              report?.stockLevel,

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

            pharmacyName:
              report?.pharmacyId?.name,

            address:
              report?.pharmacyId
                ?.address,

            location:
              report?.pharmacyId
                ?.location,

            notes:
              report?.notes,
          }));

      if (newMarkers.length === 0) {

        toast.error(
          `No nearby pharmacies found for ${medicine.name}. Try increasing radius.`
        );

      } else {

        toast.success(
          `${newMarkers.length} pharmacies found for ${medicine.name}`
        );
      }

      setMarkers(newMarkers);

      setQuery(medicine.name);

      setShowDropdown(false);
    };


  // ─────────────────────────────
  // CLEAR FILTER
  // ─────────────────────────────

  const handleClear = () => {

    setQuery("");

    setFilteredMedicines([]);

    clearMedicineFilter();
  };


  return (

    <div
      ref={searchRef}
      className="relative w-full"
    >

      {/* SEARCH BOX */}
      <div
        className="
        backdrop-blur-2xl
        bg-white/60

        border border-white/40

        shadow-[0_8px_40px_rgba(0,0,0,0.12)]

        rounded-[50px]

        overflow-hidden

        supports-backdrop-filter:bg-white/40

        animate-[float_6s_ease-in-out_infinite]
        "
      >

        <div
          className="
          flex items-center gap-3

          px-4 py-2.5
          "
        >

          {/* SEARCH ICON */}
          <div
            className="
            shrink-0

            w-9 h-9

            rounded-2xl

            bg-blue-500/10

            flex items-center
            justify-center
            "
          >

            <img
              src={searchIcon}
              alt="search"
              className="
              w-4 h-4
              object-contain
              opacity-80
              "
            />
          </div>


          {/* INPUT */}
          <input
            type="text"

            placeholder="Search medicines..."

            value={query}

            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }

            onFocus={() => {

              if (
                filteredMedicines.length > 0
              ) {

                setShowDropdown(true);
              }
            }}

            className="
            flex-1

            bg-transparent

            text-[15px]
            font-medium
            text-gray-800

            placeholder:text-gray-400

            outline-none
            "
          />


          {/* RADIUS */}
          <select
            value={radius}

            onChange={async (e) => {

              const value =
                Number(e.target.value);

              setRadius(value);

              await getReports();
            }}

            className="
            px-4 py-2.5

            rounded-2xl

            bg-white/70
            backdrop-blur-md

            border border-white/50

            text-sm font-semibold
            text-gray-700

            shadow-sm

            outline-none

            hover:bg-white

            transition

            cursor-pointer
            "
          >

            <option value={10000}>
              10km
            </option>

            <option value={30000}>
              30km
            </option>

            <option value={50000}>
              50km
            </option>

            <option value={100000}>
              100km
            </option>

            <option value={200000}>
              200km
            </option>

          </select>


          {/* CLEAR */}
          {selectedMedicine && (

            <button
              onClick={handleClear}

              className="
              px-4 py-2

              rounded-2xl

              bg-red-500/10
              text-red-600

              font-medium
              text-sm

              hover:bg-red-500/20

              transition
              "
            >
              Clear
            </button>
          )}


          {/* LOADING */}
          {loading && (

            <div
              className="
              w-5 h-5

              border-2 border-blue-500
              border-t-transparent

              rounded-full

              animate-spin
              shrink-0
              "
            />
          )}
        </div>
      </div>


      {/* DROPDOWN */}
      {showDropdown && (

        <div
          className="
          absolute top-full mt-4

          w-full

          backdrop-blur-2xl
          bg-white/70

          border border-white/40

          shadow-[0_20px_60px_rgba(0,0,0,0.18)]

          rounded-[28px]

          overflow-hidden

          max-h-105
          overflow-y-auto

          z-3000
          "
        >

          {/* EMPTY STATE */}
          {query &&
            filteredMedicines.length === 0 && (

            <div
              className="
              px-6 py-8
              text-center
              "
            >

              <p
                className="
                text-gray-500
                font-medium
                "
              >
                No medicines found
              </p>

              <p
                className="
                text-sm
                text-gray-400
                mt-1
                "
              >
                Try another medicine name
              </p>
            </div>
          )}


          {/* RESULTS */}
          {filteredMedicines.map(
            (medicine) => (

              <button
                key={medicine._id}

                onClick={() =>
                  handleSelectMedicine(
                    medicine
                  )
                }

                className="
                group

                w-full text-left

                px-5 py-4

                transition-all duration-200

                hover:bg-blue-500/8

                border-b border-black/5
                last:border-none
                "
              >

                <div
                  className="
                  flex items-center
                  justify-between
                  gap-4
                  "
                >

                  {/* LEFT */}
                  <div
                    className="
                    min-w-0
                    "
                  >

                    <h3
                      className="
                      font-semibold
                      text-gray-800

                      group-hover:text-blue-700

                      transition

                      truncate
                      "
                    >
                      💊 {medicine.name}
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
                        medicine.genericName
                      }
                    </p>
                  </div>


                  {/* CATEGORY */}
                  <span
                    className="
                    shrink-0

                    text-[11px]

                    bg-blue-500/10
                    text-blue-700

                    px-3 py-1.5

                    rounded-full

                    font-semibold

                    capitalize
                    "
                  >
                    {
                      medicine.category
                    }
                  </span>
                </div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;