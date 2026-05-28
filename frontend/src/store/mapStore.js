// store/mapStore.js

import axios from "axios";
import { create } from "zustand";

import { BASE_URL } from "../config/api.js";

export const useMapStore = create(
  (set, get) => ({

    // ─────────────────────────────
    // STATE
    // ─────────────────────────────

    nearbyPharmacies: [],

    nearbyReports: [],

    markers: [],

    selectedMedicine: null,

    userLocation: null,

    loading: false,

    error: null,

    radius: 100000,





    // ─────────────────────────────
    // GET USER LOCATION
    // ─────────────────────────────

    getLocation: async () => {

      return new Promise((resolve) => {

        navigator.geolocation.getCurrentPosition(

          (position) => {

            const lat =
              position.coords.latitude;

            const lng =
              position.coords.longitude;

            const coords = [lat, lng];

            set({
              userLocation: coords,
            });

            resolve(coords);
          },

          (error) => {

            console.log(
              "Location access denied:",
              error
            );

            // FALLBACK HYDERABAD
            const fallback = [
              17.385,
              78.4867,
            ];

            set({
              userLocation: fallback,
            });

            resolve(fallback);
          }
        );
      });
    },


    // ─────────────────────────────
    // FETCH NEARBY REPORTS
    // ─────────────────────────────

      getReports: async () => {
        try {
          set({
            loading: true,
            error: null,
          });
          let location = get().userLocation;
          // GET LOCATION
          if (!location) {
            location =
              await get().getLocation();
          }
          const [lat, lng] = location;
          // FETCH ONLY NEARBY REPORTS
          const url = `${BASE_URL}/user-api/reports/nearby?lat=${lat}&lng=${lng}&radius=${get().radius}`;
          const res = await axios.get(url,{withCredentials: true});
          const reports = res.data.payload
          set({
            nearbyReports:reports,
            loading: false,
          });

        } catch (err) {
          console.log(err);
          set({
            loading: false,
            error:err.response?.data?.message ||"Failed to fetch reports",
          });
        }
      },


    // ─────────────────────────────
    // FETCH PHARMACIES
    // ─────────────────────────────

    getPharmacies: async () => {

      try {

        set({
          loading: true,
          error: null,
        });

        let location =
          get().userLocation;

        if (!location) {

          location =
            await get().getLocation();
        }

        const [lat, lng] = location;

        const res = await axios.get(
          `${BASE_URL}/user-api/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=${get().radius}`,
          {
            withCredentials: true,
          }
        );

        const pharmacies =
          res.data.payload || [];

        // DEFAULT MARKERS
        set({
          nearbyPharmacies:
            pharmacies,

          markers: pharmacies,

          loading: false,
        });

      } catch (err) {

        console.log(err);

        set({
          loading: false,

          error:
            err.response?.data
              ?.message ||
            "Failed to fetch pharmacies",
        });
      }
    },


    // ─────────────────────────────
    // SELECT MEDICINE
    // ─────────────────────────────

    setSelectedMedicine: async (
      medicine
    ) => {

      set({
        selectedMedicine: medicine,
      });

      // FETCH FILTERED REPORTS
      await get().getReports(
        medicine?._id
      );

      const reports =
        get().nearbyReports;

      const pharmacies =
        get().nearbyPharmacies;

      // GET UNIQUE PHARMACY IDS
      const pharmacyIds =
        reports.map(
          (report) => {

            if (
              typeof report.pharmacyId ===
              "object"
            ) {
              return report.pharmacyId._id;
            }

            return report.pharmacyId;
          }
        );

      // FILTER PHARMACIES
      const filteredPharmacies =
        pharmacies.filter(
          (pharmacy) =>
            pharmacyIds.includes(
              pharmacy._id
            )
        );

      // UPDATE MARKERS
      set({
        markers:
          filteredPharmacies,
      });
    },


    // ─────────────────────────────
    // CLEAR FILTER
    // ─────────────────────────────

    clearMedicineFilter: () => {

      set({
        selectedMedicine: null,

        markers:
          get().nearbyPharmacies,
      });
    },


    // ─────────────────────────────
    // SET MARKERS
    // ─────────────────────────────

    setMarkers: (
      updatedMarkers
    ) => {

      set({
        markers: updatedMarkers,
      });
    },

    setRadius: (value) =>
      set({
        radius: value,
      }),

  })
);