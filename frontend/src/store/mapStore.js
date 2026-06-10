import axios from "axios";
import { create } from "zustand";
import { BASE_URL } from "../config/api.js";

import { socket } from "../socket/socket.js";


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

    socketInitialized: false,



    // ─────────────────────────────
    // SOCKET INITIALIZER
    // ─────────────────────────────

    initializeSocket: () => {

      // PREVENT DUPLICATE LISTENERS
      if (get().socketInitialized) {
        return;
      }

      console.log("Initializing socket listeners...");

      /*
      ========================================
      NEW REPORT
      ========================================
      */

      socket.on("report:created", async (data) => {

        console.log(
          "Live update → report-created"
        );

        get().appendReport(data);
      });

      /*
      ========================================
      REPORT DELETED
      ========================================
      */

      socket.on("report:deleted", async () => {

        console.log(
          "Live update → report-deleted"
        );

        await get().refreshMapData();
      });

      /*
      ========================================
      REPORT UPDATED
      ========================================
      */

      socket.on("report:updated", async () => {

        console.log(
          "Live update → report-updated"
        );

        await get().refreshMapData();
      });

      set({
        socketInitialized: true,
      });
    },



    // ─────────────────────────────
    // REFRESH MAP DATA
    // ─────────────────────────────

    refreshMapData: async () => {

      await get().getReports();

      const selectedMedicine =
        get().selectedMedicine;

      /*
      ========================================
      RE-APPLY FILTER
      ========================================
      */

      if (selectedMedicine) {

        const reports =
          get().nearbyReports;

        const filteredReports =
          reports.filter(
            (report) =>
              report?.medicineId?._id ===
              selectedMedicine._id
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

        set({
          markers: newMarkers,
        });
      }
    },



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
    // FETCH REPORTS
    // ─────────────────────────────

    getReports: async () => {

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

        const url =
          `${BASE_URL}/user-api/reports/nearby?lat=${lat}&lng=${lng}&radius=${get().radius}`;

        const res = await axios.get(
          url,
          {
            withCredentials: true,
          }
        );

        const reports =
          res.data.payload;

        set({
          nearbyReports: reports,
          loading: false,
        });

      } catch (err) {

        console.log(err);

        set({
          loading: false,

          error:
            err.response?.data
              ?.message ||
            "Failed to fetch reports",
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

      await get().refreshMapData();
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

    //append new reports
    appendReport: (newReport) => {
        set((state) => ({
          nearbyReports: [
            newReport,
            ...state.nearbyReports,
          ],

          // markers: [
          //   {
          //     reportId: newReport._id,

          //     medicineName:
          //       newReport?.medicineId?.name,

          //     isVerified:
          //       newReport?.pharmacyId?.isVerified,

          //     genericName:
          //       newReport?.medicineId?.genericName,

          //     stockLevel:
          //       newReport?.stockLevel,

          //     verifiedCount: 0,
          //     skippedCount: 0,
          //     deniedCount: 0,

          //     pharmacyName:
          //       newReport?.pharmacyId?.name,

          //     address:
          //       newReport?.pharmacyId?.address,

          //     location:
          //       newReport?.pharmacyId?.location,

          //     notes:
          //       newReport?.notes,
          //   },

          //   ...state.markers,
          // ],
        }));
    },


    // ─────────────────────────────
    // SET RADIUS
    // ─────────────────────────────

    setRadius: (value) =>
      set({
        radius: value,
      }),

  })
);