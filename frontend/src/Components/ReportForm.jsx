// ReportForm.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { BASE_URL } from "../config/api";

function ReportForm({
  closeForm,
}) {
  const [medicines, setMedicines] =
    useState([]);

  const [
    nearbyPharmacies,
    setNearbyPharmacies,
  ] = useState([]);

  const [
    pharmacyResults,
    setPharmacyResults,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    searchingPharmacy,
    setSearchingPharmacy,
  ] = useState(false);

  const [
    loadingNearby,
    setLoadingNearby,
  ] = useState(true);

  const [
    showAddPharmacy,
    setShowAddPharmacy,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      medicineId: "",
      pharmacyId: "",
      stockLevel: "medium",
      notes: "",
    });

  const [
    pharmacySearch,
    setPharmacySearch,
  ] = useState("");

  const [
    newPharmacy,
    setNewPharmacy,
  ] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchMedicines();
    fetchNearbyPharmacies();
  }, []);

  // FETCH MEDICINES
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
        console.log(err);
      }
    };

  // FETCH PHARMACIES
  const fetchNearbyPharmacies =
    async () => {
      try {
        setLoadingNearby(true);

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const lat =
                position.coords.latitude;

              const lng =
                position.coords.longitude;

              const res =
                await axios.get(
                  `${BASE_URL}/user-api/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=30000`,
                  {
                    withCredentials: true,
                  }
                );

              setNearbyPharmacies(
                res.data.payload || []
              );
            } catch (err) {
              console.log(err);
            } finally {
              setLoadingNearby(
                false
              );
            }
          },
          () => {
            setLoadingNearby(
              false
            );
          }
        );
      } catch (err) {
        console.log(err);
        setLoadingNearby(false);
      }
    };

  // SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      if (
        pharmacySearch.trim()
          .length < 2
      ) {
        setPharmacyResults([]);
        return;
      }

      searchPharmacies();
    }, 400);

    return () =>
      clearTimeout(delay);
  }, [pharmacySearch]);

  const searchPharmacies =
    async () => {
      try {
        setSearchingPharmacy(true);

        const filtered =
          nearbyPharmacies.filter(
            (pharmacy) =>
              pharmacy.name
                ?.toLowerCase()
                .includes(
                  pharmacySearch.toLowerCase()
                ) ||
              pharmacy.address
                ?.toLowerCase()
                .includes(
                  pharmacySearch.toLowerCase()
                ) ||
              pharmacy.city
                ?.toLowerCase()
                .includes(
                  pharmacySearch.toLowerCase()
                )
          );

        setPharmacyResults(
          filtered
        );
      } catch (err) {
        console.log(err);
      } finally {
        setSearchingPharmacy(
          false
        );
      }
    };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SELECT PHARMACY
  const handleSelectPharmacy =
    (pharmacy) => {
      setFormData({
        ...formData,
        pharmacyId:
          pharmacy._id,
      });

      setPharmacySearch(
        pharmacy.name
      );

      setPharmacyResults([]);
      setShowAddPharmacy(
        false
      );
    };

  // ADD PHARMACY
  const handleAddNewPharmacy =
    async (e) => {
      e.preventDefault();

      try {
        const pharmacyData = {
          name: newPharmacy.name,
          address:
            newPharmacy.address,
          city: newPharmacy.city,
          state:
            newPharmacy.state,

          location: {
            type: "Point",
            coordinates: [
              Number(
                newPharmacy.longitude
              ),
              Number(
                newPharmacy.latitude
              ),
            ],
          },
        };

        const res =
          await axios.post(
            `${BASE_URL}/user-api/pharmacies`,
            pharmacyData,
            {
              withCredentials: true,
            }
          );

        const createdPharmacy =
          res.data.payload;

        setFormData({
          ...formData,
          pharmacyId:
            createdPharmacy._id,
        });

        setPharmacySearch(
          createdPharmacy.name
        );

        setNearbyPharmacies(
          (prev) => [
            createdPharmacy,
            ...prev,
          ]
        );

        setShowAddPharmacy(
          false
        );
      } catch (err) {
        console.log(err);

        alert(
          err.response?.data
            ?.message ||
            "Failed to add pharmacy"
        );
      }
    };

  // SUBMIT
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!formData.pharmacyId) {
        return alert(
          "Please select a pharmacy"
        );
      }

      try {
        setLoading(true);

        await axios.post(
          `${BASE_URL}/user-api/reports`,
          formData,
          {
            withCredentials: true,
          }
        );

        closeForm();
      } catch (err) {
        console.log(err);

        alert(
          err.response?.data
            ?.message ||
            "Failed to submit report"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
      w-full
      max-h-[90vh]
      overflow-y-auto

      rounded-4xl

      bg-white/95
      backdrop-blur-xl

      border border-slate-200

      shadow-[0_25px_60px_rgba(15,23,42,0.08)]

      p-8 md:p-10

      scrollbar-thin
      scrollbar-thumb-slate-300
      scrollbar-track-transparent
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <div
            className="
            inline-flex items-center
            px-3 py-1.5 rounded-full

            bg-blue-50
            border border-blue-100

            text-[11px]
            uppercase tracking-[0.18em]
            font-bold
            text-blue-700
            "
          >
            Medicine Availability
          </div>

          <h2
            className="
            mt-5
            text-4xl
            font-black
            tracking-tight
            text-slate-900
            "
          >
            Submit Report
          </h2>

          <p
            className="
            mt-3
            text-slate-500
            text-[15px]
            leading-relaxed
            max-w-xl
            "
          >
            Share real-time medicine
            stock availability to help
            nearby patients locate
            medicines faster.
          </p>
        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* MEDICINE */}
        <div>
          <label
            className="
            block mb-3

            text-sm
            font-bold
            tracking-wide
            text-slate-700
            "
          >
            Select Medicine
          </label>
<div className="relative">
  
  <select
    name="medicineId"
    value={formData.medicineId}
    onChange={handleChange}
    required
    className="
    w-full
    min-w-0

    appearance-none

    rounded-2xl

    border border-slate-200

    bg-white

    px-5 pr-12 py-4

    text-[15px]
    font-medium
    text-slate-700

    outline-none

    transition-all duration-200

    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/10

    hover:border-slate-300
    "
  >
    <option value="">
      Select Medicine
    </option>

    {medicines.map((medicine) => (
      <option
        key={medicine._id}
        value={medicine._id}
      >
        {medicine.name}
      </option>
    ))}
  </select>

  {/* CUSTOM ARROW */}
  <div
    className="
    pointer-events-none

    absolute right-4 top-1/2
    -translate-y-1/2

    text-slate-400
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
        </div>

        {/* PHARMACY */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label
              className="
              text-sm
              font-bold
              tracking-wide
              text-slate-700
              "
            >
              Nearby Pharmacies
            </label>

            <button
              type="button"
              onClick={() =>
                setShowAddPharmacy(
                  !showAddPharmacy
                )
              }
              className="
              text-sm
              font-bold
              text-blue-600

              hover:text-blue-700
              transition
              "
            >
              Add Pharmacy
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search nearby pharmacies..."
            value={
              pharmacySearch
            }
            onChange={(e) => {
              setPharmacySearch(
                e.target.value
              );

              setFormData({
                ...formData,
                pharmacyId: "",
              });
            }}
            className="
            w-full h-14

            rounded-2xl

            border border-slate-200
            bg-slate-50

            px-5

            text-slate-800

            outline-none

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100

            transition
            "
          />

          {/* SEARCHING */}
          {searchingPharmacy && (
            <p className="mt-3 text-sm text-slate-500">
              Searching pharmacies...
            </p>
          )}

          {/* PHARMACY LIST */}
          <div
            className="
            mt-4

            max-h-65
            overflow-y-auto

            space-y-3

            pr-1
            "
          >
            {(pharmacySearch
              ? pharmacyResults
              : nearbyPharmacies
            ).map((pharmacy) => (
              <button
                key={
                  pharmacy._id
                }
                type="button"
                onClick={() =>
                  handleSelectPharmacy(
                    pharmacy
                  )
                }
                className={`
                w-full text-left

                rounded-3xl

                border

                p-5

                transition-all duration-300

                ${
                  formData.pharmacyId ===
                  pharmacy._id
                    ? `
                      border-blue-500
                      bg-blue-50
                      shadow-lg shadow-blue-100
                    `
                    : `
                      border-slate-200
                      bg-white
                      hover:border-slate-300
                      hover:bg-slate-50
                    `
                }
              `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="
                      text-[15px]
                      font-bold
                      text-slate-900
                      "
                    >
                      {
                        pharmacy.name
                      }
                    </h3>

                    <p
                      className="
                      mt-2
                      text-sm
                      text-slate-500
                      "
                    >
                      {
                        pharmacy.address
                      }
                    </p>
                  </div>

                  {pharmacy.isVerified && (
                    <div
                      className="
                      shrink-0

                      px-3 py-1.5
                      rounded-full

                      bg-emerald-50
                      border border-emerald-100

                      text-[11px]
                      font-bold
                      uppercase tracking-wide

                      text-emerald-700
                      "
                    >
                      Verified
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ADD PHARMACY */}
        {showAddPharmacy && (
          <div
            className="
            rounded-[30px]

            border border-blue-100

            bg-linear-to-br
            from-blue-50
            to-cyan-50

            p-7

            space-y-6
            "
          >
            <div>
              <h3
                className="
                text-2xl
                font-black
                text-slate-900
                "
              >
                Add New Pharmacy
              </h3>

              <p className="mt-2 text-slate-500">
                Add pharmacy details
                if it's not listed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  placeholder:
                    "Pharmacy Name",
                  key: "name",
                },
                {
                  placeholder:
                    "City",
                  key: "city",
                },
                {
                  placeholder:
                    "State",
                  key: "state",
                },
                {
                  placeholder:
                    "Latitude",
                  key: "latitude",
                },
                {
                  placeholder:
                    "Longitude",
                  key: "longitude",
                },
              ].map((field) => (
                <input
                  key={field.key}
                  type="text"
                  placeholder={
                    field.placeholder
                  }
                  value={
                    newPharmacy[
                      field.key
                    ]
                  }
                  onChange={(e) =>
                    setNewPharmacy({
                      ...newPharmacy,
                      [field.key]:
                        e.target
                          .value,
                    })
                  }
                  className="
                  h-14

                  rounded-2xl

                  border border-white/70
                  bg-white

                  px-5

                  text-slate-800

                  outline-none

                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100

                  transition
                  "
                />
              ))}

              <textarea
                rows="4"
                placeholder="Address"
                value={
                  newPharmacy.address
                }
                onChange={(e) =>
                  setNewPharmacy({
                    ...newPharmacy,
                    address:
                      e.target.value,
                  })
                }
                className="
                md:col-span-2

                rounded-2xl

                border border-white/70
                bg-white

                p-5

                resize-none

                outline-none

                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100

                transition
                "
              />
            </div>

            <button
              type="button"
              onClick={
                handleAddNewPharmacy
              }
              className="
              w-full h-14

              rounded-2xl

              bg-linear-to-r
              from-blue-600
              to-cyan-500

              text-white
              font-bold

              shadow-lg
              shadow-blue-500/20

              hover:shadow-xl
              hover:scale-[1.01]

              transition-all duration-300
              "
            >
              Save Pharmacy
            </button>
          </div>
        )}

        {/* STOCK LEVEL */}
        <div>
          <label
            className="
            block mb-3

            text-sm
            font-bold
            tracking-wide
            text-slate-700
            "
          >
            Stock Level
          </label>

          <div className="grid grid-cols-3 gap-4">
            {[
              "low",
              "medium",
              "high",
            ].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    stockLevel:
                      level,
                  })
                }
                className={`
                h-14 rounded-2xl

                text-sm font-bold
                capitalize

                border

                transition-all duration-300

                ${
                  formData.stockLevel ===
                  level
                    ? `
                    border-blue-600
                    bg-blue-600
                    text-white
                    shadow-lg shadow-blue-500/20
                  `
                    : `
                    border-slate-200
                    bg-slate-50
                    text-slate-700

                    hover:bg-slate-100
                  `
                }
              `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div>
          <label
            className="
            block mb-3

            text-sm
            font-bold
            tracking-wide
            text-slate-700
            "
          >
            Additional Notes
          </label>

          <textarea
            rows="5"
            name="notes"
            value={formData.notes}
            onChange={
              handleChange
            }
            placeholder="Add useful information about medicine availability, timings, quantity, or alternatives..."
            className="
            w-full

            rounded-3xl

            border border-slate-200
            bg-slate-50

            p-5

            text-slate-800
            leading-relaxed

            resize-none

            outline-none

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100

            transition
            "
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-full h-16

          rounded-3xl

          bg-linear-to-r
          from-blue-600
          to-cyan-500

          text-white
          text-lg
          font-black
          tracking-wide

          shadow-[0_20px_45px_rgba(37,99,235,0.25)]

          hover:shadow-[0_25px_55px_rgba(37,99,235,0.35)]
          hover:scale-[1.01]

          transition-all duration-300

          disabled:opacity-50
          disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Submitting Report..."
            : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;